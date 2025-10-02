import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoCreateUser } from "./createUser";
import { cognitoAdminGetUser } from "./adminGetUser";
import { cognitoConfirmSignup } from "./confirmSignup";

const config = {};

const cognitoIdentityClient = new CognitoIdentityProviderClient(config);

export {
  cognitoIdentityClient,
  cognitoCreateUser,
  cognitoAdminGetUser,
  cognitoConfirmSignup,
};
