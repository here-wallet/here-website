import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui-js";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import "@near-wallet-selector/modal-ui-js/styles.css";

export const initialize = async () => {
  const selector = await setupWalletSelector({
    network: "mainnet",
    modules: [
      setupHereWallet(),
      setupNearWallet(),
      setupMyNearWallet(),
      setupSender(),
      setupMathWallet(),
      setupNightly(),
      setupMeteorWallet(),
      setupLedger(),
    ],
  });

  const modal = setupModal(selector, {
    contractId: "santa-token.near",
  });

  return { selector, modal };
};
