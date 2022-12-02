export class WaitlistProvider {
  constructor(selector, onSubmit) {
    this.onSubmit = onSubmit;
    this.root = document.querySelector(selector);
    this.input = this.root.querySelector("input");
    this.button = this.root.querySelector(".here-button");
    this.button.disabled = true;

    const mask = "+X (XXX) XXX-XX-XXXX".split("");
    this.input.addEventListener("input", (e) => {
      const numbers = this.input.value.replace(/\D/g, "").split("");
      this.button.disabled = numbers.length < 6;

      let result = "";
      for (let i = 0; i < mask.length; i++) {
        if (numbers.length == 0) break;
        const char = mask[i];
        if ([" ", "(", ")", "+", "-"].includes(char)) {
          if (numbers.length) result += char;
          else break;
          continue;
        }

        result += numbers.shift();
      }

      this.input.value = result;
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
