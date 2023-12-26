// import axios from 'axios';
// import * as dayjs from 'dayjs';

// import {ERRORS} from '../../util/errors';
import {buildErrorMessage} from '../../util/helpers';

import {ModelParams} from '../../types/common';
import {ModelPluginInterface} from '../../interfaces';

// const {AuthorizationError, InputValidationError, APIRequestError} = ERRORS;

export class MockObservations implements ModelPluginInterface {
  staticParams: object | undefined;
  errorBuilder = buildErrorMessage(MockObservations);

  async authenticate(authParams: object): Promise<void> {
	  // TODO PB -- remove dummy line
	  this.staticParams = authParams;
	  // return authParams;
  }

  async execute(inputs: ModelParams[]): Promise<ModelParams[]> {
	  // TODO PB -- remove dummy line
	  this.staticParams = inputs;
	  // TODO PB -- remove dummy line
	  return inputs;
  }

  async configure(
    staticParams: object | undefined
  ): Promise<ModelPluginInterface> {
	  // TODO PB -- remove dummy line
	  this.staticParams = staticParams;
	  return this;
  }
}
