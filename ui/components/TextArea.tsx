import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import React, { ChangeEvent, useState } from 'react';

interface TextAreaProps {
  content: string;
  label: string;

  changeEvent: (value: string) => string;
}

const TextArea = ({ changeEvent, content, label }: TextAreaProps): JSX.Element => {
  const [error, setError] = useState<string>();
  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const validation = changeEvent(event.target.value);
    validation === 'valid' ? setError('') : setError(validation);
  };

  return (
    <Container>
      <FormControl component="fieldset" fullWidth={true}>
        <TextField
          error={!!error}
          helperText={error}
          id={label}
          fullWidth={true}
          label={label}
          multiline
          value={content}
          onChange={onChange}
          variant="filled"
        />
      </FormControl>
    </Container>
  );
};

export default TextArea;
