import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "..";
import { InternalServerError, ResourceNotFound } from "../../../utils/errors";

export const cognitoAdminGetUser = async (input: any) => {
  try {
    const command = new AdminGetUserCommand(input);
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
      case "UserNotFoundException": {
        throw new ResourceNotFound("User not found");
      }
      default: {
        throw new InternalServerError("Unable to create new User");
      }
    }
  }
};
