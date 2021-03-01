import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { Distribution, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { BundlingDockerImage, RemovalPolicy, Stack } from '@aws-cdk/core';
import { execSync, ExecSyncOptions } from 'child_process';
import { copySync } from 'fs-extra';
import { join } from 'path';

export const createWebsite = (stack: Stack): string => {
  const websiteBucket = new Bucket(stack, 'WebsiteBucket', {
    autoDeleteObjects: true,
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
  });

  const execOptions: ExecSyncOptions = { stdio: ['ignore', process.stderr, 'inherit'] };

  const bundle = Source.asset(join(__dirname, '../ui'), {
    bundling: {
      command: ['sh', '-c', 'echo "Docker build not supported. Please install esbuild."'],
      image: BundlingDockerImage.fromRegistry('alpine'),
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
    },
  });

  const domainName = 'rego.fyi';

  const hostedZone = HostedZone.fromLookup(stack, 'HostedZone', { domainName: 'rego.fyi' });

  const certificate = new DnsValidatedCertificate(stack, 'WebsiteCert', { domainName: 'rego.fyi', hostedZone });

  const distribution = new Distribution(stack, 'Distribution', {
    certificate,
    defaultBehavior: {
      origin: new S3Origin(websiteBucket),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    domainNames: ['rego.fyi'],
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
