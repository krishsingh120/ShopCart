import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

// CSS imports
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { CookiesProvider } from 'react-cookie';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <CookiesProvider>
        <App />
    </CookiesProvider>
    </BrowserRouter>
)
