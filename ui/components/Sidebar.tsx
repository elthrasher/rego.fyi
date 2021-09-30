import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
});

export const Sidebar = (): JSX.Element => (
  <Container>
    <ThemeProvider theme={theme}>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">What is this?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I was interested to see if I could use rego in a serverless environment. I put together a demo that involved
            using a REST client, copying tokens around and stuff like that. I decided my demo was terrible and resolved
            to do something better, this, which is at least better than that demo.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">How do I use it?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Edit any of the three text blocks and select an HTTP method and path. The top and bottom should have JSON
            data and are validated. The middle one is written in{' '}
            <Link href="https://www.openpolicyagent.org/docs/latest/policy-language/" rel="noopener" target="_blank">
              rego
            </Link>{' '}
            and isn't validated (yet) but you could use{' '}
            <Link href="https://play.openpolicyagent.org/" rel="noopener" target="_blank">
              The Rego Playground
            </Link>
            .
          </Typography>
          <Typography>
            When you click the SEND REQUEST button, the app will encode all three text blocks and make an HTTP request
            to the serverless backend. The backend will decode the token, compile the rego policy, evaluate the policy
            with the other payloads, then return the appropriate response.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Architecture</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The web app is written in React and is an S3 website. The API uses API Gateway and Lambda. Nothing sent to
            the API is stored, but there's some logging in place.
          </Typography>
          <Typography>
            The backend consists of two Lambda functions, an authorizer written in golang and a handler written in
            NodeJS. The authorizer is implemented with{' '}
            <Link href="https://github.com/open-policy-agent/opa" rel="noopener" target="_blank">
              opa packages
            </Link>
            .
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Production use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This? Nope. You don't want your authorization system to accept a policy from the client. Something like
            this? Very possibly.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Open Policy Agent</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I'm not affiliated.{' '}
            <Link href="https://www.openpolicyagent.org/" rel="noopener" target="_blank">
              Learn more.
            </Link>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary area-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Me</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Hello, come find me{' '}
            <Link
              href="https://twitter.com/NullishCoalesce?ref_src=twsrc%5Etfw"
              className="twitter-follow-button"
              data-show-count="false"
            >
              Follow @TwitterDev
            </Link>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  </Container>
);
