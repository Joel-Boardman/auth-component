import {
  SignUpCommand,
  SignUpRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoIdentityClient } from "../";
import { fetchEnvVariableOrThrow } from "../../../utils/envVariables";
import { EnvVariables } from "../../../utils/envVariables";
import { SignUpInput } from "../../../lambdas/http/auth/signup/index.schema";
import { CognitoSignUpParams } from "./index.types";

export const cognitoCreateUser = async (
  body: CognitoSignUpParams
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
