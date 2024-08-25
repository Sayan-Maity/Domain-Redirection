import { useState } from 'react';
import { SiweMessage } from 'siwe';
import { Web3Provider } from "@ethersproject/providers";
import { shortenString } from './utils';
import { toast } from 'react-hot-toast'
import Spinner from './assets/SVGs/Spinner.svg'
import axios from 'axios'

const Login = ({
  userAddress,
  setUserAddress,
  isAuthenticated,
  setIsAuthenticated
}) => {
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

      try {
        await provider.send("eth_requestAccounts", []);
      } catch (error) {
        toast.error("User rejected the request.");
      }

      // Get signer and address:
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      if (address) {
        setUserAddress(address);
        // setLoading(false);
      }

      // Get nonce:
      let nonce;
      try {
        const nonceRes = await axios.get(`${BACKEND_ENDPOINT}/api/auth/nonce`, {
          withCredentials: true,
        });
        nonce = nonceRes.data.nonce;
      } catch (error) {
        toast.error("Failed to fetch nonce from backend.");
      }

      // Create SIWE message
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
      let signature;
      try {
        const message = siweMessage.prepareMessage();
        signature = await signer.signMessage(message);
      } catch (err) {
        toast.error("Message signing failed.");
      }

      // Verify the signed message with the backend
      try {
        const verifyResponse = await axios.post(`${BACKEND_ENDPOINT}/api/auth/verify`, {
          message: siweMessage.prepareMessage(),
          signature
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        if (verifyResponse.data.success) {
          setIsAuthenticated(true);
          toast.success("Metamask connected successfully!");
        } else {
          toast.error("Couldn't connect, Authentication failed!");
        }
      } catch (err) {
        toast.error("Verification with backend failed.");
      }
    } catch (err) {
      toast.error(`Error during authentication`);
    } finally {
      setLoading(false);
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
      {isAuthenticated && userAddress ? (
        <div className='flex gap-4'>
          <span
            title='address'
            className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full'
          >{shortenString(userAddress)}</span>
          <button
            onClick={handleLogout}
            title='Logout'
            className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full'
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
          ) : (
            <span>Connect</span>
          )}</button>
      )}
    </div>
  );
};

export default Login;
