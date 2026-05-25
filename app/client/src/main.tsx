import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter } from "react-router-dom"
import { Toaster } from './components/ui/sonner'


ReactDOM.createRoot(
    document.getElementById('root')!

).render(

    <BrowserRouter>
        <App />
        <Toaster />
    </BrowserRouter>

)