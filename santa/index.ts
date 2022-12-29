import { WalletSelector } from "@near-wallet-selector/core";
import { HeaderComponent } from "../landing/scripts/HeaderComponent";
import { WaitlistModal } from "../landing/scripts/WaitlistModal";
import { maskedPhone } from "../landing/scripts/phoneMask";

import Account from "../dapp/account";
import { initialize } from "../dapp/selector";
import { formatAmount, formatPhone, validatePhone } from "../dapp/utils";

const totalSent = document.getElementById("total-sent")!;
const totalHolders = document.getElementById("total-earn")!;

fetch("https://api.herewallet.app/api/v1/web/santa")
  .then((res) => res.json())
  .then(({ total, earned }) => {
    totalSent.innerHTML = total;
    totalSent.classList.remove("hide");
    totalHolders.innerHTML = earned;
    totalHolders.classList.remove("hide");
  });

const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

const waitlistButtons = Array.from(
  document.querySelectorAll(".waitlist-button")
);
waitlistButtons.forEach((el) => {
  el.addEventListener("click", () => {
    if (window.innerWidth <= 778) {
      headerInstance.toggleModal();
    } else {
      waitlistModal.open();
    }
  });
});

const santaForm = document.querySelector(".gift-now-form")!;
const santaPhoneInput =
  santaForm.querySelector<HTMLInputElement>(".phone-input")!;
const santaAmountInput =
  santaForm.querySelector<HTMLInputElement>(".amount-input")!;
const santaButton = santaForm.querySelector<HTMLButtonElement>("button")!;

santaPhoneInput.value = localStorage.getItem("phone") ?? "";
santaAmountInput.value = localStorage.getItem("amount") ?? "";
const updateSantaButton = (selector: WalletSelector) => {
  if (selector.isSignedIn()) {
    santaButton.disabled =
      isNaN(+formatAmount(santaAmountInput.value)) ||
      !validatePhone(santaPhoneInput.value);
  } else {
    santaButton.disabled = false;
  }

  santaButton.innerHTML = selector.isSignedIn()
    ? "Open transaction to sign →"
    : "Login to wallet →";
};

const run = async () => {
  const { selector, modal, provider } = await initialize();
  let santaAmount = 0;

  santaAmountInput.addEventListener("input", (e) => {
    localStorage.setItem("amount", santaAmountInput.value);
    updateSantaButton(selector);
  });

  santaPhoneInput.addEventListener("input", (e) => {
    const { value } = maskedPhone(santaPhoneInput.value);
    santaPhoneInput.value = value;
    localStorage.setItem("phone", santaPhoneInput.value);
    updateSantaButton(selector);
  });

  const updateButton = () => {
    santaPhoneInput.parentElement?.classList.toggle(
      "none",
      !selector.isSignedIn()
    );
    santaAmountInput.parentElement?.classList.toggle(
      "none",
      !selector.isSignedIn()
    );
    updateSantaButton(selector);
  };

  const fetchTokens = async (account: string) => {
    const res = await fetch(
      `https://api.herewallet.app/api/v1/user/fts?near_account_id=${account}`
    );
    const { fts } = await res.json();
    const santa = fts.find((token: any) => token.symbol === "SANTA");
    santaAmount = +santa.amount_int;
    document
      .querySelector(".gift-now-form-error")
      ?.classList.toggle("none", santaAmount !== 0);
    document.querySelector(
      ".input-wrap .max"
    )!.innerHTML = `${santaAmount} SANTA`;
  };

  updateButton();
  selector.on("signedIn", async ({ accounts }) => {
    fetchTokens(accounts[0].accountId);
    updateButton();
  });

  selector.on("signedOut", updateButton);

  if (selector.isSignedIn()) {
    const [{ accountId }] = await (await selector.wallet()).getAccounts();
    fetchTokens(accountId);
  }

  santaButton.addEventListener("click", async () => {
    if (selector.isSignedIn()) {
      const wallet = await selector.wallet();
      const [{ accountId }] = await wallet.getAccounts();
      const account = new Account(accountId, wallet, provider);
      const phoneNumber = formatPhone(santaPhoneInput.value);
      const amount = formatAmount(santaAmountInput.value);
      await account.sendSanta(phoneNumber, amount, "Happy New Year!");
    } else {
      modal.show();
    }
  });
};

run();
