import {
  ConfirmSignUpCommand,
  ConfirmSignUpResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "..";
import {
  InternalServerError,
  ResourceNotFound,
  TooManyRequests,
} from "../../../utils/errors";

export const cognitoConfirmSignup = async (
  input: any
): Promise<ConfirmSignUpResponse> => {
  try {
    const command = new ConfirmSignUpCommand(input);
    const response = await cognitoIdentityClient.send(command);

    return response;
  } catch (err: any) {
    console.log("services::cognito::cognitoAdminGetUser", {
      name: err?.name,
      message: err?.message,
      statusCode: err?.$metadata?.httpStatusCode,
      requestId: err?.$metadata?.requestId,
    });

    switch (err.name) {
      case "TooManyFailedAttemptsException": {
        throw new TooManyRequests(
          "Too many verification code requests. Please try again later."
        );
      }
      default: {
        throw new InternalServerError("Unable to get User");
      }
    }
  }
};
