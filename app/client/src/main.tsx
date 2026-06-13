import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom"
import { Toaster } from './components/ui/sonner'


export const client = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:5000/graphql" }),
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(
    document.getElementById('root')!

).render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
            <Toaster />
        </BrowserRouter>
    </ApolloProvider>

)