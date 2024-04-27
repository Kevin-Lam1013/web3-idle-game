import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS } from "../constants/contracts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={PolygonAmoyTestnet}
      supportedWallets={[
        smartWallet(embeddedWallet(), {
          factoryAddress: ACCOUNT_FACTORY_CONTRACT_ADDRESS,
          gasless: true,
        }),
      ]}
      authConfig={{
        domain: process.env.DOMAIN || "",
        authUrl: "/api/auth",
      }}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
