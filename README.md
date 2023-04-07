# rego.fyi

Source for [rego.fyi](https://rego.fyi) as a single [AWS CDK](https://aws.amazon.com/cdk/) stack.

<!-- Read about it on [dev.to](). -->

## Requirements

- NodeJS 18 ([get it](https://nodejs.org/en/))
- Go 1.20.3 ([get it](https://golang.org/doc/install))
- OPA ([get it](https://www.openpolicyagent.org/docs/latest/#running-opa) or [via homebrew](https://formulae.brew.sh/formula/opa))

## Useful commands

- `npm install` do this first
- `npm run lint` check your style
- `npm test` run all tests
- `npm run test:opa` run opa tests only
- `npm run test:go` run the go tests
- `npm run test:ts` run all the TypeScript tests with jest
- `npm start` run the UI on localhost
- `npx cdk bootstrap` prepare your environment
- `npm run deploy` build and deploy your app
- `npm run destroy` destroy the stack
- `npm run synth` synthesize the CloudFormation template
- `npm run diff` diff your deployed stack
