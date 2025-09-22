import zod from "zod";

export const requestBodySchema = zod.object({
  userId: zod.string().min(36).max(36),
});
