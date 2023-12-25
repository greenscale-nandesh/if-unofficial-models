// import axios from 'axios';
// import * as dayjs from 'dayjs';

// import {ERRORS} from '../../util/errors';
import {buildErrorMessage} from '../../util/helpers';

import {KeyValuePair, ModelParams} from '../../types/common';
import {ModelPluginInterface} from '../../interfaces';

// const {AuthorizationError, InputValidationError, APIRequestError} = ERRORS;

export class MockObservations implements ModelPluginInterface {
  staticParams: object | undefined;
  errorBuilder = buildErrorMessage(WattTimeGridEmissions);

  async authenticate(authParams: object): Promise<void> {
  }

  async execute(inputs: ModelParams[]): Promise<ModelParams[]> {
  }

  async configure(
    staticParams: object | undefined
  ): Promise<ModelPluginInterface> {
  }
}
