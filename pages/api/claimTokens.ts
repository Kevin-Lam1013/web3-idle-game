import { Engine } from "@thirdweb-dev/engine";
import { NextApiRequest, NextApiResponse } from "next";
import {
  TOKEN_CONTRACT_ADDRESS,
  WORKER_CONTRACT_ADDRESS,
} from "../../constants/contracts";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    THIRDWEB_ENGINE_URL,
    THIRDWEB_ENGINE_ACCESS_TOKEN,
    THIRDWEB_ENGINE_WALLET,
  } = process.env;

  try {
    if (
      !THIRDWEB_ENGINE_URL ||
      !THIRDWEB_ENGINE_ACCESS_TOKEN ||
      !THIRDWEB_ENGINE_WALLET
    ) {
      throw new Error("Environment variables not set");
    }

    const { address } = req.body;

    if (!address) {
      throw new Error("Address not provided");
    }

    const engine = new Engine({
      url: THIRDWEB_ENGINE_URL,
      accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN,
    });

    // We are using polygon amoy testnet
    const claimWorker = await engine.erc721.claimTo(
      "80002",
      WORKER_CONTRACT_ADDRESS,
      THIRDWEB_ENGINE_WALLET,
      {
        receiver: address,
        quantity: "1",
      }
    );

    const claimTokens = await engine.erc20.mintTo(
      "80002",
      TOKEN_CONTRACT_ADDRESS,
      THIRDWEB_ENGINE_WALLET,
      {
        toAddress: address,
        amount: "100",
      }
    );

    const waitForMinedStatus = async (queueId: string) => {
      let status = "";
      while (status !== "mined") {
        const response = await engine.transaction.status(queueId);
        status = response.result.status as string;

        if (status === "mined") {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    };

    await waitForMinedStatus(claimWorker.result.queueId);
    await waitForMinedStatus(claimTokens.result.queueId);

    return res.status(200).json({ message: "Tokens claimed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error claiming tokens" });
  }
};

export default handler;
