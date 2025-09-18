import {
  SignUpCommand,
  SignUpRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "../";

export const cognitoCreateUser = async (
  input: SignUpRequest
): Promise<boolean | Error> => {
  try {
    const command = new SignUpCommand(input);
    const response = await cognitoIdentityClient.send(command);

    if (!response.UserConfirmed) throw new Error("");

    return response.UserConfirmed;
  } catch (err) {
    throw Error();
  }
};
