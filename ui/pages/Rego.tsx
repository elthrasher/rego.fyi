import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import React from 'react';

import { Header } from '../components/Header';
import { RequestControl } from '../components/RequestControl';
import TextArea from '../components/TextArea';
import { usePayloadsContext } from '../providers/PayloadsProvider';

const Rego = (): JSX.Element => {
  const { data, rego, token, saveData, saveRego, saveToken, sendRequest } = usePayloadsContext();

  return (
    <Container>
      <Header />
      <RequestControl />
      <TextArea changeEvent={saveToken} content={token} label="User info such as a JWT or session" />
      <TextArea changeEvent={saveRego} content={rego} label="Rego policy loaded from disk or other storage" />
      <TextArea
        changeEvent={saveData}
        content={data}
        label="Data loaded from disk or other storage for making policy decisions"
      />
      <Button color="primary" onClick={sendRequest}>
        Send Request
      </Button>
    </Container>
  );
};

export default Rego;
