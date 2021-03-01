import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';

import { RegoFyiStack } from './rego.fyi-stack';

describe('CDK UI Stack', () => {
  test('Snapshot test', () => {
    const app = new App();
    const stack = new RegoFyiStack(app, 'TestStack');

    const cfn = SynthUtils.toCloudFormation(stack);
    const resources = cfn.Resources;
    const matchObject: { Parameters: Record<string, unknown>; Resources: Record<string, unknown> } = {
      Parameters: expect.any(Object),
      Resources: {},
    };
    Object.keys(resources).forEach((res) => {
      switch (resources[res].Type) {
        case 'AWS::Lambda::Function':
          matchObject.Resources[res] = {
            Properties: { Code: expect.any(Object) },
          };
          break;
        case 'AWS::Lambda::LayerVersion':
          matchObject.Resources[res] = {
            Properties: {
              Content: expect.any(Object),
            },
          };
          break;
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
        default:
          break;
      }
    });

    expect(cfn).toMatchSnapshot(matchObject);
  });
});
