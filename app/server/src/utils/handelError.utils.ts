import { throwGraphqlError } from "./throwGraphqlError.utils";
import { GraphQLError } from "graphql";

export const handelGraphqlError = (
    error: unknown
): never => {

    if (error instanceof GraphQLError) {
        throw error;
    }

    return throwGraphqlError("Something went wrong, please try again later", "INTERNAL_SERVER_ERROR", 500, false)

}