import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { getFns } from './lambda';

import { createRestApi } from './restApi';
import { createWebsite } from './website';

export class RegoFyiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webUrl = createWebsite(this);

    const fns = getFns(this);

    createRestApi(this, fns);

    new CfnOutput(this, 'webUrl', { value: webUrl });
  }
}
