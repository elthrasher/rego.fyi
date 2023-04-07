import { Stack } from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';

export const getCertAndZone = (stack: Stack): { certificate: ICertificate; hostedZone: IHostedZone } => {
  const domainName = 'rego.fyi';
  const apiDomainName = `api.${domainName}`;

  const hostedZone = HostedZone.fromLookup(stack, 'HostedZone', { domainName });

  const certificate = new Certificate(stack, 'WebsiteCert', {
    domainName,
    subjectAlternativeNames: [apiDomainName],
    validation: CertificateValidation.fromDnsMultiZone({ [domainName]: hostedZone, [apiDomainName]: hostedZone }),
  });

  return { certificate, hostedZone };
};
