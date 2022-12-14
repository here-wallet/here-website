import { HeaderComponent } from "../landing/scripts/HeaderComponent";
import { WaitlistModal } from "../landing/scripts/WaitlistModal";
import { maskedPhone } from "../landing/scripts/phoneMask";
import { initialize } from "./selector";
import Account from "./account";
import { formatAmount, formatPhone, validatePhone } from "./utils";

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

santaButton.disabled = true;
santaAmountInput.addEventListener("input", (e) => {
  santaButton.disabled =
    isNaN(+formatAmount(santaAmountInput.value)) ||
    !validatePhone(santaPhoneInput.value);
});

santaPhoneInput.addEventListener("input", (e) => {
  const { value, isValid } = maskedPhone(santaPhoneInput.value);
  santaButton.disabled = !isValid;
  santaPhoneInput.value = value;
  santaButton.disabled =
    isNaN(+formatAmount(santaAmountInput.value)) ||
    !validatePhone(santaPhoneInput.value);
});

const run = async () => {
  const { selector, modal, provider } = await initialize();
  const updateButton = () => {
    santaButton.innerHTML = selector.isSignedIn()
      ? "Open transaction to sign →"
      : "Login to wallet";
  };

  updateButton();
  selector.on("signedIn", updateButton);
  selector.on("signedOut", updateButton);

  santaButton.addEventListener("click", async () => {
    if (selector.isSignedIn()) {
      const wallet = await selector.wallet();
      const [{ accountId }] = await wallet.getAccounts();
      const account = new Account(accountId, wallet, provider);
      const phoneNumber = formatPhone(santaPhoneInput.value);
      const amount = formatAmount(santaAmountInput.value);
      await account.sendMoney(phoneNumber, amount, "Happy New Year!");
    } else {
      modal.show();
    }
  });
};

run();
