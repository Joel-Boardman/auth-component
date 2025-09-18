import zod from "zod";
import { InvalidRequestBody } from "../errors";

const schemaValidation = <T extends zod.ZodTypeAny>(
  event: any,
  schema: T
): zod.infer<typeof schema> => {
  const body = JSON.parse(event.body);
  const parsedResult = schema.safeParse(body);

  if (!parsedResult.success) {
    throw new InvalidRequestBody("Invalid request body");
  }
  return parsedResult.data as zod.infer<typeof schema>;
};

export { schemaValidation };
