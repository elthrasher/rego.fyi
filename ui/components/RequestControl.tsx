import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, { ChangeEvent } from 'react';
import { usePayloadsContext } from '../providers/PayloadsProvider';

export const RequestControl = (): JSX.Element => {
  const { method, resource, updateRequest } = usePayloadsContext();

  const onSelectChange = (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => updateRequest(event.target.value as string, resource);

  const onTextChange = (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => updateRequest(method, event.target.value as string);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel>Method</InputLabel>
            <Select onChange={onSelectChange} value={method}>
              <MenuItem value={'DELETE'}>DELETE</MenuItem>
              <MenuItem value={'GET'}>GET</MenuItem>
              <MenuItem value={'PATCH'}>PATCH</MenuItem>
              <MenuItem value={'POST'}>POST</MenuItem>
              <MenuItem value={'PUT'}>PUT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <TextField label="Resource" onChange={onTextChange} value={resource} />
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  );
};
