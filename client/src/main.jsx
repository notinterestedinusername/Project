import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { StateContextProvider } from './context';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
const queryClient = new QueryClient(); // ADD THIS

//console.log('Client ID:', clientId);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider activeChain={Sepolia} clientId={clientId} autoConnect={false}>
    <QueryClientProvider client={queryClient}>
    <Router>
      <StateContextProvider>
        <App />
        </StateContextProvider>
    </Router>
    </QueryClientProvider>
  </ThirdwebProvider>
);