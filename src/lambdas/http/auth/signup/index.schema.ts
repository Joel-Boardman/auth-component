import zod from "zod";

/**
 * TODO
 * - Request Body Schema
 * - Think about Open API documentation
 * - Workout API key validation, maybe as an API gateway middleware
 *
 */

export const requestBodySchema = zod.object({
  email: zod.email().min(5),
  password: zod
    .string()
    .min(8)
    .regex(/[^A-Za-z0-9]/),
  firstName: zod.string().min(2),
  lastName: zod.string().min(2),
  username: zod.string().min(3),
  phoneNumber: zod.string().optional(),
});

export type SignUpInput = zod.infer<typeof requestBodySchema>;
