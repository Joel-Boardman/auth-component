import zod from "zod";
import { schemaValidation } from ".";
import { InvalidRequestBody } from "../errors";

describe("schemaValidation", () => {
  const schema = zod.object({
    id: zod.number(),
    email: zod.email(),
  });

  describe("WHEN the unit receives invalid data", () => {
    it("SHOULD throw an Invalid Body Error", () => {
      const event = {
        body: JSON.stringify({
          name: "John Doe",
        }),
      };
      expect(() => schemaValidation(event, schema)).toThrow(
        new InvalidRequestBody("Invalid request body")
      );
    });
  });

  describe("WHEN the unit receives valid data", () => {
    it("SHOULD return the validated schema data", () => {
      const event = {
        body: JSON.stringify({
          id: 1,
          email: "example@email.com",
        }),
      };
      const res = schemaValidation(event, schema);
      expect(res).toEqual({ id: 1, email: "example@email.com" });
    });
  });
});
