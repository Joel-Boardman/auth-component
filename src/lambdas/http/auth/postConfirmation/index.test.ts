import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";
import postConfirmation from "./";
import {
  cognitoAdminGetUser,
  cognitoConfirmSignup,
} from "../../../../services/cognito";
import {
  InternalServerError,
  ResourceNotFound,
  TooManyRequests,
} from "../../../../utils/errors";

jest.mock("../../../../services/cognito");

const mockCognitoAdminGetUser = cognitoAdminGetUser as jest.Mock;
const mockCognitoConfirmSignup = cognitoConfirmSignup as jest.Mock;

describe("PostConfirmation", () => {
  beforeEach(() => {
    process.env = {
      USER_POOL_ID: "user-pool-id",
    };
  });
  afterEach(() => jest.clearAllMocks());

  const invalidBody = {
    body: {
      invalid: "payload",
    },
  };

  const validBody = {
    body: {
      userId: "aaaaa-bbbbb-ccccc-ddddd-eeeee-ffffff",
      email: "test@email.com",
    },
  };

  describe("WHEN the Request payload is invalid", () => {
    it("SHOULD return a 400 Invalid Request Error", async () => {
      const event = generateApiGatewayEvent(
        "POST",
        "/post-confirmation",
        invalidBody
      );

      const res = await postConfirmation(event);

      expect(res.statusCode).toBe(400);
      expect(res.body).toBe(
        JSON.stringify({ message: "Invalid request body" })
      );
    });
  });

  describe("WHEN Cognito is called to check for verification", () => {
    describe("AND it throws a standard error", () => {
      it("SHOULD throw a 500 Internal Server Error", async () => {
        mockCognitoAdminGetUser.mockRejectedValue(
          new InternalServerError("Internal server error")
        );

        const event = generateApiGatewayEvent(
          "POST",
          "/post-confirmation",
          validBody
        );

        const res = await postConfirmation(event);

        expect(res.statusCode).toBe(500);
        expect(res.body).toBe(
          JSON.stringify({ message: "Internal server error" })
        );
      });
    });

    describe("AND it throws a UserNotFoundException error", () => {
      it("SHOULD throw a 404 error with proper error message", async () => {
        mockCognitoAdminGetUser.mockRejectedValue(
          new ResourceNotFound("User not found")
        );

        const event = generateApiGatewayEvent(
          "POST",
          "/post-confirmation",
          validBody
        );

        const res = await postConfirmation(event);

        expect(res.statusCode).toBe(404);
        expect(res.body).toBe(JSON.stringify({ message: "User not found" }));
      });
    });
  });

  describe("WHEN the user is not verified", () => {
    describe("WHEN Cognito is called to verify the email", () => {
      describe("AND a standard error is thrown", () => {
        it("SHOULD throw an InternalServerError error", async () => {
          mockCognitoConfirmSignup.mockRejectedValue(
            new InternalServerError("Internal server error")
          );
          mockCognitoAdminGetUser.mockResolvedValue({
            Username: "test-user",
            UserAttributes: [{ Name: "email_verified", Value: "false" }],
          });

          const event = generateApiGatewayEvent(
            "POST",
            "/post-confirmation",
            validBody
          );

          const res = await postConfirmation(event);

          expect(res.statusCode).toBe(500);
          expect(res.body).toBe(
            JSON.stringify({ message: "Internal server error" })
          );
        });
      });

      describe("AND it throws a TooManyFailedAttemptsException error", () => {
        it("SHOULD throw a TooManyRequests error with no RetryAfter", async () => {
          mockCognitoAdminGetUser.mockResolvedValue({
            Username: "test-user",
            UserAttributes: [{ Name: "email_verified", Value: "false" }],
          });
          mockCognitoConfirmSignup.mockRejectedValue(
            new TooManyRequests(
              "Too many verification code requests. Please try again later."
            )
          );

          const event = generateApiGatewayEvent(
            "POST",
            "/post-confirmation",
            validBody
          );

          const res = await postConfirmation(event);

          expect(res.statusCode).toBe(429);
          expect(res.body).toBe(
            JSON.stringify({
              message:
                "Too many verification code requests. Please try again later.",
            })
          );
        });
      });

      describe("AND it throws a LimitExceededException OR TooManyRequestsException error", () => {
        it.todo(
          "SHOULD throw a TooManyRequests error with a 10 second RetryAfter"
        );
      });
    });
  });
});
