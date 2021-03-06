import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('render the app', () => {
  const { container } = render(<App />);

  expect(container).toHaveTextContent('rego.fyi');
  expect(container).toMatchSnapshot();
});
