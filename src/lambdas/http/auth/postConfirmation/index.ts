import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import generateApiGatewayResponse from "../../../../utils/response";
import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";
import { InvalidRequestBody, ResourceNotFound } from "../../../../utils/errors";
import { cognitoAdminGetUser } from "../../../../services/cognito";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await schemaValidation(event, requestBodySchema);

    const cognitoUser = await cognitoAdminGetUser(body.userId);

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

    if (err instanceof ResourceNotFound) {
      return generateApiGatewayResponse({
        statusCode: 404,
        body: {
          message: err.message,
        },
      });
    }

    return generateApiGatewayResponse({
      statusCode: 500,
      body: {
        message: "Internal server error",
      },
    });
  }
};

export default handler;
