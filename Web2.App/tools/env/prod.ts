import {EnvConfig} from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'https://eventfeedback-staging.azurewebsites.net'
};

export = ProdConfig;

