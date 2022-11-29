export class WaitlistProvider {
  constructor(selector) {
    this.root = document.querySelector(selector);
    this.input = this.root.querySelector("input");
    this.button = this.root.querySelector("button");

    const mask = "+X (XXX) XXX-XX-XXXX".split("");
    this.input.addEventListener("input", (e) => {
      const numbers = this.input.value.replace(/\D/g, "").split("");

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

  async submit(phone) {
    const res = await fetch({
      method: "POST",
      url: "https://api.herewallet.app/v1/waitlist",
      body: JSON.stringify({ phone }),
    });
  }
}
