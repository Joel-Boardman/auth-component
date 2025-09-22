import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import generateApiGatewayResponse from "../../../../utils/response";
import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";
import { InvalidRequestBody } from "../../../../utils/errors";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await schemaValidation(event, requestBodySchema);

    // Check for confirmation

    // send confirmation

    // Handle DynamoDB payload

    // Send via Dynamo SDK

    return generateApiGatewayResponse({ statusCode: 200 });
  } catch (err: unknown) {
    if (err instanceof InvalidRequestBody) {
      return generateApiGatewayResponse({
        statusCode: 400,
        body: {
          message: err.message,
        },
      });
    }

    return generateApiGatewayResponse({
      statusCode: 500,
      body: {
        message: "Internal Server Error",
      },
    });
  }
};

export default handler;
