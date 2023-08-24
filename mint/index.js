import { HereWallet } from "@here-wallet/core";
import { QRCodeStrategy } from "@here-wallet/core/build/qrcode-strategy";
import { base_encode } from "near-api-js/lib/utils/serialize";
import { HeaderComponent } from "../landing/scripts/HeaderComponent";

const headerInstance = new HeaderComponent();
const page = document.getElementsByClassName("page")[0];
const bgConnectQR = document.querySelector(".background-connect-qrcode");

const nftSection = document.querySelector(".mint-nft");
const nftBackgroundTexture = nftSection.querySelector(".mint-nft-background-dots");
const nftBackgroundDots = nftSection.querySelector(".mint-nft-background-texture");

const anchorRewards = document.getElementById("anchor-rewards");
const anchorTimeline = document.getElementById("anchor-timeline");

anchorRewards.addEventListener("click", () => {
  document.querySelector(".mint-nft").scrollIntoView({ behavior: "smooth" });
});

anchorTimeline.addEventListener("click", () => {
  document.querySelector(".mint-timeline").scrollIntoView({ behavior: "smooth" });
});

const modal = document.querySelector(".modal-wrap");
const modalQR = document.querySelector(".modal-qr-wrap");
const closeModal = document.querySelector(".modal-close");
const connectLinks = document.querySelectorAll(".connect-link, .mint-button-connect, .connect-button");
const connectButton = document.querySelector(".connect-button");
const mintConnectButton = document.querySelector(".mint-button-connect");

const timerMintEls = document.querySelectorAll(".time-to-mint");
const requiredTimesEls = document.querySelectorAll(".required-time-info");
const totalMintedEls = document.querySelectorAll(".total-minted");

const requireActivityEls = document.querySelectorAll(".required-activity");
const requireTimeEls = document.querySelectorAll(".required-time");

const here = new HereWallet();

const smoothstep = (min, max, value) => {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

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
  nftBackgroundTexture.style.display = opacity > 0.65 ? "block" : "none";
  nftBackgroundDots.style.display = opacity > 0.65 ? "block" : "none";
  nftBackgroundTexture.style.opacity = opacity > 0.85 ? opacity : 0;
  nftBackgroundDots.style.opacity = opacity > 0.85 ? opacity : 0;
  page.style.backgroundColor = color;
};

document.addEventListener("scroll", animateNftBackground, { passive: true });
animateNftBackground();

const startTimer = async () => {
  const res = await fetch("https://dev.herewallet.app/api/v1/user/starbox");
  const data = await res.json();
  const deadline = Date.now() + data.start_mint_in * 1000;

  const updateTimer = () => {
    const diff = Math.round((deadline - Date.now()) / 1000);
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor(diff / 60) % 60;
    const ss = diff % 60;

    timerMintEls.forEach((elementNode) => {
      elementNode.style.width = "350px";
      elementNode.innerHTML =
        (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
    });

    requiredTimesEls.forEach((el) => {
      el.innerHTML = new Date(deadline).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    });
  };

  setInterval(updateTimer, 1000);
  updateTimer();
};

const signIn = async () => {
  const auth = JSON.parse(localStorage.getItem("account"));
  if (!auth) return;

  const id = auth.account_id;
  connectLinks.forEach((el) => (el.style.display = "none"));
  connectButton.innerHTML = id.length < 30 ? id : id.slice(0, 6) + ".." + id.slice(-6);
  connectButton.style.display = "flex";
  mintConnectButton.innerHTML = id.length < 30 ? id : id.slice(0, 10) + ".." + id.slice(-10);
  mintConnectButton.classList.add("connected");

  const res = await fetch("https://dev.herewallet.app/api/v1/user/starbox?account_id=" + id);
  const data = await res.json();

  totalMintedEls.forEach((el) => (el.textContent = data.total_minted));
  requireActivityEls[0].style.display = data.nft2 === 0 ? "flex" : "none";
  requireActivityEls[1].style.display = data.nft3 === 0 ? "flex" : "none";
  requireTimeEls[0].style.display = data.start_mint_in > 0 ? "flex" : "none";
  requireTimeEls[1].style.display = data.nft2 === 1 && data.start_mint_in > 0 ? "flex" : "none";
  requireTimeEls[2].style.display = data.nft3 === 1 && data.start_mint_in > 0 ? "flex" : "none";
};

const register = async (options) => {
  let nonceArray = new Uint8Array(32);
  const nonce = [...crypto.getRandomValues(nonceArray)];
  const result = await here.signMessage({ nonce, message: "starbox", receiver: "HERE Wallet", ...options });
  const auth = JSON.stringify({
    account_id: result.accountId,
    signature: base_encode(Buffer.from(result.signature)),
    public_key: result.publicKey.toString(),
    nonce,
  });

  const response = await fetch("https://dev.herewallet.app/api/v1/user/alarm_starbox", {
    method: "POST",
    body: auth,
  });

  await response.json();
  localStorage.setItem("account", auth);
  await signIn();
};

let isRequested = false;
export const toggleModalSuccess = async () => {
  if (isRequested) return;
  isRequested = true;

  if (modal.style.display === "flex") {
    modal.style.display = "none";
    modalQR.innerHTML = "";
    isRequested = false;
    return;
  }

  if (!localStorage.getItem("account")) {
    await register({
      strategy: new QRCodeStrategy({ element: modalQR, size: 200 }),
      onRequested: (id) => {
        isRequested = false;
        modal.style.display = "flex";
        document.querySelector(".modal-mobile-button-connect").href = "herewallet://request/" + id;
      },
    });

    modal.style.display = "none";
    return;
  }

  localStorage.removeItem("account");
  connectButton.innerHTML = "Connect wallet";
  mintConnectButton.innerHTML = "Connect wallet";
  mintConnectButton.classList.remove("connected");
  modal.style.display = "none";
  isRequested = false;
};

modal.addEventListener("click", (e) => {
  if (e.target === modal) toggleModalSuccess();
});

closeModal.addEventListener("click", toggleModalSuccess);
connectLinks.forEach((element) => {
  element.addEventListener("click", toggleModalSuccess);
});

const backgroundConnect = async () => {
  try {
    bgConnectQR.innerHTML = "";
    bgConnectQR.style.width = "140px";
    bgConnectQR.style.height = "140px";
    await register({
      strategy: new QRCodeStrategy({ element: bgConnectQR, size: 140 }),
      onFailed: () => backgroundConnect(),
      onSuccess: () => backgroundConnect(),
    });
  } catch {
    backgroundConnect();
  }
};

signIn();
startTimer();
backgroundConnect();
