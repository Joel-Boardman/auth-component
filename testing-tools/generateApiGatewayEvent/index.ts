import { APIGatewayProxyEvent } from "aws-lambda";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT";

/**
 * TODO
 * - Add more Params to make it more dynamic. Eg dynamic body, path, params etc
 */
const generateApiGatewayEvent = (
  httpMethod: HttpMethod,
  path: string,
  config: Record<string, any> = {}
): APIGatewayProxyEvent => {
  return {
    body: config.body ? JSON.stringify(config.body) : "",
    headers: config.headers || {},
    multiValueHeaders: {},
    httpMethod: httpMethod,
    isBase64Encoded: false,
    path,
    pathParameters: config.pathParameters || {},
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    stageVariables: {},
    requestContext: {} as any,
    resource: "",
  };
};

export default generateApiGatewayEvent;
