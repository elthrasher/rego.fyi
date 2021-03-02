import { SynthUtils } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';

import { getCertAndZone } from './getCFAndZone';
import { createWebsite } from './website';

describe('website builds', () => {
  test('react build', () => {
    const app = new App();
    const stack = new Stack(app, 'WebTestStack', { env: { account: '123456789', region: 'us-east-1' } });
    const { certificate, hostedZone } = getCertAndZone(stack);

    createWebsite(stack, certificate, hostedZone);
    const cfn = SynthUtils.toCloudFormation(stack);
    const resources = cfn.Resources;
    const matchObject: { Parameters: Record<string, unknown>; Resources: Record<string, unknown> } = {
      Parameters: expect.any(Object),
      Resources: {},
    };
    Object.keys(resources).forEach((res) => {
      switch (resources[res].Type) {
        case 'AWS::IAM::Policy':
          if (res.startsWith('CustomCDKBucketDeployment')) {
            matchObject.Resources[res] = {
              Properties: {
                PolicyDocument: {
                  Statement: expect.any(Array),
                },
              },
            };
          }
          break;
        case 'Custom::CDKBucketDeployment':
          matchObject.Resources[res] = {
            Properties: {
              SourceBucketNames: expect.any(Array),
              SourceObjectKeys: expect.any(Object),
            },
          };
          break;
        default:
          break;
      }
    });

    expect(cfn).toMatchSnapshot(matchObject);
  });
});
