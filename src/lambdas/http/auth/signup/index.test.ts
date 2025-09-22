import userSignup from "./index";
import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";
import { cognitoCreateUser } from "../../../../services/cognito";
import {
  InternalServerError,
  InvalidRequestBody,
} from "../../../../utils/errors";

jest.mock("../../../../services/cognito");

const mockedCreateUser = cognitoCreateUser as jest.Mock;

describe("userSignup", () => {
  beforeEach(() => {
    process.env = {
      COGNITO_CLIENT_ID: "client-id",
    };
  });

  afterEach(() => jest.clearAllMocks());
  const validBody = {
    body: {
      email: "dennis@email.com",
      password: "Password1!",
      firstName: "Dennis",
      lastName: "Reynolds",
      username: "Golden_God",
    },
  };

  describe("WHEN the request has an invalid body", () => {
    it("SHOULD return a 400 Invalid Request Error", async () => {
      const event = generateApiGatewayEvent("POST", "/signup", {
        body: { invalid: "data" },
      });

      const res = await userSignup(event);

      expect(res.statusCode).toBe(400);
      expect(res.body).toContain(
        JSON.stringify({ message: "Invalid request body" })
      );
    });
  });

  describe("WHEN the Cognito SDK is called", () => {
    describe("AND it throws a standard error", () => {
      it("SHOULD return a 500 Internal Server Error", async () => {
        mockedCreateUser.mockRejectedValue(
          new InternalServerError("Internal Server Error")
        );

        const event = generateApiGatewayEvent("POST", "/signup", validBody);

        const res = await userSignup(event);

        expect(res.statusCode).toBe(500);
        expect(res.body).toContain(
          JSON.stringify({ message: "Internal Server Error" })
        );
      });
    });

    describe("AND it throws a InvalidPasswordException error", () => {
      it("SHOULD return a 401 error with proper error message", async () => {
        mockedCreateUser.mockRejectedValue(
          new InvalidRequestBody("Invalid Password")
        );

        const event = generateApiGatewayEvent("POST", "/signup", validBody);

        const res = await userSignup(event);

        expect(res.statusCode).toBe(401);
        expect(res.body).toContain(
          JSON.stringify({ message: "Invalid Password" })
        );
      });
    });

    describe("AND it throws a UsernameExistsException error", () => {
      it("SHOULD return a 401 error with proper error message", async () => {
        mockedCreateUser.mockRejectedValue(
          new InvalidRequestBody("Email already in use")
        );

        const event = generateApiGatewayEvent("POST", "/signup", validBody);

        const res = await userSignup(event);

        expect(res.statusCode).toBe(401);
        expect(res.body).toContain(
          JSON.stringify({ message: "Email already in use" })
        );
      });
    });

    describe("AND it returns a success", () => {
      it("SHOULD return a 201 success response", async () => {
        mockedCreateUser.mockResolvedValue("user-sub");

        const event = generateApiGatewayEvent("POST", "/signup", validBody);
        const res = await userSignup(event);

        expect(mockedCreateUser).toHaveBeenCalledTimes(1);
        expect(mockedCreateUser).toHaveBeenCalledWith({
          ClientId: "client-id",
          Username: validBody.body.email,
          Password: validBody.body.password,
          UserAttributes: [
            { Name: "given_name", Value: validBody.body.firstName },
            { Name: "family_name", Value: validBody.body.lastName },
            { Name: "preferred_username", Value: validBody.body.username },
          ],
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toContain(JSON.stringify({ userId: "user-sub" }));
      });
    });
  });
});
