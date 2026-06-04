import { GraphQLError } from "graphql";
import { ZodError, type ZodType } from "zod";
import { throwGraphqlError } from "./throwGraphqlError.utils";

export const validate = <T>(
    schema: ZodType<T>,
    data: unknown
): T => {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            return throwGraphqlError(
                error.issues[0]?.message || "Validation failed",
                "BAD_USER_INPUT",
                400,
                true
            )
        }
        return throwGraphqlError("An unexpected error occurred", "INTERNAL_SERVER_ERROR", 500, true);
    }

};