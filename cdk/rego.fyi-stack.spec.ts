import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { RegoFyiStack } from './rego.fyi-stack';

describe('CDK UI Stack', () => {
  test('Snapshot test', () => {
    const app = new App();
    const stack = new RegoFyiStack(app, 'TestStack', { env: { account: '123456789', region: 'us-east-1' } });

    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
