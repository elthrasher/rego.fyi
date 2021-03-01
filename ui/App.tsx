import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import { Sidebar } from './components/Sidebar';
import Rego from './pages/Rego';
import { PayloadsProvider } from './providers/PayloadsProvider';

const App = (): JSX.Element => {
  return (
    <PayloadsProvider>
      <Container>
        <Grid container alignItems="center">
          <Grid item lg={8} sm={12}>
            <Rego />
          </Grid>
          <Grid item lg={4} sm={12}>
            <Sidebar />
          </Grid>
        </Grid>
      </Container>
    </PayloadsProvider>
  );
};

export default App;
