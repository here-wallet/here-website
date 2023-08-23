import { HereWallet } from "@here-wallet/core";
import { QRCodeStrategy } from "@here-wallet/core/build/qrcode-strategy";

const page = document.getElementsByClassName("page")[0];
const pageBg = document.getElementsByClassName("page-background")[0];

const animatePage = () => {
  let pad = window.innerWidth < 1600 ? 44 : 88;
  pad = window.innerWidth < 1200 ? 0 : pad;
  const { y: pageY, height: pageHeight } = pageBg.getBoundingClientRect();
  const step =
    pageY > 0
      ? 0 - smoothstep(620, 200, pageY)
      : smoothstep(-pageHeight + 1000, -pageHeight + 500, pageY);

  const offset = step * pad;
  pageBg.style.left = offset + "px";
  pageBg.style.right = offset + "px";
};

const smoothstep = (min, max, value) => {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const nftSection = document.querySelector(".mint-nft");
const nftBackgroundTexture = nftSection.querySelector(
  ".mint-nft-background-dots"
);
const nftBackgroundDots = nftSection.querySelector(
  ".mint-nft-background-texture"
);

const animateNftBackground = () => {
  const { y: nftY } = nftSection.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const opacity =
    windowWidth < 750
      ? nftY <= -50
        ? 1 - smoothstep(-450, -860, nftY)
        : smoothstep(700, 150, nftY)
      : nftY <= -180
        ? 1 - smoothstep(-180, -600, nftY)
        : smoothstep(900, 300, nftY);

  const color = `rgba(43, 34, 124, ${opacity})`;
  page.style.backgroundColor = color;
  nftBackgroundTexture.style.display = opacity > 0.65 ? "block" : "none";
  nftBackgroundDots.style.display = opacity > 0.65 ? "block" : "none";
  nftBackgroundTexture.style.opacity = opacity > 0.85 ? opacity : 0;
  nftBackgroundDots.style.opacity = opacity > 0.85 ? opacity : 0;
};

const updateScroll = () => {
  animateNftBackground();
  animatePage();
};

document.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

const modal = document.querySelector(".modal-wrap");
const here = new HereWallet();

const updateTimer = () => {
  const deadline = new Date("Aug, 25, 2023");
  const diff = Math.round((deadline - Date.now()) / 1000);
  const dd = Math.floor(diff / (3600 * 24));

  const hh = Math.floor(diff / 3600) % 24;
  const mm = Math.floor(diff / 60) % 60;
  const ss = diff % 60;

  const timersToMint = document.querySelectorAll('#time-to-mint')
  timersToMint.forEach(elementNode => {
    elementNode.style.width = "350px";
    elementNode.innerHTML =
      dd +
      "d " +
      hh +
      ":" +
      (mm < 10 ? "0" + mm : mm) +
      ":" +
      (ss < 10 ? "0" + ss : ss);
  })

};

updateTimer();
setInterval(updateTimer, 1000);

const connectButton = document.querySelector(".connect-button");
const signIn = async () => {
  const isSignedIn = await here.isSignedIn();
  if (!isSignedIn) return;
  const id = await here.getAccountId();
  connectButton.innerHTML =
    id.length < 30 ? id : id.slice(0, 6) + ".." + id.slice(-6);

  const ids = ".connect-link, .mint-button-connect";
  const connectLinks = document.querySelectorAll(ids);
  connectLinks.forEach((el) => (el.style.display = "none"));
};

signIn();

let isRequested = false;
export const toggleModalSuccess = async () => {
  if (isRequested) return;
  isRequested = true;

  if (modal.style.display === "block") {
    modal.style.display = "none";
    document.querySelector(".modal-qr-wrap").innerHTML = "";
    isRequested = false;
    return;
  }

  const isSignedIn = await here.isSignedIn();
  if (!isSignedIn) {
    await here.signIn({
      contractId: "mm.herewallet.near",
      onRequested: () => {
        isRequested = false;
        modal.style.display = "block";
      },
      strategy: new QRCodeStrategy({
        element: document.querySelector(".modal-qr-wrap"),
        size: 200,
      }),
    });

    await signIn();
    modal.style.display = "none";
    return;
  }

  await here.signOut();
  connectButton.innerHTML = "Connect wallet";
  modal.style.display = "none";
};

const closeModal = document.querySelector(".modal-close");
closeModal.addEventListener("click", toggleModalSuccess);

const ids = ".connect-link, .mint-button-connect, .connect-button";
const connectLinks = document.querySelectorAll(ids);
connectLinks.forEach((element) => {
  element.addEventListener("click", toggleModalSuccess);
});
