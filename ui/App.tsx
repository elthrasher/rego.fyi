import { createMuiTheme, Link, ThemeProvider, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import Rego from './pages/Rego';
import { PayloadsProvider } from './providers/PayloadsProvider';

const theme = createMuiTheme({
  typography: {
    fontSize: 10,
  },
});

const App = (): JSX.Element => {
  return (
    <PayloadsProvider>
      <Container>
        <Grid container alignItems="center">
          <Grid item lg={2} sm={12}>
            <Container>
              <Typography>
                <ThemeProvider theme={theme}>
                  <h4>What is this?</h4>
                  <p>
                    I was interested to see if I could use rego in a serverless environment. I put together a demo that
                    involved using a REST client, copying tokens around and stuff like that. I decided my demo was
                    terrible and resolved to do something better.
                  </p>
                  <h4>How do I use it?</h4>
                  <p>
                    Edit any of the three text blocks to the right and select an HTTP method and path. The top and
                    bottom should have JSON data and are validated. The middle one is written in{' '}
                    <Link
                      href="https://www.openpolicyagent.org/docs/latest/policy-language/"
                      rel="noopener"
                      target="_blank"
                    >
                      rego
                    </Link>{' '}
                    and isn't validated (yet) but you could use{' '}
                    <Link href="https://play.openpolicyagent.org/" rel="noopener" target="_blank">
                      The Rego Playground
                    </Link>
                    .
                  </p>
                  <p>
                    When you click the SEND REQUEST button, the app will encode all three text blocks and make an HTTP
                    request to the serverless backend. The backend will decode the token, compile the rego policy,
                    evaluate the policy with the other payloads, then return the appropriate response.
                  </p>
                  <h4>Production use?</h4>
                  <p>
                    This? Nope. You don't want your authorization system to accept a policy from the client. Something
                    like this? Very possibly.
                  </p>
                </ThemeProvider>
              </Typography>
            </Container>
          </Grid>
          <Grid item lg={8} sm={12}>
            <Rego />
          </Grid>
          <Grid item lg={2} sm={12}>
            <Container>
              <Typography>
                <ThemeProvider theme={theme}>
                  <h4>Architecture</h4>
                  <p>
                    The web app is written in React and is an S3 website. The API uses API Gateway and Lambda. Nothing
                    sent to the API is stored, but there's some logging in place.
                  </p>
                  <p>
                    The backend consists of two Lambda functions, an authorizer written in golang and a handler written
                    in NodeJS. The authorizer is implemented with{' '}
                    <Link href="https://github.com/open-policy-agent/opa" rel="noopener" target="_blank">
                      opa packages
                    </Link>
                    .
                  </p>
                  <h4>Open Policy Agent</h4>
                  <p>
                    I'm not affiliated.{' '}
                    <Link href="https://www.openpolicyagent.org/" rel="noopener" target="_blank">
                      Learn more.
                    </Link>
                  </p>
                </ThemeProvider>
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </PayloadsProvider>
  );
};

export default App;
