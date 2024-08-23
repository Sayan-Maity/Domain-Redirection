import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MetaMask } from "@web3-react/metamask";
import { Web3ReactProvider } from "@web3-react/core";
import { initializeConnector } from "@web3-react/core";
import { Toaster } from 'react-hot-toast';

// Initialize MetaMask connector
const [metaMask, metaMaskHooks] = initializeConnector((actions) => new MetaMask({ actions }));

createRoot(document.getElementById('root')).render(
  <Web3ReactProvider connectors={[[metaMask, metaMaskHooks]]}>
    <Toaster />
    <App />
  </Web3ReactProvider>
);
