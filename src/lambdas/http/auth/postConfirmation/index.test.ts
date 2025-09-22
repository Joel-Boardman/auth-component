import generateApiGatewayEvent from "../../../../../testing-tools/generateApiGatewayEvent";
import postConfirmation from "./";

describe("PostConfirmation", () => {
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
});
