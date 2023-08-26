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
const connectItems = document.querySelectorAll(".connect-item");

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

document.addEventListener("scroll", animateNftBackground, { passive: true });
animateNftBackground();

const formatTime = (deadline) => {
  const diff = Math.round((deadline - Date.now()) / 1000);
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor(diff / 60) % 60;
  const ss = diff % 60;
  return (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
};

const startTimer = async (start_mint_in, start_burn_in, deadline_in) => {
  const startMint = new Date(Date.now() + start_mint_in * 1000);
  const startBurn = new Date(Date.now() + start_burn_in * 1000);
  const deadline = new Date(Date.now() + deadline_in * 1000);

  const updateTimer = () => {
    timerMintEls.forEach((elementNode) => {
      elementNode.style.width = "350px";
      elementNode.style.color = "#2C3034";
      elementNode.innerHTML = formatTime(
        Date.now() > +startBurn ? deadline : Date.now() > +startMint ? startBurn : startMint
      );

      elementNode.previousElementSibling.innerHTML =
        Date.now() > +startBurn ? "Time to end burn" : Date.now() > +startMint ? "Time to burn" : "Time to mint";
    });

    requiredTimesEls.forEach((el) => {
      el.innerHTML = formatTime(Date.now() > +startBurn ? deadline : Date.now() > +startMint ? startBurn : startMint);
    });
  };

  setInterval(updateTimer, 1000);
  updateTimer();
};

const signIn = async () => {
  const auth = JSON.parse(localStorage.getItem("account"));
  if (!auth) {
    const res = await fetch(`${endpoint}/user/starbox`);
    const data = await res.json();
    connectLinks.forEach((el) => (el.style.display = "flex"));
    requireActivityEls.forEach((el) => (el.style.display = "none"));
    requireTimeEls.forEach((el) => (el.style.display = "none"));
    claimButtons.forEach((el) => (el.style.display = "none"));
    connectItems.forEach((el) => el.classList.remove("can-claim", "claimed"));
    startTimer(data.start_mint_in, data.start_burn_in, data.finish_burn_in);
    return;
  }

  const id = auth.account_id;
  connectLinks.forEach((el) => (el.style.display = "none"));
  connectButton.innerHTML = id.length < 30 ? id : id.slice(0, 6) + ".." + id.slice(-6);
  connectButton.style.display = "flex";
  mintConnectButton.innerHTML = id.length < 30 ? id : id.slice(0, 10) + ".." + id.slice(-10);
  mintConnectButton.classList.add("connected");

  const res = await fetch(`${endpoint}/user/starbox?account_id=${id}`);
  const data = await res.json();

  totalMintedEls.forEach((el) => (el.textContent = data.total_minted));
  totalAvailableEls.forEach((el) => (el.textContent = 10000 - data.total_minted));

  requireActivityEls[0].style.display = data.nft2 === 0 ? "flex" : "none";
  requireActivityEls[1].style.display = data.nft3 === 0 ? "flex" : "none";
  requireTimeEls[0].style.display = data.start_mint_in > 0 ? "flex" : "none";
  requireTimeEls[1].style.display = data.nft2 === 1 && data.start_mint_in > 0 ? "flex" : "none";
  requireTimeEls[2].style.display = data.nft3 === 1 && data.start_mint_in > 0 ? "flex" : "none";
  claimButtons[0].style.display = data.nft1 === 1 && data.start_mint_in === 0 ? "flex" : "none";
  claimButtons[1].style.display = data.nft2 === 1 && data.start_mint_in === 0 ? "flex" : "none";
  claimButtons[2].style.display = data.nft3 === 1 && data.start_mint_in === 0 ? "flex" : "none";
  connectItems[0].classList.toggle("can-claim", data.nft1 === 1 && data.start_mint_in === 0);
  connectItems[1].classList.toggle("can-claim", data.nft1 === 1 && data.start_mint_in === 0);
  connectItems[2].classList.toggle("can-claim", data.nft1 === 1 && data.start_mint_in === 0);
  connectItems[0].classList.toggle("claimed", data.nft1 === 2);
  connectItems[1].classList.toggle("claimed", data.nft1 === 2);
  connectItems[2].classList.toggle("claimed", data.nft1 === 2);

  const requireBurn = (node, nft) => {
    node.style.display = data[nft] === 2 && (data.start_burn_in > 0 || data.finish_burn_in > 0) ? "flex" : "none";
    if (data.start_burn_in > 0) {
      node.querySelector(".mint-required-title").innerHTML = `Minted. Wait to unpack after`;
    }

    if (data.finish_burn_in > 0) {
      node.querySelector(".mint-required-title").innerHTML = `Burn before the deadline`;
    }
  };

  requireBurn(requireTimeEls[0], "nft1");
  requireBurn(requireTimeEls[1], "nft2");
  requireBurn(requireTimeEls[2], "nft3");
  startTimer(data.start_mint_in, data.start_burn_in, data.finish_burn_in);
};

const mint = async (id) => {
  const response = await fetch(`${endpoint}/user/mint_starbox?number=${id}`, {
    body: localStorage.getItem("account"),
    method: "POST",
  });

  if (!response.ok) {
    const { detail } = await response.json();
    Toastify({ text: detail, position: "center", className: "here-toast" }).showToast();
    return;
  }

  const { token_id, proof } = await response.json();
  await here.signAndSendTransaction({
    receiverId: "starbox.herewallet.near",
    actions: [
      {
        type: "FunctionCall",
        params: {
          args: { token_id, proof },
          gas: String(50 * Math.pow(10, 12)),
          methodName: "nft_mint",
          deposit: "1",
        },
      },
    ],
  });

  await signIn();
  setTimeout(() => signIn(), 3000);
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

    await response.json();
    localStorage.setItem("account", auth);
    await signIn();

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
      onRequested: (id) => {
        isRequested = false;
        modal.style.display = "flex";
        document.querySelector(".modal-mobile-button-connect").href = "https://my.herewallet.app/request/" + id;
      },
      onSuccess: () => {
        modalQR.style.display = "none";
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
  modalQR.style.display = "flex";
  isRequested = false;
};

modal.addEventListener("click", (e) => {
  if (e.target === modal) toggleModalSuccess();
});

closeModal.addEventListener("click", toggleModalSuccess);
connectLinks.forEach((element) => {
  element.addEventListener("click", toggleModalSuccess);
});

claimButtons.forEach((element, i) => {
  element.addEventListener("click", () => mint(i + 1));
});

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

signIn();
backgroundConnect();
