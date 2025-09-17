import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { InvalidRequestBody } from "../../../../utils/errors";
import { schemaValidation } from "../../../../utils/validation";
import { requestBodySchema } from "./index.schema";

/**
 * TODO
 * - Move return results to a reusable function.
 * - Handle errors for bad request body, internal server errors, and SDK errors.
 * - Standardise error handling.
 *
 */

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = schemaValidation(event, requestBodySchema);

    /**
     * SDK Cognito call
     * -- Goes here --
     */

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hello: "world" }),
    };
  } catch (err: unknown) {
    if (err instanceof InvalidRequestBody) {
      return {
        statusCode: err.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: err.message,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: "",
    };
  }
};

export default handler;
