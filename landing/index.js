import { HeaderComponent } from "./scripts/HeaderComponent"
import { WaitlistModal } from './scripts/WaitlistModal'

const waitlistModal = new WaitlistModal()
const headerInstance = new HeaderComponent()
const page = document.getElementsByClassName("page-background")[0];
const news = document.getElementsByClassName("news")[0];

const updateScroll = () => {
  let pad = window.innerWidth < 1600 ? 44 : 88;
  pad = window.innerWidth < 1200 ? 12 : pad;

  let tophold = window.innerWidth < 800 ? 260 : 620;
  let scroll = Math.max(0, window.scrollY - tophold) * 0.005;
  let offset = Math.max(pad * (1 - scroll), 0);
  page.style.left = offset + "px";
  page.style.right = offset + "px";

  const { y: newsY, height: newsHeight } = news.getBoundingClientRect();
  console.log(newsY, newsHeight, 1 - (newsY - 100) / (newsHeight + 100));
  let opacity = 1 - (newsY - 100) / newsHeight;
  opacity = opacity > 1 ? 2 - opacity : opacity;
  news.style.backgroundColor = `rgba(175, 115, 230, ${opacity})`;
};

document.addEventListener("scroll", updateScroll);
updateScroll();

Array.from(document.querySelectorAll(".ask-block")).forEach((el) => {
  el.addEventListener("click", () => {
    const { height } = el
      .querySelector(".ask-block-body")
      .getBoundingClientRect();
    el.classList.toggle("open");
    el.style.height = el.classList.contains("open")
      ? `${91 + height}px`
      : "91px";
  });
});

Array.from(document.querySelectorAll(".waitlist-button")).forEach((el) => {
  el.addEventListener("click", () => {
    if (window.innerWidth <= 778) {
      headerInstance.toggleModal()
    } else {
      waitlistModal.open()
    }
  });
});
