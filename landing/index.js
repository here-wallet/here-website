import { HeaderComponent } from "./scripts/HeaderComponent";
import { WaitlistModal } from "./scripts/WaitlistModal";
import "./section-features/index";
import "./section-binance/index";
import {
  QRCode,
  lightQR,
  darkQR,
} from "@here-wallet/core/build/qrcode-strategy";
import whiteHereLogo from '../assets/logo-white.svg'
import blackHereLogo from '../assets/logo-black.svg'
import whiteX from "../assets/icons/icon-x-white.svg"
import blackX from "../assets/icons/icon-x.svg"
import whiteBinanceLogo from "../assets/icons/icon-binance-white.svg"
import blackBinanceLogo from "../assets/icons/icon-binance-black.svg"

const qr = new QRCode({
  ...lightQR,
  size: 128,
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
      [0.3, "#525252"],
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

const binanceSection = document.querySelector(".binance-features__wrapper");
const binanceTitle = binanceSection.querySelector("h2");
const animateBinanceBackground = () => {
  const { y: binanceY } = binanceSection.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const opacity =
    windowWidth < 750
      ? (binanceY <= -450 ? 1 - smoothstep(-450, -860, binanceY) : smoothstep(700, 150, binanceY))
      : (binanceY <= -180 ? 1 - smoothstep(-180, -600, binanceY) : smoothstep(900, 300, binanceY));
  const color = `rgba(175, 115, 230, ${opacity})`;
  page.style.backgroundColor = color;
  const logo = document.querySelector(".binance-here__here");
  const x = document.querySelector(".binance-here__x");
  const binanceLogo = document.querySelector(".binance-here__binance");
  logo.src = opacity > 0.75 ? whiteHereLogo : blackHereLogo
  x.src = opacity > 0.75 ? whiteX : blackX
  binanceLogo.src = opacity > 0.75 ? whiteBinanceLogo : blackBinanceLogo
  binanceTitle.style.color = opacity > 0.75 ? "#FFFFFF" : "#2c3034";
};

const mapBinanceSectionWithActions = (opacity) => {
  if (opacity > 0.7) {
    const actionBtn = document.querySelector('.binance-here__switch');
    const actionItems = document.querySelectorAll('.binance-features__item, .binance-features-2__item');
    actionBtn.classList.add("action");
    actionItems.forEach(function (item) {
      item.classList.add("action");
    });
  }
}

const features = document.querySelectorAll(".feature-picture-phone");
const animateFeaturesParalax = () => {
  features.forEach((feature) => {
    const box = feature.getBoundingClientRect();
    const offset = window.innerWidth < 720 ? 40 : 20;
    feature.style.transition = "0.1s transform";
    feature.style.transform = `translateY(${Math.max(
      0,
      box.top / 15 - offset
    )}px)`;
  });
};

const updateScroll = () => {
  animatePage();
  animateBinanceBackground();
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

// Wait List Join
const waitlistButtons = Array.from(
  document.querySelectorAll(".waitlist-button")
);
// Switch Between ModalForm and MiniForm-in-MenuToggle
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

if (/Android/.test(navigator.userAgent)) {
  const element = document.querySelector('.appandroid');
  element.classList.add('app-show');
} else if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream) {
  const element = document.querySelector('.appstore');
  element.classList.add('app-show');
} else {
  const element = document.querySelector('.apprandom');
  element.classList.add('app-show');
}

window.addEventListener('DOMContentLoaded', function () {
  var headerNote = document.querySelector('.header-note');
  var closeButtonNote = document.querySelector('.header-note__close');

  // Check if the header-note should be shown
  var isHeaderNoteClosed = (document.cookie.indexOf('headerNoteClosed') !== -1) || (localStorage.getItem('headerNoteClosed') === 'true');

  if (!isHeaderNoteClosed) {
    var scrollHandler = function () {
      if (window.scrollY >= 300) {
        headerNote.classList.add('open');
      } else {
        headerNote.classList.remove('open');
      }
    };

    window.addEventListener('scroll', scrollHandler);

    // Close the header-note when the close button is clicked
    closeButtonNote.addEventListener('click', function () {
      headerNote.classList.remove('open');
      document.cookie = 'headerNoteClosed=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
      localStorage.setItem('headerNoteClosed', 'true');

      // Remove the scroll event listener after closing the header-note
      window.removeEventListener('scroll', scrollHandler);
    });
  } else {
    headerNote.classList.remove('open');
    document.cookie = 'headerNoteClosed=true; expires=Fri, 31 Dec 2000 23:59:59 GMT; path=/';
    localStorage.removeItem('headerNoteClosed');
  }
});


var imageloop = document.querySelector('.how-work__mobile-img');
// Set the initial state of the image
var isEnlarged = false;
// Add a click event listener to the image
imageloop.addEventListener('click', function () {
  if (!isEnlarged) {
    // Enlarge the image
    imageloop.classList.add('enlarged');
  } else {
    // Reset the image size
    imageloop.classList.remove('enlarged');
  }
  // Toggle the state
  isEnlarged = !isEnlarged;
});