const btn = document.querySelector(".menu-mobile__burger");
const MenuBlock = document.querySelector(".header");

btn.onclick = () => {
	btn.classList.toggle("active");
	MenuBlock.classList.toggle("active");
};