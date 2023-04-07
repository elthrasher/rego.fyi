import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { getCertAndZone } from './getCFAndZone';
import { getFns } from './lambda';
import { createRestApi } from './restApi';

describe('rest api', () => {
  test('rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'ApiTestStack', { env: { account: '123456789', region: 'us-east-1' } });
    const { certificate, hostedZone } = getCertAndZone(stack);
    createRestApi(stack, getFns(stack), certificate, hostedZone);
    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
