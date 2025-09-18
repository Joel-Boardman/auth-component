import {
  SignUpRequest,
  AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";

interface ValidUserAttributeNames {
  given_name: string;
  family_name: string;
  preferred_username: string;
  phone_number?: string;
}

interface BaseUserAttributesInput<K> {
  Name: K;
  Value: string;
}

type UserSignupAttributes = BaseUserAttributesInput<
  keyof ValidUserAttributeNames
>[];

export interface BaseCognitoSignUp<T> extends SignUpRequest {
  ClientId: string;
  Username: string;
  Password: string;
  UserAttributes: T extends AttributeType[] ? T : [];
}

export type CognitoUserSignUpInput = BaseCognitoSignUp<UserSignupAttributes>;

export type CognitoSignUpParams = BaseCognitoSignUp<ValidUserAttributeNames>;
