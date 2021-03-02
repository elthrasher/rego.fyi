import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

it('renders a message', () => {
  const component = renderer.create(<App />, {
    createNodeMock: (node) => {
      return document.createElement(node.type.toString());
    },
  });

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
