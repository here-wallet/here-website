import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui-js";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui-js/styles.css";
import { JsonRpcProvider } from "near-api-js/lib/providers";

export const initialize = async () => {
  const selector = await setupWalletSelector({
    network: "mainnet",
    modules: [setupHereWallet(), setupNearWallet()],
  });

  const modal = setupModal(selector, {
    contractId: "santa_token.near",
  });

  const provider = new JsonRpcProvider(selector.options.network.nodeUrl);
  return { selector, modal, provider };
};
