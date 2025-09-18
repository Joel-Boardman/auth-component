import { SignUpRequest } from "@aws-sdk/client-cognito-identity-provider";

interface ValidUserAttributeNames {
  given_name: string;
  family_name: string;
  preferred_username: string;
  phone_number?: string;
}

type BaseUserAttributesInput<T> = {
  [K in keyof T]: {
    Name: Extract<K, string>;
    Value: string;
  };
}[keyof T];

export interface BaseCognitoSignUp<T> extends SignUpRequest {
  ClientId: string;
  Username: string;
  Password: string;
  UserAttributes: BaseUserAttributesInput<T>[];
}

export type CognitoUserSignUpInput = BaseCognitoSignUp<ValidUserAttributeNames>;
export type CognitoSignUpParams = CognitoUserSignUpInput; // possible union type later.
