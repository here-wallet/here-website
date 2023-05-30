import { maskedUserName } from "./maskedUserName";

// Form Logics
export class WaitlistProviderUserName {
  constructor(selector, onSubmit) {
    this.onSubmit = onSubmit;
    this.root = document.querySelector(selector);
    this.input = this.root.querySelector("input");
    this.button = this.root.querySelector(".here-button");
    this.button.disabled = true;

    this.input.addEventListener("input", (e) => {
      const { value, isValid } = maskedUserName(this.input.value); // modify to use the maskedUserName function
      this.button.disabled = !isValid;
      this.input.value = value;
    });
    this.input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && this.input.value.trim() !== "") {
        await this.submit(this.input.value);
      }
    });
    this.button.addEventListener("click", async () => {
      await this.submit(this.input.value);
    });
  }

  async submit(user_name) {
    console.log(JSON.stringify(user_name));
    this.onSubmit();
    this.input.value = "";

    const res = await fetch(
      "https://api.herewallet.app/api/v1/web/android_whitelist",
      {
        method: "POST",
        body: JSON.stringify({ user_name }),
      }
    );
  }
}