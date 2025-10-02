import { AdminGetUserRequest } from "@aws-sdk/client-cognito-identity-provider";

export interface BaseCognitoAdminGetUser extends AdminGetUserRequest {
  UserPoolId: string;
  Username: string;
}

export type CognitoAdminGetUserInput = BaseCognitoAdminGetUser;
export type CognitoAdminGetUserParams = BaseCognitoAdminGetUser;
