import { HeaderComponent } from "./scripts/HeaderComponent";
import { WaitlistModal } from "./scripts/WaitlistModal";
import {
  QRCode,
  lightQR,
  darkQR,
} from "@here-wallet/core/build/qrcode-strategy";

const qr = new QRCode({
  ...lightQR,
  size: 220,
  value: "https://download.herewallet.app",
});

document.querySelector(".qrcode-main").appendChild(qr.canvas);

const qrSecond = new QRCode({
  ...darkQR,
  size: 168,
  fill: {
    type: "linear-gradient",
    position: [0, 0, 1, 1],
    colorStops: [
      [0, "#34302C"],
      [0.3, "#FD84E3"],
      [0.85, "#34302C"],
    ],
  },
  value: "https://download.herewallet.app",
});

document.querySelector(".qr-second").appendChild(qrSecond.canvas);


const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

const smoothstep = (min, max, value) => {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const page = document.getElementsByClassName("page")[0];
const pageBg = document.getElementsByClassName("page-background")[0];
const animatePage = () => {
  let pad = window.innerWidth < 1600 ? 44 : 88;
  pad = window.innerWidth < 1200 ? 0 : pad;
  const { y: pageY, height: pageHeight } = pageBg.getBoundingClientRect();
  const step =
    pageY > 0
      ? 1 - smoothstep(620, 200, pageY)
      : smoothstep(-pageHeight + 1000, -pageHeight + 500, pageY);

  const offset = step * pad;
  pageBg.style.left = offset + "px";
  pageBg.style.right = offset + "px";
};

const news = document.getElementsByClassName("news")[0];
const newsTitle = news.querySelector("h2");
const animateNewsBackground = () => {
  const { y: newsY } = news.getBoundingClientRect();
  const opacity =
    newsY <= -180
      ? 1 - smoothstep(-180, -600, newsY)
      : smoothstep(500, 100, newsY);
  const color = `rgba(175, 115, 230, ${opacity})`;
  page.style.backgroundColor = color;
  newsTitle.style.color = opacity > 0.5 ? "#f3ebea" : "#2c3034";
  newsTitle.style.transition = "0.3s color";
};

const features = document.querySelectorAll(".feature-picture-phone");
const animateFeaturesParalax = () => {
  features.forEach((feature) => {
    const box = feature.getBoundingClientRect();
    const offset = window.innerWidth < 720 ? 40 : 20;
    feature.style.transition = "0.1s transform";
    feature.style.transform = `translateY(${Math.max(
      0,
      box.top / 6 - offset
    )}px)`;
  });
};

const updateScroll = () => {
  animatePage();
  animateNewsBackground();
  animateFeaturesParalax();
};

document.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

const asks = Array.from(document.querySelectorAll(".ask-block"));
asks.forEach((el) => {
  el.addEventListener("click", () => {
    const header = el.querySelector(".ask-block-header");
    const body = el.querySelector(".ask-block-body");
    const headerBox = header.getBoundingClientRect();

    asks.forEach((ask) => {
      if (ask == el) return;
      const header = ask.querySelector(".ask-block-header");
      const box = header.getBoundingClientRect();
      ask.classList.remove("open");
      ask.style.height = box.height + "px";
    });

    el.style.height = headerBox.height + "px";
    body.style.display = "block";
    setTimeout(() => {
      const { height } = body.getBoundingClientRect();
      el.classList.toggle("open");
      el.style.height = el.classList.contains("open")
        ? `${headerBox.height + height}px`
        : headerBox.height + "px";
    }, 10);
  });
});

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

const newsItems = Array.from(document.querySelectorAll(".news-item"));
newsItems.forEach((el) => {
  el.addEventListener("click", () => {
    el.querySelector("a")?.click();
  });
});

const secureBanner = document.querySelector(".secure-banner");
secureBanner?.addEventListener("click", (e) => {
  if (e.target.tag === "a") return;
  secureBanner.querySelector(".secure-banner-link")?.click();
});
