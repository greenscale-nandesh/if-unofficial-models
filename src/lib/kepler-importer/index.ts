import {assert} from 'console';
import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types';
import {PrometheusDriver, SampleValue} from 'prometheus-query';
import {z} from 'zod';
import {validate, allDefined} from '../../util/validations';
import * as dotenv from 'dotenv';

const J_TO_KWH = 3600000;
export const KeplerPlugin = (globalConfig: ConfigParams): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };
  dotenv.config();

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

    const validatedConfig = getKeplerConfig(config);
    const validatedInputs = inputs.map(getKeplerInput);

    globalConfig;

    const outputs = [];
    for (const input of validatedInputs) {
      const end = new Date(
        input.timestamp.getTime() + input.duration * 1000 - 1
      );

      const serie = await prometheus(input.timestamp, end, validatedConfig);
      const energy = serie.values.map((sample: SampleValue) => ({
        ...input,
        timestamp: sample.time,
        energy: sample.value / J_TO_KWH,
        duration: validatedConfig.step,
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
  const username = process.env.PROMETHEUS_USERNAME;
  const password = process.env.PROMETHEUS_PASSWORD;
  const prom = new PrometheusDriver({
    endpoint: config.endpoint,
    baseURL: '/api/v1',
    ...(username &&
      password && {
        auth: {
          username: username,
          password: password,
        },
      }),
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

export function getKeplerInput(input: PluginParams): KeplerInput {
  const schema = z
    .object({
      timestamp: z.string().datetime(),
      duration: z.number().int().positive(),
    })
    .refine(allDefined);
  const valid = validate<z.infer<typeof schema>>(schema, input);
  return {...input, ...valid, timestamp: new Date(input['timestamp'])};
}

type KeplerInput = {
  duration: number;
  timestamp: Date;
  [key: string]: any;
};
