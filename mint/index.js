import { HereWallet } from "@here-wallet/core";
import { QRCodeStrategy } from "@here-wallet/core/build/qrcode-strategy";
import { base_encode } from "near-api-js/lib/utils/serialize";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import { HeaderComponent } from "../landing/scripts/HeaderComponent";

const endpoint = "https://api.herewallet.app/api/v1";

const headerInstance = new HeaderComponent();
const page = document.getElementsByClassName("page")[0];
const bgConnectQR = document.querySelector(".background-connect-qrcode");

const nftSection = document.querySelector(".mint-nft");
const nftBackgroundTexture = nftSection.querySelector(".mint-nft-background-dots");
const nftBackgroundDots = nftSection.querySelector(".mint-nft-background-texture");

const claimButtons = document.querySelectorAll(".claim-link");
const unpackButtons = document.querySelectorAll(".unpack-link");
const connectItems = document.querySelectorAll(".connect-item.close");
const unpackItems = document.querySelectorAll(".connect-item.open");

const anchorRewards = document.getElementById("anchor-rewards");
const anchorTimeline = document.getElementById("anchor-timeline");

const modal = document.querySelector(".modal-wrap");
const modalQR = document.querySelector(".modal-qr-wrap");
const closeModal = document.querySelector(".modal-close");
const connectButton = document.querySelector(".connect-button");
const mintConnectButton = document.querySelector(".mint-button-connect");
const connectLinks = document.querySelectorAll(".connect-link, .mint-button-connect, .connect-button");

const timerMintEls = document.querySelectorAll(".time-to-mint");
const totalMintedEls = document.querySelectorAll(".total-minted");
const totalAvailableEls = document.querySelectorAll(".total-available");

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

