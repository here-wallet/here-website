import { HereWallet } from "@here-wallet/core";
import { base_encode } from "near-api-js/lib/utils/serialize";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const here = new HereWallet();
const CONTRACT = "pager.herewallet.near";

const connectBtn = document.querySelector(".btn-connect-wallet");

const register = async () => {
  try {
    let nonceArray = new Uint8Array(32);
    const nonce = [...crypto.getRandomValues(nonceArray)];
    const result = await here.signMessage({
      receiver: "HERE Wallet",
      message: "starbox",
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

const getSignatureForClaim = async (level, auth) => {
  const res = await fetch(`https://dev.herewallet.app/api/v1/user/pager/claim`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level, ...auth }),
    method: "POST",
  });

  const data = await res.json();
  if (res.ok) return { success: data };
  return { error: data };
};

const fetchSupply = async () => {
  const account = await here.account();
  const totalSupply = await account.viewFunction(CONTRACT, "get_total_supply");
  document.querySelector(".screen-stock_title").innerHTML = 15000 - totalSupply + " pagers in stock";
};

const fetchUser = async () => {
  connectBtn.innerHTML = "Connect wallet";
  fetchSupply();

  const screens = document.querySelectorAll(".screen-your");
  [...screens].forEach((el) => el.classList.remove("user"));

  const auth = JSON.parse(localStorage.getItem("account"));
  const account = await here.account(auth.account_id);
  connectBtn.innerHTML = account.accountId.slice(0, 8) + ".." + account.accountId.slice(-8);

  const nfts = await account.viewFunction(CONTRACT, "nft_tokens_for_owner", { account_id: account.accountId });

  let index = 0;
  const pager = nfts[0]?.metadata.extra ?? "";
  if (pager.startsWith("BASIC")) index = 1;
  if (pager.startsWith("PRO")) index = 2;
  if (pager.startsWith("ULTRA")) index = 3;

  const signature = await getSignatureForClaim(index, auth).catch(() => null);
  if (screens[index] == null) return;
  screens[index].classList.add("user");

  const image = screens[index].querySelector(".screen-your__img");
  if (index > 1 && image) image.src = nfts[0]?.metadata.media;

  const errorText = screens[index].querySelector(".screen-your__error");
  if (errorText) errorText.innerHTML = signature.error?.detail ?? "";

  const button = screens[index].querySelector(".screen-your__send button");
  if (button == null) return;

  button.disabled = !signature.success;
  button.addEventListener("click", async () => {
    if (index === 0) {
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

  // Auto slide (optional)
  function autoSlide() {
    const newIndex = currentSlide + 1;
    goToSlide(newIndex);
  }

  // Initial setup
  leftSlides[currentSlide].classList.add("active");
  rightSlides[currentSlide].classList.add("active");
});
