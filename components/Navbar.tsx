import {
  ConnectWallet,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { TOKEN_CONTRACT_ADDRESS } from "../constants/contracts";

const Navbar = () => {
  const address = useAddress();

  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  const truncateNumber = (num: string) => {
    return num.slice(0, 6);
  };

  return (
    <div className={styles.navbarContainer}>
      {address && (
        <>
          <h1>Web 3 Idle Game</h1>
          <div className={styles.navbarOptions}>
            <Link href="/">Businesses</Link>
            <Link href="/shop">Shop</Link>
          </div>
          <div className={styles.navbarOptions}>
            {tokenBalance && (
              <p>
                {truncateNumber(tokenBalance.displayValue as string)}{" "}
                {tokenBalance.symbol}
              </p>
            )}
            <ConnectWallet />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