const formatTime = (diff) => {
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor(diff / 60) % 60;
  const ss = diff % 60;
  return (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
};

let starboxData;
const fetchStarboxData = async () => {
  try {
    const auth = JSON.parse(localStorage.getItem("account"));
    if (!auth?.account_id) throw Error();
    const res = await fetch(`${endpoint}/user/starbox?account_id=${auth?.account_id}`);
    const data = await res.json();
    starboxData = data;
  } catch {
    const res = await fetch(`${endpoint}/user/starbox`);
    const data = await res.json();
    starboxData = data;
  }

  if (starboxData.nft1 === 0) starboxData.nft1 = 1;
  starboxData.time = Date.now();

  renderPage();
  renderUnpack(0);
  renderUnpack(1);
  renderUnpack(2);
};

const timeDiff = (secs, past) => {
  const deadline = new Date(past + secs * 1000);
  return Math.round((deadline - Date.now()) / 1000);
};

const renderPage = () => {
  const data = starboxData;

  if (data) {
    totalMintedEls.forEach((el) => (el.textContent = data.total_minted));
    totalAvailableEls.forEach((el) => (el.textContent = 10000 - data.total_minted));
    data.start_mint_in = timeDiff(data.start_mint_in, data.time);
    data.start_burn_in = timeDiff(data.start_burn_in, data.time);
    data.finish_burn_in = timeDiff(data.finish_burn_in, data.time);
    data.time = Date.now();
  }

  const tickTimers = () => {
    if (!data) return;
    const startMint = new Date(Date.now() + data.start_mint_in * 1000);
    const startBurn = new Date(Date.now() + data.start_burn_in * 1000);
    const deadline = new Date(Date.now() + data.finish_burn_in * 1000);
    timerMintEls.forEach((elementNode) => {
      elementNode.style.width = "350px";
      elementNode.style.color = "#2C3034";
      elementNode.innerHTML =
        Date.now() > deadline
          ? "Game over"
          : formatTime(
              Date.now() > +startBurn
                ? data.finish_burn_in
                : Date.now() > +startMint
                ? data.start_burn_in
                : data.start_mint_in
            );

      elementNode.previousElementSibling.innerHTML =
        Date.now() > +startBurn ? "Time to end unpack" : Date.now() > +startMint ? "Time to unpack" : "Time to mint";
    });
  };

  const renderBox = (i, nft) => {
    requireTimeEls[i].style.display = "none";
    requireActivityEls[i].style.display = "none";
    claimButtons[i].style.display = "none";
    unpackButtons[i].style.display = "none";
    connectItems[i].classList.remove("can-claim", "claimed");
    connectItems[i].style.opacity = 1;

    if (data == null || !localStorage.getItem("account")) return;

    if (data.start_burn_in > 0 && data[nft] === 0) {
      // Условия не выполнены, но этап минта еще не закончился.
      requireActivityEls[i].style.display = "flex";
      return;
    }

    // Условия выполнены, но этап минта еще не начался
    if (data.start_mint_in > 0 && data[nft] === 1) {
      requireTimeEls[i].style.display = "flex";
      requireTimeEls[i].querySelector(".mint-required-title").innerHTML = `Mint will be available at`;
      requireTimeEls[i].querySelector(".mint-required-info").innerHTML = formatTime(data.start_mint_in);
      return;
    }

    // Условия выполнены и начался этап минта, даем возможность сделать минт
    if (data.start_burn_in > 0 && data[nft] === 1 && data.total_minted < 10000) {
      claimButtons[i].style.display = "flex";
      connectItems[i].classList.add("can-claim");
      return;
    }

    // Прошел минт, но этап распаковки не начался
    if (data.start_burn_in > 0 && data[nft] > 1) {
      requireTimeEls[i].style.display = "flex";
      connectItems[i].classList.add("claimed");
      requireTimeEls[i].querySelector(".mint-required-title").innerHTML = `Unpack will be available at`;
      requireTimeEls[i].querySelector(".mint-required-info").innerHTML = formatTime(data.start_burn_in);
      return;
    }

    // Прошел минт ии начался этап распаковки
    if (data.finish_burn_in > 0 && data[nft] > 1) {
      connectItems[i].classList.add("claimed");
      unpackButtons[i].style.display = "flex";
      return;
    }

    // Просроченный бокс, ничего нельзя сделать
    connectItems[i].style.opacity = 0.5;
  };

  renderBox(0, "nft1");
  renderBox(1, "nft2");
  renderBox(2, "nft3");
  tickTimers();
};

const signIn = () => {
  const auth = JSON.parse(localStorage.getItem("account"));
  if (!auth) return;

  const id = auth.account_id;
  connectLinks.forEach((el) => (el.style.display = "none"));
  connectButton.innerHTML = id.length < 30 ? id : id.slice(0, 6) + ".." + id.slice(-6);
  connectButton.style.display = "flex";
  mintConnectButton.innerHTML = id.length < 30 ? id : id.slice(0, 10) + ".." + id.slice(-10);
  mintConnectButton.classList.add("connected");
};

let isUnpacking = false;
const unpack = async (id) => {
  if (isUnpacking) return;
  isUnpacking = true;
  const toast = Toastify({
    text: "Unpaking, please wait...",
    duration: 1000000000,
    position: "center",
    className: "here-toast",
  });

  try {
    toast.showToast();
    const tokenId = starboxData.tokens[id];

    if (starboxData.nft_images[id].includes("/SB")) {
      await here.signAndSendTransaction({
        receiverId: "starbox.herewallet.near",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "unpack",
              gas: String(50 * Math.pow(10, 12)),
              args: { token_id: String(tokenId) },
              deposit: "1",
            },
          },
        ],
      });
    }

    const res = await fetch(`${endpoint}/user/starbox/unpack_web`, {
      body: JSON.stringify({ ...JSON.parse(localStorage.getItem("account")), token_id: tokenId }),
      method: "POST",
    });

    if (!res.ok) {
      const { detail } = await response.json();
      toast.hideToast();
      Toastify({ text: detail, position: "center", className: "here-toast" }).showToast();
      isUnpacking = false;
      return;
    }

    const prize = await res.json();
    toast.hideToast();
    isUnpacking = false;
    starboxData.prizes[id] = prize;
    renderUnpack(id);
  } catch (e) {
    console.log(e);
    isUnpacking = false;
    toast.hideToast();
  }
};

const renderUnpack = (id) => {
  const prize = starboxData.prizes?.[id];
  if (prize == null) return;

  const prizeEl = unpackItems[id].querySelector(".nft-prize");
  connectItems[id].style.display = "none";
  unpackItems[id].style.display = "flex";
  if (prize.prize_score) {
    prizeEl.innerHTML = `<p class="score-prize">+${prize.prize_score}<br/><span>SCORE</span>`;
    return;
  }

  if (prize.prize_usdt) {
    prizeEl.innerHTML = `<p class="title">${
      prize.prize_usdt
    }</p><img src="${require("../assets/mint/nft-usdt.png")}" width=84 height=84 class="usdt-1" />`;
    return;
  }

  if (prize.prize_nft && prize.prize_nft != "0") {
    prizeEl.innerHTML = `<img src="${prize.prize_nft}" width=84 height=84 class="here-nft" />`;
    return;
  }

  prizeEl.innerHTML = `<p class="title">Empty</p>`;
};

