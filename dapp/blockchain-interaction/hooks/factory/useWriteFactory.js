import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useConstants from "../../helper/useConstants";
import useAuthenticate from "@/blockchain-interaction/helper/Auth";

const useWriteFactoryContract = () => {
  const { singletonFactoryAddress, singletonFactoryABI } = useConstants();
  const [singletonFactoryWriteInstance, setSingletonFactoryWriteInstance] =
    useState({});

  const [isLoading, setIsLoading] = useState(false);
  const { error, signer } = useAuthenticate();

  useEffect(() => {
    const initContract = async () => {
      if (!signer) {
        setSingletonFactoryWriteInstance("");
        return;
      }

      setIsLoading(true);
      try {
        if (error) {
          console.log(error);
          return;
        }

        const contract = new ethers.Contract(
          singletonFactoryAddress,
          singletonFactoryABI,
          signer
        );

        console.log("Contract instance created successfully");
        setSingletonFactoryWriteInstance(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
        setSingletonFactoryWriteInstance("");
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [signer]);

  return { singletonFactoryWriteInstance, isLoading, signer };
};

export default useWriteFactoryContract;
