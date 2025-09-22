import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import generateApiGatewayResponse from "../../../../utils/response";

const handler = (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Validate payload

    // Check for confirmation

    // send confirmation

    // Handle DynamoDB payload

    // Send via Dynamo SDK

    return generateApiGatewayResponse({ statusCode: 200 });
  } catch (err: unknown) {
    return generateApiGatewayResponse({ statusCode: 500 });
  }
};

export default handler;
