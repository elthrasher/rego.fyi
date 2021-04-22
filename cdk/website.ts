import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Distribution, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Runtime } from '@aws-cdk/aws-lambda';
import { ARecord, IHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { AssetHashType, RemovalPolicy, Stack } from '@aws-cdk/core';
import { execSync, ExecSyncOptions } from 'child_process';
import { copySync } from 'fs-extra';
import { join } from 'path';

export const createWebsite = (stack: Stack, certificate: ICertificate, hostedZone: IHostedZone): string => {
  const websiteBucket = new Bucket(stack, 'WebsiteBucket', {
    autoDeleteObjects: true,
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
  });

  const execOptions: ExecSyncOptions = { stdio: ['ignore', process.stderr, 'inherit'] };

  const bundle = Source.asset(join(__dirname, '..'), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: {
      // command: ['sh', '-c', 'echo "Docker build not supported. Please install esbuild."'],
      command: [
        'sh',
        '-c',
        [
          'cp -R /asset-input/esbuild.ts /asset-input/pack* /asset-input/opa /asset-input/ui /asset-input/website /app',
          'npm ci',
          'npm run build',
          'cp -R website/. /asset-output',
        ].join('&&'),
      ],
      image: Runtime.NODEJS_14_X.bundlingDockerImage,
      local: {
        tryBundle(outputDir: string) {
          try {
            execSync('esbuild --version', execOptions);
          } catch /* istanbul ignore next */ {
            return false;
          }
          execSync('npm run build', execOptions);
          copySync(join(__dirname, '../website'), outputDir, { ...execOptions, recursive: true });
          return true;
        },
      },
      user: 'root',
      workingDirectory: '/app',
    },
  });

  const domainName = 'rego.fyi';

  const distribution = new Distribution(stack, 'Distribution', {
    certificate,
    defaultBehavior: {
      origin: new S3Origin(websiteBucket),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    domainNames: [domainName],
    errorResponses: [{ httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' }],
  });

  new BucketDeployment(stack, 'DeployWebsite', {
    destinationBucket: websiteBucket,
    distribution,
    distributionPaths: ['/*'],
    sources: [bundle],
  });

  new ARecord(stack, 'ARecord', {
    zone: hostedZone,
    recordName: domainName,
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
  });

  return websiteBucket.bucketWebsiteUrl;
};
