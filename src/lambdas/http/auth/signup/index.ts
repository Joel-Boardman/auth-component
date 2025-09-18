import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";
import { cognitoCreateUser } from "../../../../services/cognito";
import { InvalidRequestBody } from "../../../../utils/errors";
import { CognitoUserSignUpInput } from "../../../../services/cognito/createUser/index.types";

/**
 * TODO
 * - Move return results to a reusable function.
 * - Handle errors for bad request body, internal server errors, and SDK errors.
 * - Standardise error handling.
 *
 */

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = schemaValidation(event, requestBodySchema);

    const input: CognitoUserSignUpInput = {
      ClientId: "",
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        ...(body?.firstName
          ? [{ Name: "given_name" as const, Value: body.firstName }]
          : []),
        ...(body?.lastName
          ? [{ Name: "family_name" as const, Value: body.lastName }]
          : []),
        ...(body?.phoneNumber
          ? [{ Name: "phone_number" as const, Value: body.phoneNumber }]
          : []),
        { Name: "preferred_username" as const, Value: body.username },
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
