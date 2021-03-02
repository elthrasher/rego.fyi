import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;
  return {
    body: JSON.stringify({ httpMethod, path }),
    headers: { 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Origin': 'https://rego.fyi' },
    statusCode: 200,
  };
};
