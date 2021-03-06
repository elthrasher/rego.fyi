import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { PayloadsProvider } from '../providers/PayloadsProvider';
import TextArea from './TextArea';

test('enter some text', () => {
  const changeEvent = jest.fn((input: string) => input);
  expect.assertions(4);
  const { container } = render(
    <PayloadsProvider>
      <TextArea changeEvent={changeEvent} content="This is content" label="a label" />
    </PayloadsProvider>,
  );
  const input = container.getElementsByTagName('textarea').item(0);
  if (input) {
    expect(input.className).toBe(
      'MuiInputBase-input MuiFilledInput-input MuiInputBase-inputMultiline MuiFilledInput-inputMultiline',
    );

    //   Valid input
    fireEvent.change(input, { target: { value: 'valid' } });
    expect(container).not.toHaveTextContent('invalid');

    // Invalid input
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(container).toHaveTextContent('invalid');

    expect(changeEvent).toHaveBeenCalledTimes(2);
  }
});
