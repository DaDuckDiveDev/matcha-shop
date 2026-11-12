import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import { LangProvider } from './lib/LangContext.jsx';
import '@fontsource/hina-mincho/latin-400.css';
import '@fontsource/hina-mincho/latin-ext-400.css';
import '@fontsource-variable/hanken-grotesk/wght.css';
import './styles/site.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
);
