import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";
import postConfirmation from "./";
import { cognitoAdminGetUser } from "../../../../services/cognito";
import { InternalServerError } from "../../../../utils/errors";

jest.mock("../../../../services/cognito");

const mockCognitoAdminGetUser = cognitoAdminGetUser as jest.Mock;

describe("PostConfirmation", () => {
  afterEach(() => jest.clearAllMocks());

  describe("WHEN the Request payload is invalid", () => {
    it("SHOULD return a 400 Invalid Request Error", async () => {
      const event = generateApiGatewayEvent("POST", "/post-confirmation", {
        body: {
          invalid: "payload",
        },
      });

      const res = await postConfirmation(event);

      expect(res.statusCode).toBe(400);
      expect(res.body).toBe(
        JSON.stringify({ message: "Invalid request body" })
      );
    });
  });

  describe("WHEN Cognito is called to check for verification", () => {
    describe("AND it throws a standard error", () => {
      it("SHOULD return a 500 Internal Server Error", async () => {
        mockCognitoAdminGetUser.mockRejectedValue(
          new InternalServerError("Internal server error")
        );

        const event = generateApiGatewayEvent("POST", "/post-confirmation", {
          body: {
            userId: "aaaaa-bbbbb-ccccc-ddddd-eeeee-ffffff",
          },
        });

        const res = await postConfirmation(event);

        expect(res.statusCode).toBe(500);
        expect(res.body).toBe(
          JSON.stringify({ message: "Internal server error" })
        );
      });
    });

    describe("AND it throws a UserNotFoundException error", () => {
      it("SHOULD throw a 404 error with proper error message", () => {});
    });
  });
});
