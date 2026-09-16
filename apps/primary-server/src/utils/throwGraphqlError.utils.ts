import { GraphQLError } from "graphql";

export const throwGraphqlError = (
    message: "Something went wrong, please try again later" | string,
    code: "INTERNAL_SERVER_ERROR" | string,
    status: 500 | number,
    show: false | boolean
): never => {

    throw new GraphQLError(message, {
        extensions: {
            code: code,
            http: { status: status },
            show: show
        }
    })
}