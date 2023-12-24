import { maskedUserName } from "./maskedUserName";

// Form Logics
export class WaitlistProviderUserName {
  constructor(selector, onSubmit) {
    this.onSubmit = onSubmit;
    this.root = document.querySelector(selector);
    this.input = this.root.querySelector("input");
    this.button = this.root.querySelector(".here-button");


    this.button.addEventListener("click", async (e) => {
      const { value, isValid, error } = maskedUserName(this.input.value);
      this.input.value = value;

      const errorElement = this.root.querySelector(".error-valid");
      if (!isValid) {
        errorElement.textContent = error;
        errorElement.style.display = "block";
      } else {
        errorElement.style.display = "none";
        await this.submit(this.input.value);
      }
    });
    this.input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && this.input.value.trim() !== "") {
        await this.submit(this.input.value);
      }
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