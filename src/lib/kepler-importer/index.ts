import {assert} from 'console';
import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types';
import {PrometheusDriver, SampleValue} from 'prometheus-query';

const J_TO_KWH = 3600000;
export const KeplerPlugin = (globalConfig: ConfigParams): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (
    inputs: PluginParams[],
    config?: ConfigParams
  ): Promise<PluginParams[]> => {
    if (config === undefined) {
      throw new Error('Config for Kepler plugin must be provided.');
    }

    globalConfig;
    const endpoint = config['prometheus-endpoint'];
    const step = config['kepler-observation-window'];
    const namespace = config['container-namespace'];
    const container = config['container-name'];

    const outputs = [];
    for (const input of inputs) {
      const start = new Date(input['timestamp']);
      const duration = input['duration'];
      const end = new Date(start.getTime() + duration * 1000 - 1);

      const serie = await prometheus(
        endpoint,
        start,
        end,
        step,
        namespace,
        container
      );
      const energy = serie.values.map((sample: SampleValue) => ({
        ...input,
        timestamp: sample.time,
        energy: sample.value / J_TO_KWH,
        duration: step,
      }));
      outputs.push(energy);
    }
    return outputs.flat(1);
  };

  return {
    metadata,
    execute,
  };
};

async function prometheus(
  endpoint: string,
  start: Date,
  end: Date,
  step: number,
  namespace: string,
  container: string
) {
  const prom = new PrometheusDriver({endpoint: endpoint, baseURL: '/api/v1'});
  const promql = `sum(increase(kepler_container_joules_total{container_namespace="${namespace}", container_name="${container}"}[${step}s]))`;
  const query = prom.rangeQuery(promql, start, end, step);
  const res = await query;

  assert(res.result.length === 1);
  const serie = res.result[0];
  return serie;
}
