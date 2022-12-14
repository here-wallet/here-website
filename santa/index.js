import { HeaderComponent } from "../landing/scripts/HeaderComponent";
import { WaitlistModal } from "../landing/scripts/WaitlistModal";
import { maskedPhone } from "../landing/scripts/phoneMask";
import { initialize } from "./selector";

const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

const santaForm = document.querySelector(".gift-now-form");
const santaPhoneInput = santaForm.querySelector(".phone-input");
const santaAmountInput = santaForm.querySelector(".amount-input");
const santaButton = santaForm.querySelector("button");

santaPhoneInput.addEventListener("input", (e) => {
  const { value, isValid } = maskedPhone(santaPhoneInput.value);
  santaButton.disabled = !isValid;
  santaPhoneInput.value = value;
});

const run = async () => {
  console.log("selector.isSignedIn()");

  const { selector, modal } = await initialize();

  const updateButton = () => {
    console.log("selector.isSignedIn()", selector.isSignedIn());
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
      await wallet.signAndSendTransaction({
        actions: [{ type: "FunctionCall", params: { methodName: "transfer" } }],
      });
    } else {
      modal.show();
    }
  });
};

run();
