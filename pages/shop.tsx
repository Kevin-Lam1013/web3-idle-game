import { useContract, useNFTs, useUser } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { getUser } from "./api/auth/[...thirdweb]";
import { useEffect } from "react";
import { BUSINESSES_CONTRACT_ADDRESS } from "../constants/contracts";
import styles from "../styles/Home.module.css";
import NFTCard from "../components/NFTCard";

export default function Shop() {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  const { contract: businessContract } = useContract(
    BUSINESSES_CONTRACT_ADDRESS
  );
  const { data: businesses } = useNFTs(businessContract);

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className={styles.main}>
      <h2>Buy a business:</h2>
      <div className={styles.grid}>
        {businesses && businesses.length > 0 ? (
          businesses.map((business) => (
            <NFTCard key={business.metadata.id} nft={business} />
          ))
        ) : (
          <p>No businesses for sale.</p>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
