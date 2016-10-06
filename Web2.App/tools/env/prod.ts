import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: ''
  // API: 'https://eventfeedback.azurewebsites.net'
  //API: 'https://eventfeedback-staging.azurewebsites.net'
};

export = ProdConfig;

