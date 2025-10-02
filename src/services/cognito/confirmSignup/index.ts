import {
  ConfirmSignUpCommand,
  ConfirmSignUpResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "..";
import { InternalServerError, TooManyRequests } from "../../../utils/errors";

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
      case "LimitExceededException":
      case "TooManyRequestsException": {
        throw new TooManyRequests(
          "Too many requests. Please try again later.",
          10
        );
      }
      default: {
        throw new InternalServerError("Unable to get User");
      }
    }
  }
};
