import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { PayloadsProvider } from '../providers/PayloadsProvider';
import { RequestControl } from './RequestControl';

test.each`
  method
  ${'DELETE'}
  ${'GET'}
  ${'PATCH'}
  ${'POST'}
  ${'PUT'}
`('method of $method', ({ method }) => {
  expect.assertions(2);
  const { container } = render(
    <PayloadsProvider>
      <RequestControl />
    </PayloadsProvider>,
  );
  const input = container.getElementsByTagName('input').item(0);
  if (input) {
    fireEvent.change(input, { target: { value: method } });
    expect(input.className).toBe('MuiSelect-nativeInput');
    expect(input.value).toBe(method);
  }
});

test.each`
  resource
  ${'/orders'}
  ${'/'}
  ${'/orders/customers/123'}
`('set resource to $resource', ({ resource }) => {
  expect.assertions(2);
  const { container } = render(
    <PayloadsProvider>
      <RequestControl />
    </PayloadsProvider>,
  );
  const input = container.getElementsByTagName('input').item(1);
  if (input) {
    fireEvent.change(input, { target: { value: resource } });
    expect(input.className).toBe('MuiInputBase-input MuiInput-input');
    expect(input.value).toBe(resource);
  }
});
