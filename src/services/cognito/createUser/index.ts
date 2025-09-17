import {
  SignUpCommand,
  SignUpRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "../";
import { fetchEnvVariableOrThrow } from "../../../utils/envVariables";
import { EnvVariables } from "../../../utils/envVariables";

export const cognitoCreateUser = async (
  body: Record<string, any>
): Promise<boolean | Error> => {
  const clientId = fetchEnvVariableOrThrow(EnvVariables.COGNITO_CLIENT_ID);

  const input: SignUpRequest = {
    ClientId: clientId,
    Username: "",
  };

  try {
    const command = new SignUpCommand(input);
    const response = await cognitoIdentityClient.send(command);

    if (!response.UserConfirmed) throw new Error("");

    return response.UserConfirmed;
  } catch (err) {
    throw Error();
  }
};
