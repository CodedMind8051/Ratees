import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema/index';
import { ApiError } from '@ratees/utils';
import { resolvers } from "./resolvers/index"
import type { MyContextType } from '../types/graphql.types';
import { logger } from '@ratees/utils';

const CreateApolloServer = async () => {

    try {
        const server = new ApolloServer<MyContextType>({
            typeDefs,
            resolvers
        });

        await server.start();

        logger.info("✅ Apollo server started successfully and running at /graphql")
        return server

    } catch (error) {
        logger.error(error, "❌ Failed to start Apollo server")
        throw new ApiError(500, "Failed to start graphql server ", [error], "", false)
    }
}

export { CreateApolloServer }



