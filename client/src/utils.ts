export const typedData = {
  domain: {
    name: 'Url Redirection',
    version: '1',
    chainId: 1,
    verifyingContract: '0xYourContractAddress',
  },
  message: {
    nonce: 'unique_nonce_generated_for_user',
    user: '0xUserEthereumAddress',
  },
  primaryType: 'AuthRequest',
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    AuthRequest: [
      { name: 'nonce', type: 'string' },
      { name: 'user', type: 'address' },
    ],
  },
};

export function shortenString(str) {
  if (str.length <= 8) {  // If the string is very short, return it as is
    return str;
  }
  return str.slice(0, 6) + '...' + str.slice(-4);
}