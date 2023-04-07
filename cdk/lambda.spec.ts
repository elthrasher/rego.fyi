import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { getFns } from './lambda';

describe('lambda builds', () => {
  test('get functions', () => {
    const app = new App();
    const stack = new Stack(app);
    getFns(stack);
    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
