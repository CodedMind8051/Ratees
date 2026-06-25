import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: `${import.meta.env.VITE_SERVER_BASE_URI}/graphql`,
        credentials: "include"
    }),
    cache: new InMemoryCache(),
});
