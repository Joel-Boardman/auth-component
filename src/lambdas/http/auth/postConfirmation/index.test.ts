import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";
import postConfirmation from "./";
import { cognitoAdminGetUser } from "../../../../services/cognito";
import {
  InternalServerError,
  ResourceNotFound,
  TooManyRequests,
} from "../../../../utils/errors";

jest.mock("../../../../services/cognito");

const mockCognitoAdminGetUser = cognitoAdminGetUser as jest.Mock;
const mockCognitoConfirmSignup = cognitoAdminGetUser as jest.Mock;

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

    describe("AND it throws a TooManyFailedAttemptsException error", () => {
      it("SHOULD return 429 TooManyRequests error", async () => {
        mockCognitoConfirmSignup.mockRejectedValue(
          new TooManyRequests("Too many requests")
        );

        const event = generateApiGatewayEvent(
          "POST",
          "/post-confirmation",
          validBody
        );

        const res = await postConfirmation(event);

        expect(res.statusCode).toBe(429);
        expect(res.body).toBe(JSON.stringify({ message: "Too many requests" }));
      });
    });
  });

  describe("WHEN Cognito is called to verify Users email", () => {
    describe("AND it throws a TooManyFailedAttemptsException error", () => {
      it.todo("SHOULD throw a 410 error with proper error message");
    });
  });
});
