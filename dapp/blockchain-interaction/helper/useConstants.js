import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";
import SingletonFactoryABI from "../../app/on-chain/artifacts/contracts/SingletonFactory.sol/SingletonFactory.json";

const useConstants = () => {
  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];

  const singletonFactoryABI = SingletonFactoryABI.abi;

  return { singletonFactoryAddress, singletonFactoryABI };
};

export default useConstants;

/*
npx hardhat ignition deploy ./ignition/modules/SingltonFactory.ts --network localhost
*/
