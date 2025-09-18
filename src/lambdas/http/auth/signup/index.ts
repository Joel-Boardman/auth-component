import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";
import { cognitoCreateUser } from "../../../../services/cognito";
import { InvalidRequestBody } from "../../../../utils/errors";
import { CognitoUserSignUpInput } from "../../../../services/cognito/createUser/index.types";
import {
  EnvVariables,
  fetchEnvVariableOrThrow,
} from "../../../../utils/envVariables";
import generateApiGatewayResponse from "../../../../utils/response";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = await schemaValidation(event, requestBodySchema);

    const input: CognitoUserSignUpInput = {
      ClientId: fetchEnvVariableOrThrow(EnvVariables.COGNITO_CLIENT_ID),
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: "given_name", Value: body.firstName },
        { Name: "family_name", Value: body.lastName },
        { Name: "preferred_username", Value: body.username },
        ...(body.phoneNumber
          ? [{ Name: "phone_number" as const, Value: body.phoneNumber }]
          : []),
      ],
    };

    const userSub = await cognitoCreateUser(input);

    return generateApiGatewayResponse({
      statusCode: 201,
      body: {
        userId: userSub,
      },
    });
  } catch (err: unknown) {
    if (err instanceof InvalidRequestBody) {
      return generateApiGatewayResponse({
        statusCode: 401,
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
