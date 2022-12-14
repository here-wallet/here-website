import { maskedPhone } from "./phoneMask";

export class WaitlistProvider {
  constructor(selector, onSubmit) {
    this.onSubmit = onSubmit;
    this.root = document.querySelector(selector);
    this.input = this.root.querySelector("input");
    this.button = this.root.querySelector(".here-button");
    this.button.disabled = true;

    this.input.addEventListener("input", (e) => {
      const { value, isValid } = maskedPhone(this.input.value);
      this.button.disabled = !isValid;
      this.input.value = value;
    });

    this.button.addEventListener("click", async () => {
      await this.submit(this.input.value);
    });
  }

  async submit(phone_number) {
    this.onSubmit();
    this.input.value = "";

    const res = await fetch(
      "https://api.herewallet.app/api/v1/web/android_whitelist",
      {
        method: "POST",
        body: JSON.stringify({ phone_number }),
      }
    );
  }
}
