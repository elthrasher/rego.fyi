import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { AssetHashType, Stack } from '@aws-cdk/core';
import { execSync, ExecSyncOptions } from 'child_process';
import { join } from 'path';

const getAuthorizer = (stack: Stack): LambdaFunction => {
  const execOptions: ExecSyncOptions = { stdio: ['ignore', process.stderr, 'inherit'] };
  const goPath = join(__dirname, '..');
  return new LambdaFunction(stack, 'AuthZFun', {
    code: Code.fromAsset(goPath, {
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        // command: ['sh', '-c', 'echo "Docker build not supported. Please install go."'],
        command: ['sh', '-c', 'GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o /asset-output/main'],
        image: Runtime.GO_1_X.bundlingImage,
        local: {
          tryBundle(outputDir: string) {
            try {
              execSync('go version', execOptions);
            } catch /* istanbul ignore next */ {
              return false;
            }
            execSync(`GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o ${join(outputDir, 'main')}`, {
              ...execOptions,
              cwd: join(goPath, 'fns/go'),
            });
            return true;
          },
        },
        user: 'root',
        workingDirectory: '/asset-input/fns/go',
      },
    }),
    handler: 'main',
    runtime: Runtime.GO_1_X,
  });
};

const getLambdalith = (stack: Stack): LambdaFunction =>
  new NodejsFunction(stack, 'LambdalithFn', {
    entry: `${__dirname}/../fns/ts/lambdalith.ts`,
    runtime: Runtime.NODEJS_14_X,
  });

export const getFns = (stack: Stack): { [fnName: string]: LambdaFunction } => ({
  authorizer: getAuthorizer(stack),
  lambdalith: getLambdalith(stack),
});
