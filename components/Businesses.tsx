import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import styles from "../styles/Home.module.css";
import { BigNumber } from "ethers";
import BusinessCard from "./BusinessCard";

const Businesses = () => {
  const address = useAddress();

  const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
  const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
  );

  return (
    <div className={styles.businessContainer} style={{ width: "50%" }}>
      {!loadingBusinesses ? (
        <>
          <h2>Businesses:</h2>
          <div className={styles.grid}>
            {stakedTokens && stakedTokens[0].length > 0 ? (
              stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <BusinessCard
                  key={stakedToken.toString()}
                  tokenId={stakedToken.toNumber()}
                />
              ))
            ) : (
              <p>No businesses started.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading businesses...</p>
      )}
    </div>
  );
};

export default Businesses;
