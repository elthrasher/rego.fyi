import { APIGatewayProxyEvent } from 'aws-lambda';

import { handler } from './lambdalith';

describe('lambdalith tests', () => {
  test('should return a response', async () => {
    const response = await handler({ httpMethod: 'GET', path: '/orders' } as APIGatewayProxyEvent);
    expect(response).toMatchSnapshot();
  });
});
