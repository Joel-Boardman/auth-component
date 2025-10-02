import { mockClient } from "aws-sdk-client-mock";
import {
  AdminGetUserCommand,
  AdminGetUserResponse,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoAdminGetUser } from ".";
import { InternalServerError, ResourceNotFound } from "../../../utils/errors";

const cognitoClientMock = mockClient(CognitoIdentityProviderClient);

describe("AdminGetUser", () => {
  beforeEach(() => cognitoClientMock.reset());
  afterAll(() => cognitoClientMock.restore());

  const input = { Username: "test-user", UserPoolId: "pool-123" };

  describe("WHEN the service call fails", () => {
    describe("AND its a UserNotFoundException", () => {
      it("SHOULD throw a ResourceNotFound error", async () => {
        cognitoClientMock.on(AdminGetUserCommand).rejects({
          name: "UserNotFoundException",
          message: "User does not exist",
        });

        await expect(cognitoAdminGetUser(input)).rejects.toThrow(
          ResourceNotFound
        );
      });
    });

    describe("AND its a standard error", () => {
      it("SHOULD throw a InternalServer error", async () => {
        cognitoClientMock.on(AdminGetUserCommand).rejects({
          name: "SomethingElseException",
          message: "General fake error",
        });

        await expect(cognitoAdminGetUser(input)).rejects.toThrow(
          InternalServerError
        );
      });
    });
  });

  describe("WHEN the service is called", () => {
    it("SHOULD return response", async () => {
      const mockResponse: AdminGetUserResponse = {
        Username: "test-user",
        UserAttributes: [{ Name: "email", Value: "test@example.com" }],
      };

      cognitoClientMock.on(AdminGetUserCommand).resolves(mockResponse);

      const response = await cognitoAdminGetUser(input);

      expect(response).toEqual(mockResponse);
    });
  });
});
