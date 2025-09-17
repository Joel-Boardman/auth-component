import zod from "zod";
import { InvalidRequestBody } from "../errors";

const schemaValidation = <T extends zod.ZodTypeAny>(
  event: any,
  schema: T
): zod.infer<typeof schema> => {
  const body = JSON.parse(event.body);
  const parseResult = schema.safeParse(body);

  if (!parseResult.success) {
    throw new InvalidRequestBody("Invalid request body");
  }
  return parseResult.data as zod.infer<typeof schema>;
};

export { schemaValidation };
