import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';

import { getCertAndZone } from './getCFAndZone';
import { getFns } from './lambda';
import { createRestApi } from './restApi';
import { createWebsite } from './website';

export class RegoFyiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { certificate, hostedZone } = getCertAndZone(this);

    const webUrl = createWebsite(this, certificate, hostedZone);

    const fns = getFns(this);

    createRestApi(this, fns, certificate, hostedZone);

    new CfnOutput(this, 'webUrl', { value: webUrl });
  }
}
