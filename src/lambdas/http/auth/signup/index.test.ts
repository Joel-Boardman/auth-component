import userSignup from "./index";
import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";

describe("userSignup", () => {
  describe("WHEN the request has an invalid body", () => {
    it("SHOULD return a 400 Invalid Request Error", async () => {
      const event = generateApiGatewayEvent("POST");

      const res = await userSignup(event);

      expect(res.statusCode).toBe(400);
      expect(res.body).toContain(
        JSON.stringify({ message: "Invalid request body" })
      );
    });
  });

  describe("WHEN the Cognito SDK is called", () => {
    describe("AND it returns an error", () => {
      it("SHOULD return a 500 Internal Server Error", () => {});
    });

    describe("AND it returns a success", () => {
      it("SHOULD return a 201 success response", () => {});
    });
  });
});
