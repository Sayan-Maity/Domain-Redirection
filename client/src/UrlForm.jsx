import { useState } from 'react';
import axios from 'axios';
import { InfuraProvider } from '@ethersproject/providers';
import toast from 'react-hot-toast';

const UrlForm = ({ userAddress }) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_URL
  const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!userAddress) {
      toast.error('Please connect your wallet first!');
      return;
    }

    try {
      setLoading(true);
      const isOwner = await verifyENSOwnership(sourceUrl, userAddress);

      if (isOwner) {
        try {
          const res = await axios.post(`${BACKEND_ENDPOINT}/api/urls/create`, {
            sourceUrl,
            destinationUrl
          });

          if (res.data.customUrl) {
            setCustomUrl(res.data.customUrl);
            setLoading(false);
            toast.success('Redirect URL created successfully.');
          }
        } catch (err) {
          setLoading(false);
          toast.error('Error creating redirect URL.');
        }
      } else {
        toast.error('You do not own the given ENS domain.');
        setLoading(false);
      }
    } catch {
      toast.error('Error verifying ENS domain ownership.');
    }
  };

  const verifyENSOwnership = async (domain, userWalletAddress) => {
    try {
      const provider = new InfuraProvider('mainnet', INFURA_API_KEY);

      // Resolve ENS domain
      const resolvedAddress = await provider.resolveName(domain);

      if (resolvedAddress && userWalletAddress.toLowerCase() === resolvedAddress.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    } catch {
      // console.error('Error verifying ENS domain ownership:', error);
      toast.error('Error verifying ENS domain ownership.');
      return false;
    }
  }

  return (
    <div className='w-full flex items-center justify-center flex-col gap-10'>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-10 w-[50%]"
      >
        <input
          type="text"
          placeholder="Your .eth domain"
          value={sourceUrl}
          id='source'
          onChange={(e) => setSourceUrl(e.target.value)}
          required
          className='py-4 px-8 rounded-full bg-[#2D2326] border-2 border-[#6C6767] text-[#6C6767] placeholder-[#6C6767] outline-none focus:border-[#9d9797] w-full'
        />
        <input
          type="text"
          placeholder="Your destination URL"
          value={destinationUrl}
          id='destination'
          onChange={(e) => setDestinationUrl(e.target.value)}
          required
          className='py-4 px-8 rounded-full bg-[#2D2326] border-2 border-[#6C6767] text-[#6C6767] placeholder-[#6C6767] outline-none focus:border-[#9d9797] w-full'
        />
        <button
          type="submit"
          className='bg-[#342718] text-[#EBB94C] py-3 px-6 rounded-full w-fit'
        >{loading ? 'Creating' : 'Create Redirect'}</button>
      </form>
      <div className="w-[50%] flex items-center justify-center">
        {customUrl && (
          <div className='flex w-fit bg-[#1e3418] text-[#4ceb64] py-3 px-6 rounded-full'>
            <span className='mr-4'>Redirect URL, click here 👉🏼</span>
            <a
              href={customUrl}
              target="_blank"
              rel="noopener noreferrer"
              className='underline'
            >{customUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
