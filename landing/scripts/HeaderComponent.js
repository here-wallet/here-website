import { WaitlistProvider } from "./WaitlistProvider";

export class HeaderComponent {
  provider = new WaitlistProvider(".header-form");
  header = document.querySelector(".header");
  floatQr = document.querySelector(".float-qr");
  isOpen = false;

  constructor() {
    this.headerBody = this.header.querySelector(".header-body");
    this.btn = this.header.querySelector(".header-action");
    this.btn.addEventListener("click", () => this.toggleModal());

    this.header.classList.toggle("active", window.scrollY > 0);
    this.floatQr.classList.toggle("active", window.scrollY > 600);

    window.addEventListener("scroll", () => {
      this.header.classList.toggle("active", window.scrollY > 0);
      this.floatQr.classList.toggle("active", window.scrollY > 600);
    });
  }

  toggleModal = () => {
    this.btn.classList.toggle("open");
    this.headerBody.style.height = `${window.innerHeight - 72}px`;
    this.headerBody.classList.toggle("open");

    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "";
  };
}
