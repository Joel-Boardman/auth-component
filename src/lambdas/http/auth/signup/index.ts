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

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = schemaValidation(event, requestBodySchema);

    const input: CognitoUserSignUpInput = {
      ClientId: fetchEnvVariableOrThrow(EnvVariables.COGNITO_CLIENT_ID),
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: "given_name", Value: body.firstName },
        { Name: "family_name", Value: body.lastName },
        { Name: "preferred_username", Value: body.username },
        ...(body?.phoneNumber
          ? [{ Name: "phone_number" as const, Value: body.phoneNumber }]
          : []),
      ],
    };

    await cognitoCreateUser(input);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hello: "world" }),
    };
  } catch (err: unknown) {
    if (err instanceof InvalidRequestBody) {
      return {
        statusCode: err.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: err.message,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: "",
    };
  }
};

export default handler;
