import { APIGatewayProxyResult } from "aws-lambda";

interface ApiGatewayResponseConfig<T = unknown> {
  statusCode: number;
  body?: T;
  headers?: Record<string, string>;
}

const generateApiGatewayResponse = async <T>(
  config: ApiGatewayResponseConfig<T>
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: config.statusCode,
    headers: {
      "Content-Type": "application/json",
      ...(config.headers || {}),
    },
    body: JSON.stringify(config.body),
  };
};

export default generateApiGatewayResponse;
