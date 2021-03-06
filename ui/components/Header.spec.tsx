import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';
import React from 'react';

import { Payloads, PayloadsContext } from '../providers/PayloadsProvider';
import { Header } from './Header';

test.each`
  status       | responsePayload
  ${undefined} | ${undefined}
  ${'ALLOWED'} | ${'response'}
  ${'DENIED'}  | ${undefined}
`('Header with status of $status', ({ status, responsePayload }) => {
  const { container } = render(
    <PayloadsContext.Provider value={{ status, responsePayload } as Payloads}>
      <Header />
    </PayloadsContext.Provider>,
  );
  expect(container).toHaveTextContent('rego.fyi');
  if (status) {
    expect(container).toHaveTextContent(status);
  }
  if (responsePayload) {
    expect(container).toHaveTextContent(responsePayload);
  }
});
