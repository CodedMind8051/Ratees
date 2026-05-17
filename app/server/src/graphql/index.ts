import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema/index';
import { ApiError } from '../utils/AppError';
import { resolvers } from "./resolvers/index"
import type { MyContextType } from '../types/graphql.types';

const CreateApolloServer = async () => {

    try {
        const server = new ApolloServer<MyContextType>({
            typeDefs,
            resolvers
        });

        await server.start();
        return server

    } catch (error) {
        console.log("❌ Failed to start Apollo server", error)
        throw new ApiError(500, "Failed to start graphql server ", [error], "", false)
    }
}

export { CreateApolloServer }



