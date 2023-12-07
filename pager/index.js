import "toastify-js/src/toastify.css";

import { HereWallet } from "@here-wallet/core";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores/in_memory_key_store";
import { base_encode } from "near-api-js/lib/utils/serialize";
import Toastify from "toastify-js";
import { Near } from "near-api-js";
import uuid4 from "uuid4";

const here = new HereWallet();
const CONTRACT = "pager.herewallet.near";
const near = new Near({
  nodeUrl: "https://rpc.mainnet.near.org",
  networkId: "mainnet",
  keyStore: new InMemoryKeyStore(),
});

const sessionId = window.localStorage.getItem("session-id") ?? uuid4();
window.localStorage.setItem("session-id", sessionId);

const connectBtn = document.querySelector(".btn-connect-wallet");

const register = async () => {
  try {
    let nonceArray = new Uint8Array(32);
    const nonce = [...crypto.getRandomValues(nonceArray)];
    const result = await here.signMessage({
      receiver: "HERE Wallet",
      message: "pager",
      nonce,
    });

    const auth = JSON.stringify({
      account_id: result.accountId,
      signature: base_encode(Buffer.from(result.signature)),
      public_key: result.publicKey.toString(),
      nonce,
    });

    localStorage.setItem("account", auth);
    fetchUser();
  } catch {
    Toastify({ text: "Authorization failed", position: "center", className: "here-toast" }).showToast();
  }
};

const upgrade = async (args) => {
  await here.signAndSendTransaction({
    receiverId: CONTRACT,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "upgrade",
          gas: 100 * Math.pow(10, 12),
          deposit: "1",
          args: args,
        },
      },
    ],
  });
};

const claim = async (args) => {
  await here.signAndSendTransaction({
    receiverId: CONTRACT,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "nft_mint",
          gas: 100 * Math.pow(10, 12),
          deposit: "1",
          args: args,
        },
      },
    ],
  });
};

const getClaimStatus = async (id) => {
  const res = await fetch(`https://api.herewallet.app/api/v1/user/pager/status?account_id=${id}`, {
    headers: { "Content-Type": "application/json", "session-id": sessionId },
  });
  return await res.json();
};

const getSignatureForClaim = async (level, auth) => {
  const res = await fetch(`https://api.herewallet.app/api/v1/user/pager/claim`, {
    headers: { "Content-Type": "application/json", "session-id": sessionId },
    body: JSON.stringify({ level, ...auth }),
    method: "POST",
  });

  const data = await res.json();
  if (res.ok) return { success: data };
  return { error: data };
};

const fetchSupply = async () => {
  const account = await near.account("azbang.near");
  const issued = await account.viewFunction(CONTRACT, "get_total_issued");
  const points = issued["0"] + issued["1"] * 2 + issued["2"] * 3;
  const price = +Math.max(Math.min(5, 4000 / points), 0).toFixed(3);
  const isNotStart = claimStart > Date.now();

  document.querySelector(".price-widget .price").textContent = `$${price}`;

  document.querySelector("#item-basic .price").textContent = `≈ ${price} USDT`;
  document.querySelector("#item-basic .count").textContent = `${isNotStart ? 0 : issued["0"]}/10000`;

  document.querySelector("#item-pro .price").textContent = `≈ ${+(price * 3).toFixed(3)} USDT`;
  document.querySelector("#item-pro .count").textContent = isNotStart ? 0 : issued["1"];

  document.querySelector("#item-ultra .price").textContent = `≈ ${+(price * 6).toFixed(3)} USDT`;
  document.querySelector("#item-ultra .count").textContent = isNotStart ? 0 : issued["2"];

  const item = document.querySelector(".screen-your.user");
  const priceText = item.querySelector(".price");
  if (priceText) priceText.innerHTML = `(${price * +(item.dataset.weight || 1)} USDT)`;

  const totalSupply = await account.viewFunction(CONTRACT, "get_total_supply");
  document.querySelector(".screen-stock_title").innerHTML =
    (isNotStart ? 10000 : 10000 - totalSupply) + " pagers in stock";

  const balance = await account.viewFunction(CONTRACT, "get_bank_balance");
  document.querySelector(".price-widget .bank").textContent = `$${+(balance / 1000000).toFixed(2)}`;
};

