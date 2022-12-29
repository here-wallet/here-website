import uuid4 from "uuid4";
import { HeaderComponent } from "../landing/scripts/HeaderComponent";
import { WaitlistModal } from "../landing/scripts/WaitlistModal";
import { HereWallet, SignMessageReturn } from "@here-wallet/core";
import { base_encode } from "near-api-js/lib/utils/serialize";

const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

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

const getSponsor = (sponsor: string) => {
  switch (sponsor) {
    case "here":
      return require("/assets/santa_drop/here.svg");
    case "paras":
      return require("/assets/santa_drop/paras.svg");
    case "tonic":
      return require("/assets/santa_drop/tonic.svg");
    case "apollo":
      return require("/assets/santa_drop/a24.svg");
    default:
      return require("/assets/santa_drop/here.svg");
  }
};

const getGifts = async (token: string) => {
  const url = "https://api.herewallet.app/api/v1/user/dropout_santa";
  const res = await fetch(url, {
    headers: { Authorization: token },
    method: "POST",
  });

  if (res.ok === false) return null;
  return await res.json();
};

const getAccessToken = async (sign: SignMessageReturn) => {
  const res = await fetch(`https://api.herewallet.app/api/v1/user/auth`, {
    method: "POST",
    body: JSON.stringify({
      near_account_id: sign.accountId,
      public_key: sign.publicKey.toString(),
      account_sign: base_encode(sign.signature),
      device_id: sign.nonce,
      msg: sign.message,
    }),
  });

  if (res.ok === false) throw Error();
  const { token } = await res.json();
  return token;
};

const mainScreen = document.querySelector<HTMLDivElement>(".main")!;
const giftsScreen = document.querySelector<HTMLDivElement>(".gifts-screen")!;
const noGiftsScreen = document.querySelector<HTMLDivElement>(".no-gifts")!;
const loadingScreen =
  document.querySelector<HTMLDivElement>(".loading-screen")!;

const showScreen = (screen: HTMLDivElement) => {
  mainScreen.classList.add("none");
  giftsScreen.classList.add("none");
  noGiftsScreen.classList.add("none");
  loadingScreen.classList.add("none");

  screen.style.opacity = "0";
  screen.classList.remove("none");
  setTimeout(() => (screen.style.opacity = "1"), 200);
};

const signOut = () => {
  window.localStorage.removeItem("token");
  showScreen(mainScreen);
};

const renderCards = (data) => {
  const sponsorImage =
    document.querySelector<HTMLImageElement>(".sponsored img")!;
  sponsorImage.src = getSponsor(data.sponsor);

  const nftCard = document.querySelector(".nft-card")!;
  const nftImage = document.querySelector<HTMLImageElement>(".nft")!;
  nftCard.classList.toggle("none", data.nft == null);
  nftImage.src = data.nft;

  const tokenNumber = document.querySelector(".tokens")!;
  const tokenLabel = document.querySelector(".tokens-label")!;
  tokenLabel.innerHTML = data.near != null ? "NEAR" : "USDC";
  tokenNumber.innerHTML = data.near || data.usdc;

  const apyLabel = document.querySelector(".apy")!;
  apyLabel.innerHTML = "+" + data.api;

  const estimatedPrice = document.querySelector(".estimated-price span")!;
  estimatedPrice.innerHTML = "&nbsp;" + data.estimated_prize + "$";
};

const run = async () => {
  const here = new HereWallet();

  const signIn = async (token: string) => {
    window.localStorage.setItem("token", token);
    const data = await getGifts(token);
    if (data == null) {
      showScreen(noGiftsScreen);
      return;
    }

    showScreen(giftsScreen);
    renderCards(data);
  };

  Array.from(document.querySelectorAll(".gift-card")).forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("open"));
  });

  const connectWallet = document.querySelector(".connect-wallet")!;
  connectWallet.addEventListener("click", async () => {
    const sign = await here.signMessage({
      message: "Log in to receive Christmas gifts!",
      receiver: "HERE Santa",
    });

    showScreen(loadingScreen);
    const token = await getAccessToken(sign);
    signIn(token);
  });

  const logoutWallet = document.querySelector(".logout-button")!;
  logoutWallet.addEventListener("click", () => signOut());

  const token = window.localStorage.getItem("token");
  if (token != null) signIn(token);
};

run();
