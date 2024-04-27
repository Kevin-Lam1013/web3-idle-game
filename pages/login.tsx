import {
  ConnectEmbed,
  SmartWallet,
  useAddress,
  useSDK,
  useShowConnectEmbed,
  useUser,
  useWallet,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUser } from "./api/auth/[...thirdweb]";
import { WORKER_CONTRACT_ADDRESS } from "../constants/contracts";

const loginOptional = false;

const Login = () => {
  const showConnectedEmbed = useShowConnectEmbed();

  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  const wallet = useWallet();
  const address = useAddress();
  const sdk = useSDK();

  const [loadingWorkerStatus, setLoadingWorkerStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");

  const checkNewPlayer = async () => {
    try {
      if (wallet instanceof SmartWallet && address && sdk) {
        setLoadingWorkerStatus(true);
        setLoadingStatus("Checking worker balance...");

        const workerContract = await sdk.getContract(WORKER_CONTRACT_ADDRESS);
        const workerBalance = await workerContract.erc721.balanceOf(address);

        if (workerBalance.toNumber() === 0) {
          setLoadingStatus("No worker found...");

          try {
            setLoadingStatus("Claiming worker and tokens...");

            const response = await fetch("/api/claimTokens", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ address }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message);
            }

            setLoadingStatus("Worker and tokens claimed...");
          } catch (error) {
            console.error(error);
          } finally {
            setLoadingStatus("");
            router.push("/");
          }
        } else {
          setLoadingStatus("");
          router.push("/");
        }
      } else {
        alert("Wallet is not a smart wallet");
      }
    } catch (error) {
      console.error(error);
      alert("Error checking new player");
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      checkNewPlayer();
    }
  }, [isLoggedIn, isLoading, wallet]);

  if (loadingWorkerStatus) {
    return (
      <div className={styles.container}>
        <h1>{loadingStatus}</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Web3 Idle Game</h1>
      {showConnectedEmbed && (
        <ConnectEmbed
          auth={{
            loginOptional: loginOptional,
          }}
        />
      )}
    </div>
  );
};

export default Login;

export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
