import "toastify-js/src/toastify.css";

import { HereWallet } from "@here-wallet/core";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores/in_memory_key_store";
import { base_encode } from "near-api-js/lib/utils/serialize"; // @ts-ignore
import Toastify from "toastify-js";
import { Near } from "near-api-js";
import uuid4 from "uuid4";

const here = new HereWallet();
const CONTRACT = "pager.herewallet.near";
const near = new Near({
  headers: {},
  nodeUrl: "https://rpc.mainnet.near.org",
  networkId: "mainnet",
  keyStore: new InMemoryKeyStore(),
});

const sessionId = window.localStorage.getItem("session-id") ?? uuid4();
window.localStorage.setItem("session-id", sessionId);

const userData = {
  claimStart: 1701911561263,
  sellStart: 1701911561263,
  status: null as any,
  nfts: [] as any[],
  auth: null as any,
};

const chooseMission3 = document.querySelector(".change-mission-variant") as HTMLDivElement;
const getMission3Variant = () => localStorage.getItem("mission3Variant") || "1";

const connectBtn = document.querySelector(".btn-connect-wallet")!;

const register = async () => {
  try {
    let nonceArray = new Uint8Array(32);
    const nonce = Array.from(crypto.getRandomValues(nonceArray));
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

const upgrade = async (args: any) => {
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

const claim = async (args: any) => {
  await here.signAndSendTransaction({
    receiverId: CONTRACT,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "nft_mint",
          gas: 100 * Math.pow(10, 12),
          deposit: parseNearAmount("0.05")!,
          args: args,
        },
      },
    ],
  });
};

let isOverhighed = false;
const getClaimStatus = async (id: string) => {
  if (isOverhighed) throw Error();

  const res = await fetch(`https://api.herewallet.app/api/v1/user/pager/status?account_id=${id}`, {
    headers: { "Content-Type": "application/json", "session-id": sessionId },
  });

  if (res.status === 429) {
    isOverhighed = true;
    throw Error();
  }

  return await res.json();
};

const getSignatureForClaim = async (level: number, auth: any) => {
  try {
    const res = await fetch(`https://api.herewallet.app/api/v1/user/pager/claim`, {
      headers: { "Content-Type": "application/json", "session-id": sessionId },
      body: JSON.stringify({ level, ...auth }),
      method: "POST",
    });

    const data = await res.json();
    if (res.ok) return { success: data };
    return { error: data };
  } catch {
    return { error: { details: "Network error" } };
  }
};

const fetchSupply = async () => {
  const account = await near.account("azbang.near");
  const issued = await account.viewFunction(CONTRACT, "get_total_issued");
  const points = issued["0"] + issued["1"] * 4 + issued["2"] * 5;
  const price = +Math.max(Math.min(2, 4000 / points), 0).toFixed(3);
  const isNotStart = userData.claimStart > Date.now();

  document.querySelector(".price-widget .price")!.textContent = `$${price}`;

  document.querySelector("#item-basic .price")!.textContent = `≈ ${price} USDT`;
  document.querySelector("#item-basic .count")!.textContent = `${isNotStart ? 0 : issued["0"]}/10000`;

  document.querySelector("#item-pro .price")!.textContent = `≈ ${+(price * 5).toFixed(3)} USDT`;
  document.querySelector("#item-pro .count")!.textContent = isNotStart ? 0 : issued["1"];

  document.querySelector("#item-ultra .price")!.textContent = `≈ ${+(price * 10).toFixed(3)} USDT`;
  document.querySelector("#item-ultra .count")!.textContent = isNotStart ? 0 : issued["2"];

  const item = document.querySelector(".screen-your.user") as HTMLElement;
  const priceText = item.querySelector(".price")!;
  if (priceText) priceText.innerHTML = `(${price * +(item.dataset.weight || 1)} USDT)`;

  const totalSupply = await account.viewFunction(CONTRACT, "get_total_supply");
  document.querySelector(".screen-stock_title")!.innerHTML =
    (isNotStart ? 10000 : 10000 - totalSupply) + " pagers in stock";

  const balance = await account.viewFunction(CONTRACT, "get_bank_balance");
  document.querySelector(".price-widget .bank")!.textContent = `$${+(balance / 1000000).toFixed(2)}`;
};

