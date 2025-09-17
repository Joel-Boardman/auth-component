import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hello: "world" }),
  };
};

export default handler;
