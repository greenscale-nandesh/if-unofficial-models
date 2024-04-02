import {assert} from 'console';
import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types';
import {PrometheusDriver, SampleValue} from 'prometheus-query';
import {z} from 'zod';
import {validate} from '../../util/validations';

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

    const keplerConfig = getKeplerConfig(config);

    globalConfig;

    const outputs = [];
    for (const input of inputs) {
      const start = new Date(input['timestamp']);
      const duration = input['duration'];
      const end = new Date(start.getTime() + duration * 1000 - 1);

      const serie = await prometheus(start, end, keplerConfig);
      const energy = serie.values.map((sample: SampleValue) => ({
        ...input,
        timestamp: sample.time,
        energy: sample.value / J_TO_KWH,
        duration: keplerConfig.step,
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

async function prometheus(start: Date, end: Date, config: KeplerConfig) {
  const prom = new PrometheusDriver({
    endpoint: config.endpoint,
    baseURL: '/api/v1',
  });
  const promql = `sum(increase(kepler_container_joules_total{container_namespace="${config.namespace}", container_name="${config.container}"}[${config.step}s]))`;
  const query = prom.rangeQuery(promql, start, end, config.step);
  const res = await query;
  assert(res.result.length === 1);
  const serie = res.result[0];
  return serie;
}

type KeplerConfig = {
  endpoint: string;
  step: number;
  namespace: string;
  container: string;
};
export function getKeplerConfig(config: ConfigParams): KeplerConfig {
  // TODO: mybe check that all parameters are well-defined
  const regexp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  const schema = z.object({
    'prometheus-endpoint': z.string().refine(s => isValidHttpUrl(s)),
    'kepler-observation-window': z.number().int().positive(),
    'container-namespace': z.string().regex(regexp),
    'container-name': z.string().regex(regexp),
  });
  const validatedConfig = validate<z.infer<typeof schema>>(schema, config);
  return {
    endpoint: validatedConfig['prometheus-endpoint'],
    step: validatedConfig['kepler-observation-window'],
    namespace: validatedConfig['container-namespace'],
    container: validatedConfig['container-name'],
  };
}

function isValidHttpUrl(s: string) {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
