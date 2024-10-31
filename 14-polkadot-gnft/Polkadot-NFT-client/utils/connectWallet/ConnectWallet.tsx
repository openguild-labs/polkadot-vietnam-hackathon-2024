import { useEffect, useState } from 'react';

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load wallet address from localStorage when component mounts
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined') {
      const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');

      const extensions = await web3Enable('Unique Network App');
      if (extensions.length === 0) {
        console.log('No extension found');
        return;
      }

      const accounts = await web3Accounts();
      if (accounts.length > 0 && accounts[0]?.address) {
        const address = accounts[0].address;
        setWalletAddress(address);
        setConnected(true);
        localStorage.setItem('walletAddress', address); // Store in local storage
      } else {
        console.log('No accounts found');
      }
    } else {
      console.log('This code is running on the server.');
    }
  };

  const disconnectWallet = async () => {
    if (typeof window !== 'undefined') {
      const { web3Enable } = await import('@polkadot/extension-dapp');

      const extensions = await web3Enable('Unique Network App');
      
      if (extensions.length > 0) {
        setWalletAddress(null);
        setConnected(false);
        localStorage.removeItem('walletAddress'); // Remove from local storage
        setShowDropdown(false); // Close dropdown on disconnect
        console.log('Disconnected from wallet');
      } else {
        console.log('No extension enabled');
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev); // Toggle the dropdown on button click
  };

  return (
    <div className="relative inline-block">
      {!connected ? (
        <button
          onClick={connectWallet}
          className="w-32 h-10 px-4 py-2 text-gray-800 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-150"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={toggleDropdown}
          className="w-32 h-10 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-150 truncate"
        >
          {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-5)}
        </button>
      )}

      {/* Dropdown Menu */}
      {connected && showDropdown && (
        <div
          className="absolute mt-2 w-full bg-gray-700 text-white rounded-lg shadow-lg border border-gray-300 z-50"
        >
          <button
            onClick={disconnectWallet}
            className="w-full px-4 py-2 text-left hover:bg-gray-600 rounded-lg focus:outline-none"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
