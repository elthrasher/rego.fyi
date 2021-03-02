import React from 'react';
import renderer from 'react-test-renderer';

import { PayloadsProvider } from '../providers/PayloadsProvider';
import { RequestControl } from './RequestControl';

it('renders a message', () => {
  const component = renderer.create(
    <PayloadsProvider>
      <RequestControl />
    </PayloadsProvider>,
    {
      createNodeMock: (node) => {
        return document.createElement(node.type.toString());
      },
    },
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  //  const instance = component.getInstance();
  //  instance.
});
