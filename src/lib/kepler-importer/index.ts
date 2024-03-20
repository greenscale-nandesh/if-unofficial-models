import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types';

export const KeplerPlugin = (globalConfig: ConfigParams): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      // your logic here
      globalConfig;

      return input;
    });
  };

  return {
    metadata,
    execute,
  };
};
