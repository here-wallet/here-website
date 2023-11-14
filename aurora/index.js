import { HereWallet } from "@here-wallet/core";
import { base_encode } from "near-api-js/lib/utils/serialize";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const here = new HereWallet();
const connectBtn = document.querySelector(".btn-connect-wallet");

const renderMission = (item) => {
  const isDisabled = item.status === 0 ? "disabled" : "";
  const isSuccess = item.status === 2 ? "success" : "";

  return `<a  href="${item.link}" class="cart-rainbow cart-item ${isDisabled} ${isSuccess}">
    <div class="cart-title">${item.title}</div>
    <div class="cart-description">${item.description.replaceAll("\n", "<br />")}</div>
    <div class="cart-transaction">
      <p>${item.score_description}:</p>
      <button>+${item.score}</button>
    </div>
    <img class="logo" src="${item.image_url}" />
  </a>`;
};

const fetchUser = async () => {
  connectBtn.innerHTML = "Connect wallet";

  let url = `https://dev.herewallet.app/partners/aurora/missions`;
  try {
    const auth = JSON.parse(localStorage.getItem("account"));
    const account = await here.account(auth.account_id);
    connectBtn.innerHTML =
      account.accountId.length > 16
        ? account.accountId.slice(0, 8) + ".." + account.accountId.slice(-8)
        : account.accountId;

    url = `https://dev.herewallet.app/partners/aurora/missions?account_id=${auth.account_id}`;
  } catch {}

  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, method: "GET" });
  const data = await res.json();
  console.log({ data });

  const html = data.missions.map(renderMission).join("\n");
  const list = document.querySelector(".cart-section");
  list.innerHTML = html;
};

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

connectBtn.addEventListener("click", async () => {
  localStorage.removeItem("account");
  fetchUser();
  register();
});

fetchUser();

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