function timeToGo(claimStart) {
  function z(n) {
    return (n < 10 ? "0" : "") + n;
  }

  var diff = claimStart - Date.now();
  var sign = diff < 0 ? "-" : "";
  diff = Math.abs(diff);
  var hours = (diff / 3.6e6) | 0;
  var mins = ((diff % 3.6e6) / 6e4) | 0;
  var secs = Math.round((diff % 6e4) / 1e3);
  return sign + z(hours) + ":" + z(mins) + ":" + z(secs);
}

let claimStart = 1701911561263;
let sellStart = 1701911561263;
const updateTimer = () => {
  const screens = document.querySelectorAll(".screen-your");
  const btn = screens[1].querySelector(".screen-your__btn");
  if (claimStart > Date.now()) {
    btn.innerHTML = `${timeToGo(claimStart)} <br/> left until claim`;
    btn.disabled = true;
  } else {
    btn.innerHTML = `Claim`;
    btn.disabled = false;
  }

  [...document.querySelectorAll(".screen-your__btn_transp")].forEach((btn) => {
    if (sellStart > Date.now()) {
      btn.innerHTML = `${timeToGo(sellStart)} <br/> left until sale`;
      btn.disabled = true;
    } else {
      btn.innerHTML = `Sell`;
      btn.disabled = false;
    }
  });
};

updateTimer();
setInterval(() => {
  updateTimer();
}, 1000);

setInterval(() => {
  fetchSupply();
}, 3000);

const fetchUser = async () => {
  connectBtn.innerHTML = "Connect wallet";
  fetchSupply();

  const connectTwitter = [...document.querySelectorAll(".connect-social.twitter")];
  const connectTelegram = [...document.querySelectorAll(".connect-social.telegram")];
  connectTwitter.forEach((e) => (e.style.pointerEvents = "none"));
  connectTwitter.forEach((e) => e.classList.remove("connected"));

  connectTelegram.forEach((e) => (e.style.pointerEvents = "none"));
  connectTelegram.forEach((e) => e.classList.remove("connected"));

  const screens = document.querySelectorAll(".screen-your");
  [...screens].forEach((el) => el.classList.remove("user"));
  screens[0].classList.add("user");
  screens[0].dataset.weight = "1";

  const auth = JSON.parse(localStorage.getItem("account"));
  const account = await here.account(auth.account_id);
  connectBtn.innerHTML =
    account.accountId.length > 16
      ? account.accountId.slice(0, 8) + ".." + account.accountId.slice(-8)
      : account.accountId;

  const status = await getClaimStatus(auth.account_id);
  claimStart = Date.now() + status.claim_in * 1000;
  sellStart = Date.now() + status.sell_in * 1000;

  const twitterLink = `https://api.herewallet.app/api/v1/web/auth/twitter?user_id=${auth.account_id}`;
  connectTwitter.forEach((e) => e.classList.toggle("connected", status.twitter));
  connectTwitter.forEach((e) => e.setAttribute("href", twitterLink));
  connectTwitter.forEach((e) => (e.style.pointerEvents = ""));

  connectTelegram.forEach((e) => e.classList.toggle("connected", status.telegram));
  connectTelegram.forEach((e) => e.setAttribute("href", "https://t.me/hereawalletbot"));
  connectTelegram.forEach((e) => (e.style.pointerEvents = ""));

  const nfts = await account.viewFunction(CONTRACT, "nft_tokens_for_owner", { account_id: account.accountId });
  const pager = nfts[0]?.metadata.extra ?? "";

  let index = 1;
  if (pager.startsWith("BASIC")) index = 2;
  if (pager.startsWith("PRO")) index = 3;
  if (pager.startsWith("ULTRA")) index = 4;

  let weight = 1;
  if (pager.startsWith("PRO")) weight = 3;
  if (pager.startsWith("ULTRA")) weight = 6;
  if (pager === "PRO7" || pager === "ULTRA13") weight += 1;

  [...screens].forEach((el) => el.classList.remove("user"));
  screens[index].classList.add("user");
  screens[index].dataset.weight = weight;

  const image = screens[index].querySelector(".screen-your__img");
  if (index > 1 && image) image.src = nfts[0]?.metadata.media;

  const button = screens[index].querySelector(".screen-your__send button");
  if (button == null) return;

  let isEnabled = false;
  if (index === 1) isEnabled = (status.telegram === 2 || status.twitter === 2) && claimStart <= Date.now();
  if (index === 2) isEnabled = status.linkdrop === 2;
  if (index === 3) isEnabled = status.phone_transfer === 2;

  button.disabled = !isEnabled;
  button.addEventListener("click", async () => {
    if (index === 0) return;

    const signature = await getSignatureForClaim(index - 1, auth).catch(() => null);
    if (screens[index] == null) return;

    const errorText = screens[index].querySelector(".screen-your__error");
    if (errorText) errorText.innerHTML = signature.error?.detail ?? "";
    if (signature.error?.detail != null) return;

    if (index === 1) {
      await claim(signature.success);
      await fetchUser();
      return;
    }

    await upgrade({ token_id: nfts[0].token_id, ...signature.success });
    await fetchUser();
  });
};

