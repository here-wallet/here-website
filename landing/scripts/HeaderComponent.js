import { successModal } from "./WaitlistModal";
import { WaitlistProvider } from "./WaitlistProvider";
import { QRCode, lightQR } from "@here-wallet/core/build/qrcode-strategy";

export class HeaderComponent {
  provider = new WaitlistProvider(".header-form");
  header = document.querySelector(".header");
  floatQr = document.querySelector(".float-qr");
  topButton = document.querySelector(".scroll-up");

  isOpen = false;

  constructor() {
    this.headerBody = this.header.querySelector(".header-body");
    this.btn = this.header.querySelector(".header-action");
    this.btn.addEventListener("click", () => this.toggleModal());

    this.header.classList.toggle("active", window.scrollY > 0);
    this.floatQr.classList.toggle("active", window.scrollY > 600);
    this.topButton.classList.toggle("active", window.scrollY > 600);

    this.topButton.addEventListener("click", () => {
      document.body.scrollIntoView({ behavior: "smooth" });
    });

    const value = "https://appstore.herewallet.app/site";
    const qr = new QRCode({ ...lightQR, size: 80, value });
    this.floatQr.querySelector(".qrcode").appendChild(qr.canvas);

    window.addEventListener("scroll", () => {
      this.header.classList.toggle("active", window.scrollY > 0);
      this.floatQr.classList.toggle("active", window.scrollY > 600);
      this.topButton.classList.toggle("active", window.scrollY > 600);
    });

    this.provider.onSubmit = () => {
      successModal.open();
    };
  }

  toggleModal = () => {
    this.btn.classList.toggle("open");
    this.headerBody.classList.toggle("open");

    this.isOpen = !this.isOpen;
    document.body.style.overflow = this.isOpen ? "hidden" : "";
  };
}

var customViewportCorrectionVariable = "vh";

function setViewportProperty(doc) {
  var prevClientHeight;
  var customVar = "--" + (customViewportCorrectionVariable || "vh");
  function handleResize() {
    var clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight() {
      doc.style.setProperty(customVar, clientHeight * 0.01 + "px");
      prevClientHeight = clientHeight;
    });
  }
  handleResize();
  return handleResize;
}
window.addEventListener(
  "resize",
  setViewportProperty(document.documentElement)
);
