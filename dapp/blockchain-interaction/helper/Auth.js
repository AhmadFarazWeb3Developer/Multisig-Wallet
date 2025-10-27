import { useEffect, useState, useCallback } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";

const useAuthenticate = () => {
  const { walletProvider } = useAppKitProvider("eip155");
  const { address, isConnected } = useAppKitAccount();

  const [signer, setSigner] = useState({});
  const [error, setError] = useState(null);

  const authenticate = useCallback(async () => {
    try {
      if (!isConnected) {
        setError("Wallet not connected");
        return;
      }
      if (!walletProvider) {
        setError("Provider not available");
        return;
      }

      const provider = new ethers.BrowserProvider(walletProvider);
      console.log("provider : ", provider);

      const newSigner = await provider.getSigner();

      if (!newSigner) {
        setError("Signer not available");
        return;
      }

      setSigner((prev) => {
        if (prev && prev.address === newSigner.address) return prev;
        return newSigner;
      });

      setError(null);
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(err.message || "Unknown error");
    }
  }, [isConnected, walletProvider]);

  useEffect(() => {
    authenticate();
  }, [authenticate, signer]);

  return { error, signer, isConnected, address };
};

export default useAuthenticate;
