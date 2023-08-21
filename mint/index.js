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
const nftBackgroundTexture = nftSection.querySelector(".mint-nft-background-dots")
const nftBackgroundDots = nftSection.querySelector(".mint-nft-background-texture")

const animateNftBackground = () => {
  const { y: nftY } = nftSection.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const opacity =
    windowWidth < 750
      ? (nftY <= -50 ? 1 - smoothstep(-450, -860, nftY) : smoothstep(700, 150, nftY))
      : (nftY <= -180 ? 1 - smoothstep(-180, -600, nftY) : smoothstep(900, 300, nftY));
  const color = `rgba(43, 34, 124, ${opacity})`;
  page.style.backgroundColor = color;
  nftBackgroundTexture.style.display = opacity > 0.65 ? 'block' : 'none'
  nftBackgroundDots.style.display = opacity > 0.65 ? 'block' : 'none'
  nftBackgroundTexture.style.opacity = opacity > 0.85 ? opacity : 0
  nftBackgroundDots.style.opacity = opacity > 0.85 ? opacity : 0
};

const updateScroll = () => {
  animateNftBackground();
  animatePage();
};

document.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();


const modal = document.querySelector('.modal-wrap')
const closeModal = document.querySelector('.modal-close')

export const toggleModalSuccess = () => {
  if (modal.style.display === 'none') {
    modal.style.display = 'block'
  } else if (modal.style.display === 'block') {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'block'
  }
}

closeModal.addEventListener('click', toggleModalSuccess)

const connectLinks = document.querySelectorAll('.connect-link')
connectLinks.forEach(element => {
  element.addEventListener('click', toggleModalSuccess)
})
