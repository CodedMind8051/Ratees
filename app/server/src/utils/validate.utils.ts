import { GraphQLError } from "graphql";
import { ZodError, type ZodType } from "zod";

export const validate = <T>(
    schema: ZodType<T>,
    data: unknown
): T => {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new GraphQLError(
                error.issues[0]?.message || "Validation failed",
                {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                }
            );
        }

        throw error;
    }
};