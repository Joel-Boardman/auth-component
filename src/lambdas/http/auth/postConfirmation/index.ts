import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import generateApiGatewayResponse from "../../../../utils/response";
import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";
import {
  InvalidRequestBody,
  ResourceNotFound,
  TooManyRequests,
} from "../../../../utils/errors";
import { cognitoAdminGetUser } from "../../../../services/cognito";
import {
  EnvVariables,
  fetchEnvVariableOrThrow,
} from "../../../../utils/envVariables";
import { CognitoAdminGetUserInput } from "../../../../services/cognito/adminGetUser/index.types";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await schemaValidation(event, requestBodySchema);

    const input: CognitoAdminGetUserInput = {
      UserPoolId: fetchEnvVariableOrThrow(EnvVariables.USER_POOL_ID),
      Username: body.email,
    };

    const cognitoUser = await cognitoAdminGetUser(input);

    const userVerified = cognitoUser.UserAttributes?.find(
      (obj) => obj.Name === "email_verified"
    );

    if (userVerified?.Value === "true") {
    }

    // send confirmation

    // Handle DynamoDB payload

    // Send via Dynamo SDK

    return generateApiGatewayResponse({ statusCode: 200 });
  } catch (err: unknown) {
    console.log(err);
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

    if (err instanceof TooManyRequests) {
      return generateApiGatewayResponse({
        statusCode: 429,
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