function timeToGo(claimStart: number) {
  function z(n: number) {
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

const updateTimer = () => {
  const screens = document.querySelectorAll(".screen-your");
  const btn = screens[1].querySelector(".screen-your__btn") as HTMLButtonElement;
  if (userData.claimStart > Date.now()) {
    btn.innerHTML = `${timeToGo(userData.claimStart)} <br/> left until claim`;
    btn.disabled = true;
  } else {
    btn.innerHTML = `Claim`;
    renderLogic();
  }

  Array.from(document.querySelectorAll(".screen-your__btn_transp")).forEach((btn) => {
    if (!(btn instanceof HTMLButtonElement)) return;
    if (userData.sellStart > Date.now()) {
      btn.innerHTML = `Burn  will be available<br/>${timeToGo(userData.sellStart)}`;
      btn.disabled = true;
    } else {
      btn.innerHTML = `Sell`;
      btn.disabled = false;
    }
  });
};

const fetchUser = async () => {
  connectBtn.innerHTML = "Connect wallet";
  fetchSupply();

  const auth = JSON.parse(localStorage.getItem("account")!);
  if (!auth) {
    userData.nfts = [];
    userData.status = null;
    renderLogic();
    return null;
  }

  const account = await here.account(auth.account_id);
  connectBtn.innerHTML =
    account.accountId.length > 16
      ? account.accountId.slice(0, 8) + ".." + account.accountId.slice(-8)
      : account.accountId;

  const status = await getClaimStatus(auth.account_id);
  const nfts = await account.viewFunction(CONTRACT, "nft_tokens_for_owner", { account_id: account.accountId });

  userData.nfts = nfts;
  userData.status = status;
  userData.claimStart = Date.now() + status.claim_in * 1000;
  userData.sellStart = Date.now() + status.sell_in * 1000;
  userData.auth = auth;
  renderLogic();
};

const renderLogic = () => {
  const connectTwitter = Array.from(document.querySelectorAll(".connect-social.twitter")) as HTMLElement[];
  const connectTelegram = Array.from(document.querySelectorAll(".connect-social.telegram")) as HTMLElement[];
  connectTwitter.forEach((e) => (e.style.pointerEvents = "none"));
  connectTwitter.forEach((e) => e.classList.remove("connected"));

  connectTelegram.forEach((e) => (e.style.pointerEvents = "none"));
  connectTelegram.forEach((e) => e.classList.remove("connected"));

  const screens = Array.from(document.querySelectorAll(".screen-your")) as HTMLElement[];
  screens.forEach((el) => el.classList.remove("user"));
  screens[0].classList.add("user");
  screens[0].dataset.weight = "1";


  if (userData.status == null) return;
  const { status, auth } = userData;

  const twitterLink = `https://api.herewallet.app/api/v1/web/auth/twitter?user_id=${auth.account_id}`;
  connectTwitter.forEach((e) => (e.style.pointerEvents = ""));
  if (status.twitter === 1) {
      connectTwitter.forEach((e) => e.textContent = "Twitter linked (click to follow us)");
      connectTwitter.forEach((e) => e.setAttribute("href", "https://twitter.com/here_wallet"));
  }
  else {
    connectTwitter.forEach((e) => e.classList.toggle("connected", status.twitter === 2));
    connectTwitter.forEach((e) => e.setAttribute("href", twitterLink));
  }

  connectTelegram.forEach((e) => e.classList.toggle("connected", status.telegram == 2));
  connectTelegram.forEach((e) => e.setAttribute("href", "https://t.me/herewalletbot"));
  connectTelegram.forEach((e) => (e.style.pointerEvents = ""));
  if (status.telegram === 1) {
    connectTelegram.forEach((e) => e.textContent = "Telegram linked (click to follow us)");
    connectTelegram.forEach((e) => e.setAttribute("href", "https://t.me/herewallet"));
}

  const pager = userData.nfts[0]?.metadata.extra ?? "";

  let index = 1;
  if (pager.startsWith("BASIC")) index = 2;
  if (pager.startsWith("PRO")) index = 3;
  if (pager.startsWith("ULTRA")) index = 4;

  let weight = 1;
  if (pager.startsWith("PRO")) weight = 5;
  if (pager.startsWith("ULTRA")) weight = 10;

  screens.forEach((el) => el.classList.remove("user"));
  screens[index].classList.add("user");
  screens[index].dataset.weight = weight.toString();

  const weeklyScoreAmount = document.querySelector(".weekly-score-amount");
  if (weeklyScoreAmount) weeklyScoreAmount.textContent = ` ${status.weekly_score}/500`;

  const image = screens[index].querySelector(".screen-your__img") as HTMLImageElement;
  if (index > 1 && image) image.src = userData.nfts[0]?.metadata.media;

  const button = screens[index].querySelector(".screen-your__send button") as HTMLButtonElement;
  if (button == null) return;

  let isEnabled = false;
  if (index === 1) isEnabled = (status.telegram === 2 || status.twitter === 2) && userData.claimStart <= Date.now();
  if (index === 2) isEnabled = status.linkdrop === 2;
  if (index === 3) {
    if (getMission3Variant() === "1") isEnabled = status.phone_transfer === 2;
    if (getMission3Variant() === "2") isEnabled = status.weekly_score >= 500;
  }

  button.disabled = !isEnabled;
  button.onclick = async () => {
    if (index === 0) return;

    const signature = await getSignatureForClaim(index - 1, auth);
    if (screens[index] == null) return;

    const errorText = screens[index].querySelector(".screen-your__error");
    if (errorText) errorText.innerHTML = signature.error?.detail ?? "";
    if (signature.error?.detail != null) return;

    if (index === 1) {
      await claim(signature.success);
      await fetchUser();
      return;
    }

    await upgrade({ token_id: userData.nfts[0].token_id, ...signature.success });
    await fetchUser();
  };
};

renderLogic();
fetchUser();

updateTimer();
setInterval(() => {
  updateTimer();
}, 1000);

setInterval(() => {
  fetchSupply();
}, 3000);

setInterval(() => {
  fetchUser();
}, 30000);

const chanageMissionVariant = () => {
  if (getMission3Variant() === "1") {
    chooseMission3.querySelector("p")!.textContent = "I can’t use phone number transfer";
    (document.querySelector(".mission3-variant1") as HTMLDivElement).style.display = "";
    (document.querySelector(".mission3-variant2") as HTMLDivElement).style.display = "none";
  }

  if (getMission3Variant() === "2") {
    chooseMission3.querySelector("p")!.textContent = "I want use phone number transfer";
    (document.querySelector(".mission3-variant1") as HTMLDivElement).style.display = "none";
    (document.querySelector(".mission3-variant2") as HTMLDivElement).style.display = "";
  }

  renderLogic();
};

chanageMissionVariant();
chooseMission3?.addEventListener("click", () => {
  localStorage.setItem("mission3Variant", getMission3Variant() === "1" ? "2" : "1");
  chanageMissionVariant();
});

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
    if (!(el instanceof HTMLElement)) return;
    const header = el.querySelector(".section-faq__ask") as HTMLElement;
    const body = el.querySelector(".section-faq__answer") as HTMLElement;
    const headerBox = header.getBoundingClientRect();

    asks.forEach((ask) => {
      if (ask == el || !(ask instanceof HTMLElement)) return;
      const header = ask.querySelector(".section-faq__ask") as HTMLElement;
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
  const slider = document.querySelector(".screen-stock__slider") as HTMLElement;
  const leftSlides = Array.from(slider.querySelectorAll(".slider-item__left")) as HTMLElement[];
  const rightSlides = Array.from(slider.querySelectorAll(".slider-item__right")) as HTMLElement[];
  const prevButton = slider.querySelector(".slider-pagination__prev") as HTMLElement;
  const nextButton = slider.querySelector(".slider-pagination__next") as HTMLElement;

  let currentSlide = 0;

  function goToSlide(index: number) {
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
  var tooltipTrigger = Array.from(document.querySelectorAll(".tooltip-trigger")) as HTMLElement[];
  tooltipTrigger.forEach((item) => {
    item.addEventListener("click", function () {
      item.parentElement?.classList.toggle("clicked");
    });
    item.addEventListener("mouseover", function () {
      item.parentElement?.classList.add("mouseover");
    });

    item.addEventListener("mouseout", function () {
      item.parentElement?.classList.remove("mouseover");
    });
  });
});
