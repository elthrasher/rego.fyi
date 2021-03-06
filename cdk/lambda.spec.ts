import { SynthUtils } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';

import { getFns } from './lambda';

describe('lambda builds', () => {
  test('get functions', () => {
    const app = new App();
    const stack = new Stack(app);
    getFns(stack);
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
        default:
          break;
      }
    });

    expect(cfn).toMatchSnapshot(matchObject);
  });
});
