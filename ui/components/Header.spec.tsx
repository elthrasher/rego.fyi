import React from 'react';
import renderer from 'react-test-renderer';

import { Payloads, PayloadsContext, PayloadsProvider } from '../providers/PayloadsProvider';
import { Header } from './Header';

it('renders default', () => {
  const component = renderer.create(
    <PayloadsProvider>
      <Header />
    </PayloadsProvider>,
    {
      createNodeMock: (node) => {
        return document.createElement(node.type.toString());
      },
    },
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders an ALLOWED message', () => {
  const component = renderer.create(
    <PayloadsContext.Provider value={{ status: 'ALLOWED', responsePayload: 'response' } as Payloads}>
      <Header />
    </PayloadsContext.Provider>,
    {
      createNodeMock: (node) => {
        return document.createElement(node.type.toString());
      },
    },
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders a DENIED message', () => {
  const component = renderer.create(
    <PayloadsContext.Provider value={{ status: 'ALLOWED' } as Payloads}>
      <Header />
    </PayloadsContext.Provider>,
    {
      createNodeMock: (node) => {
        return document.createElement(node.type.toString());
      },
    },
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
