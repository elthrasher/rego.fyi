import { App } from 'aws-cdk-lib';

import { RegoFyiStack } from './rego.fyi-stack';

const app = new App();

new RegoFyiStack(app, 'RegoFyiStack', {
  description: 'Rego Fyi Stack',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stackName: 'regofyi',
});