fetchUser();

connectBtn.addEventListener("click", async () => {
  if (localStorage.getItem("account")) return;
  register();
});

document.querySelector(".connect-wallet-from-item")?.addEventListener("click", () => {
  register();
});

const asks = Array.from(document.querySelectorAll(".section-faq__item"));
asks.forEach((el) => {
  el.addEventListener("click", () => {
    const header = el.querySelector(".section-faq__ask");
    const body = el.querySelector(".section-faq__answer");
    const headerBox = header.getBoundingClientRect();

    asks.forEach((ask) => {
      if (ask == el) return;
      const header = ask.querySelector(".section-faq__ask");
      const box = header.getBoundingClientRect();
      ask.classList.remove("open");
      ask.style.height = box.height + "px";
    });

    el.style.height = headerBox.height + "px";
    body.style.display = "block";
    setTimeout(() => {
      const { height } = body.getBoundingClientRect();
      el.classList.toggle("open");
      el.style.height = el.classList.contains("open") ? `${headerBox.height + height}px` : headerBox.height + "px";
    }, 10);
  });
});

// Слайдер номер 1
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".screen-stock__slider");
  const leftSlides = slider.querySelectorAll(".slider-item__left");
  const rightSlides = slider.querySelectorAll(".slider-item__right");
  const prevButton = slider.querySelector(".slider-pagination__prev");
  const nextButton = slider.querySelector(".slider-pagination__next");

  let currentSlide = 0;

  function goToSlide(index) {
    leftSlides[currentSlide].classList.remove("active");
    rightSlides[currentSlide].classList.remove("active");

    if (index < 0) {
      index = leftSlides.length - 1;
    } else if (index >= leftSlides.length) {
      index = 0;
    }

    leftSlides[index].classList.add("active");
    rightSlides[index].classList.add("active");

    currentSlide = index;
  }

  prevButton.addEventListener("click", function () {
    const newIndex = currentSlide - 1;
    goToSlide(newIndex);
  });

  nextButton.addEventListener("click", function () {
    const newIndex = currentSlide + 1;
    goToSlide(newIndex);
  });

  // Initial setup
  leftSlides[currentSlide].classList.add("active");
  rightSlides[currentSlide].classList.add("active");
});

document.addEventListener("DOMContentLoaded", function () {
  var tooltipContainer = document.querySelectorAll(".tooltip-container");
  var tooltipTrigger = document.querySelectorAll(".tooltip-trigger");
  [...tooltipTrigger].forEach((item) => {
    item.addEventListener("click", function () {
      tooltipContainer.classList.toggle("clicked");
    });
    item.addEventListener("mouseover", function () {
      tooltipContainer.classList.add("mouseover");
    });

    item.addEventListener("mouseout", function () {
      tooltipContainer.classList.remove("mouseover");
    });
  });
});