let isClaiming = false;
const mint = async (id) => {
  if (isClaiming) return;
  isClaiming = true;

  const toast = Toastify({
    text: "Claiming, please wait...",
    duration: 1000000000,
    position: "center",
    className: "here-toast",
  });

  try {
    toast.showToast();

    const response = await fetch(`${endpoint}/user/mint_starbox?number=${id}`, {
      body: localStorage.getItem("account"),
      method: "POST",
    });

    if (!response.ok) {
      toast.hideToast();
      isClaiming = false;
      const { detail } = await response.json();
      Toastify({ text: detail, position: "center", className: "here-toast" }).showToast();
      return;
    }

    const { token_id, proof } = await response.json();
    toast.hideToast();

    await here.signAndSendTransaction({
      receiverId: "starbox.herewallet.near",
      actions: [
        {
          type: "FunctionCall",
          params: {
            args: { token_id, proof },
            gas: String(100 * Math.pow(10, 12)),
            methodName: "nft_mint",
            deposit: "1",
          },
        },
      ],
    });

    isClaiming = false;
    await fetchStarboxData();
  } catch {
    Toastify({
      text: "High load, please try again later",
      position: "center",
      className: "here-toast",
    }).showToast();
    isClaiming = false;
    toast.hideToast();
  }
};

const register = async (options) => {
  try {
    let nonceArray = new Uint8Array(32);
    const nonce = [...crypto.getRandomValues(nonceArray)];
    const result = await here.signMessage({
      nonce,
      message: "starbox",
      receiver: "HERE Wallet",
      ...options,
    });

    const auth = JSON.stringify({
      account_id: result.accountId,
      signature: base_encode(Buffer.from(result.signature)),
      public_key: result.publicKey.toString(),
      nonce,
    });

    const response = await fetch(`${endpoint}/user/alarm_starbox`, {
      method: "POST",
      body: auth,
    });

    if (!response.ok) throw Error();
    localStorage.setItem("account", auth);
    fetchStarboxData();
    signIn();

    Toastify({ text: "Authorization success!", position: "center", className: "here-toast" }).showToast();
  } catch {
    Toastify({ text: "Authorization failed", position: "center", className: "here-toast" }).showToast();
  }
};

let isRequested = false;
export const toggleModalSuccess = async () => {
  if (isRequested) return;
  isRequested = true;

  modalQR.style.display = "flex";
  if (modal.style.display === "flex") {
    modal.style.display = "none";
    modalQR.innerHTML = "";
    isRequested = false;
    return;
  }

  if (!localStorage.getItem("account")) {
    await register({
      strategy: new QRCodeStrategy({ element: modalQR, size: 200 }),
      onSuccess: () => (modalQR.style.display = "none"),
      onRequested: (id) => {
        const btn = document.querySelector(".modal-mobile-button-connect");
        btn.href = "https://my.herewallet.app/request/" + id;
        modal.style.display = "flex";
        isRequested = false;
      },
    });

    modal.style.display = "none";
    return;
  }

  localStorage.removeItem("account");
  connectButton.innerHTML = "Connect wallet";
  mintConnectButton.innerHTML = "Connect wallet";
  mintConnectButton.classList.remove("connected");
  connectLinks.forEach((el) => (el.style.display = "flex"));
  unpackItems.forEach((el) => (el.style.display = "none"));
  connectItems.forEach((el) => (el.style.display = "flex"));

  modal.style.display = "none";
  modalQR.style.display = "flex";
  isRequested = false;
  renderPage();
};

const backgroundConnect = async () => {
  try {
    bgConnectQR.innerHTML = "";
    bgConnectQR.style.width = "140px";
    bgConnectQR.style.height = "140px";
    await register({ strategy: new QRCodeStrategy({ element: bgConnectQR, size: 140 }) });
    backgroundConnect();
  } catch (e) {
    console.log(e);
    backgroundConnect();
  }
};

anchorRewards.addEventListener("click", () => {
  document.querySelector(".mint-nft").scrollIntoView({ behavior: "smooth" });
});

anchorTimeline.addEventListener("click", () => {
  document.querySelector(".mint-timeline").scrollIntoView({ behavior: "smooth" });
});

closeModal.addEventListener("click", toggleModalSuccess);
modal.addEventListener("click", (e) => e.target === modal && toggleModalSuccess());
connectLinks.forEach((element) => element.addEventListener("click", toggleModalSuccess));
claimButtons.forEach((element, i) => element.addEventListener("click", () => mint(i + 1)));
unpackButtons.forEach((element, i) => element.addEventListener("click", () => unpack(i)));

document.addEventListener("scroll", animateNftBackground, { passive: true });
animateNftBackground();

signIn();
fetchStarboxData();
renderPage();

// setInterval(fetchStarboxData, 10000);
setInterval(renderPage, 1000);
