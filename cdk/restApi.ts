import { LambdaIntegration, RequestAuthorizer, RestApi } from '@aws-cdk/aws-apigateway';
import { Function as LambdaFunction } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';

export const createRestApi = (stack: Stack, fns: { [fnName: string]: LambdaFunction }): void => {
  const authorizer = new RequestAuthorizer(stack, 'Authorizer', {
    handler: fns.authorizer,
    identitySources: [],
    resultsCacheTtl: Duration.millis(0),
  });
  const lambdaIntegration = new LambdaIntegration(fns.lambdalith);

  const restApi = new RestApi(stack, 'RegoFyiApi', {
    defaultCorsPreflightOptions: {
      allowOrigins: ['https://rego.fyi'],
    },
    defaultIntegration: lambdaIntegration,
    deployOptions: {
      methodOptions: {
        '/*/*': {
          throttlingRateLimit: 100,
          throttlingBurstLimit: 200,
        },
      },
    },
  });

  const proxyResource = restApi.root.addProxy({
    anyMethod: false,
    defaultIntegration: new LambdaIntegration(fns.lambdalith),
  });

  const proxyMethodOptions = {
    authorizer,
    methodResponses: [
      {
        responseParameters: {
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Content-Type': true,
        },
        statusCode: '200',
      },
    ],
  };

  proxyResource.addMethod('delete', undefined, proxyMethodOptions);
  proxyResource.addMethod('get', undefined, proxyMethodOptions);
  proxyResource.addMethod('patch', undefined, proxyMethodOptions);
  proxyResource.addMethod('post', undefined, proxyMethodOptions);
  proxyResource.addMethod('put', undefined, proxyMethodOptions);
};
