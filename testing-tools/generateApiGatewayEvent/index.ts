import { APIGatewayProxyEvent } from "aws-lambda";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT";

/**
 * TODO
 * - Add more Params to make it more dynamic. Eg dynamic body, path, params etc
 */
const generateApiGatewayEvent = (
  httpMethod: HttpMethod
): APIGatewayProxyEvent => {
  return {
    body: JSON.stringify({ hello: "world" }),
    headers: {},
    multiValueHeaders: {},
    httpMethod: httpMethod,
    isBase64Encoded: false,
    path: "/",
    pathParameters: {},
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    stageVariables: {},
    requestContext: {} as any,
    resource: "",
  };
};

export default generateApiGatewayEvent;
