import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { getCertAndZone } from './getCFAndZone';
import { createWebsite } from './website';

describe('website builds', () => {
  test('react build', () => {
    const app = new App();
    const stack = new Stack(app, 'WebTestStack', { env: { account: '123456789', region: 'us-east-1' } });
    const { certificate, hostedZone } = getCertAndZone(stack);

    createWebsite(stack, certificate, hostedZone);
    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
