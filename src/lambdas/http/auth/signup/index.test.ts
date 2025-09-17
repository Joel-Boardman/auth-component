import { APIGatewayProxyEvent } from "aws-lambda";
import userSignup from "./index";
import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";

describe("userSignup", () => {
  describe("WHEN the request has an invalid body", () => {
    it("SHOULD return a 400 Bad Request Error", async () => {
      const event = generateApiGatewayEvent("POST");

      const res = await userSignup(event);

      expect(res.statusCode).toBe(400);
      expect(res.body).toContain(
        JSON.stringify({ message: "Invalid request body" })
      );
    });
  });

  describe("WHEN the request has a valid body", () => {
    it.todo("WHEN the request has a ");
  });
});
