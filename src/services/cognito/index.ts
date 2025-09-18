import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoCreateUser } from "./createUser";

const config = {};

const cognitoIdentityClient = new CognitoIdentityProviderClient(config);

export { cognitoIdentityClient, cognitoCreateUser };
