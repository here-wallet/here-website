const actionBtn = document.querySelector('.binance-here__switch');
const actionItems = document.querySelectorAll('.binance-features__item, .binance-features-2__item');
const container = document.querySelector(".binance-features__wrapper");

// Add a click event listener to the button
actionBtn.addEventListener("click", function () {
  actionBtn.classList.toggle("action");
  actionItems.forEach(function (item) {
    item.classList.toggle("action");
  });
});

const handler = (data) => {
  console.log(data);
  if (!data[0]?.isIntersecting) return;
  actionBtn.classList.add("action");
  actionItems.forEach(function (item) {
    item.classList.add("action");
  });
};

let observer = new IntersectionObserver(handler, {
  root: null,
  rootMargin: "0px",
  threshold: 0.25,
});
observer.observe(container);
