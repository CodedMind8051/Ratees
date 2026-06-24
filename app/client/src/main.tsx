import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { apolloClient } from './lib/graphql';
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom"
import { Toaster } from './components/ui/shadcn/sonner'




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