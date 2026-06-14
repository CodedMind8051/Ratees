import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { apolloClient } from './graphql';
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom"
import { Toaster } from './components/ui/sonner'




ReactDOM.createRoot(
    document.getElementById('root')!

).render(
    <ApolloProvider client={apolloClient}>
        <BrowserRouter>
            <App />
            <Toaster />
        </BrowserRouter>
    </ApolloProvider>

)