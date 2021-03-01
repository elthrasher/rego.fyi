import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { usePayloadsContext } from '../providers/PayloadsProvider';

export const Header = (): JSX.Element => {
  const { status, responsePayload } = usePayloadsContext();

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography>
            <h1>rego.fyi</h1>
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {status && (
            <Card>
              <CardContent>
                <Typography color="textPrimary" gutterBottom>
                  {status}
                </Typography>
                <Typography color="textSecondary">{responsePayload}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
