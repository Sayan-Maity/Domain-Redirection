import { useState } from 'react';
import { SiweMessage } from 'siwe';
import { Web3Provider } from "@ethersproject/providers";
import { shortenString } from './utils';
import { toast } from 'react-hot-toast'
import Spinner from './assets/SVGs/Spinner.svg'

const Login = ({ userAddress, setUserAddress }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      if (address) setUserAddress(address);

      const nonceRes = await fetch(`${BACKEND_ENDPOINT}/api/auth/nonce`);
      const { nonce } = await nonceRes.json();

      // Create the SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,  // Ethereum Mainnet
        nonce
      });

      // Sign the message
      const message = siweMessage.prepareMessage();
      const signature = await signer.signMessage(message);

      // Verify the signed message with the backend
      const verifyResponse = await fetch(`${BACKEND_ENDPOINT}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include',
      });

      const result = await verifyResponse.json();
      if (result.success) {
        setLoading(false);
        setIsAuthenticated(true);
        toast.success("Metamask connected successfully!");
      } else {
        setLoading(false);
        toast.error("Couldn't connect, Authentication failed!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error during authentication:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false);
      setUserAddress('');
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error during logout:", error);
    }
  };


  return (
    <div className='flex items-center justify-center gap-4'>
      {isAuthenticated ? (
        <div>
          <span
            title='address'
            className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full'
          >{shortenString(userAddress)}</span>
          <button
            onClick={handleLogout}
            title='Logout'
            className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full ml-4'
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          title='Connect with MetaMask'
          className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full'
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <div>
                <img src={Spinner} alt="spinner" />
              </div>
              <span>Connecting</span>
            </div>
          ) :
            <span>Connect</span>
          }</button>
      )}
    </div>
  );
};

export default Login;
