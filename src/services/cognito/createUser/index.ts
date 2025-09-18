import {
  SignUpCommand,
  SignUpRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "../";
import { InternalServerError, InvalidRequestBody } from "../../../utils/errors";

export const cognitoCreateUser = async (
  input: SignUpRequest
): Promise<string> => {
  try {
    const command = new SignUpCommand(input);
    const response = await cognitoIdentityClient.send(command);

    if (!response.UserSub)
      throw new InvalidRequestBody("Please confirm your email");

    return response.UserSub;
  } catch (err: any) {
    console.log("services::cognito::createUser", {
      name: err?.name,
      message: err?.message,
      statusCode: err?.$metadata?.httpStatusCode,
      requestId: err?.$metadata?.requestId,
    });

    switch (err.name) {
      case "InvalidPasswordException": {
        throw new InvalidRequestBody("Invalid Password");
      }
      case "UsernameExistsException": {
        throw new InvalidRequestBody("Email already in use");
      }

      default: {
        throw new InternalServerError("Unable to create new User");
      }
    }
  }
};
