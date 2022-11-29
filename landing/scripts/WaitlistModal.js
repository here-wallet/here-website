import { WaitlistProvider } from "./WaitlistProvider";

export class WaitlistModal {
  constructor() {
    this.el = document.getElementById("waitlist-modal");
    this.provider = new WaitlistProvider("#waitlist-modal");

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && this.isOpen) this.close()
    })
  
    this.el.addEventListener("click", () => this.close());
    this.el
      .querySelector(".modal-body")
      .addEventListener("click", (e) => e.stopPropagation());
  }

  get isOpen() {
    return this.el.classList.contains('open')
  }

  close() {
    this.el.classList.remove("open");
    document.body.style.overflow = "";
  }

  open() {
    this.el.classList.add("open");
    this.el.querySelector("input")?.focus();
    document.body.style.overflow = "hidden";
  }
}
