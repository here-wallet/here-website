import { QRCode, lightQR } from "@here-wallet/core/build/qrcode-strategy";

export class HeaderComponent {
	provider = new WaitlistProvider(".header-form");
	header = document.querySelector(".header");
	floatQr = document.querySelector(".float-qr");
	topButton = document.querySelector(".scroll-up");

	isOpen = false;

	constructor() {
		this.headerBody = this.header.querySelector(".header-body");
		this.btn = this.header.querySelector(".header-action");
		this.btn.addEventListener("click", () => this.toggleModalBody());

		this.header.classList.toggle("active", window.scrollY > 40);
		this.floatQr.classList.toggle("active", window.scrollY > 600);
		this.topButton.classList.toggle("active", window.scrollY > 600);

		// WTF? Links not working native on mobile???
		[...this.headerBody.querySelectorAll("a")].forEach((el) =>
			el.addEventListener("pointerdown", (e) => {
				if (e.target instanceof HTMLElement) {
					if (e.target.tagName === "A") {
						window.location.assign(e.target.href);
					}
				}
			})
		);

		this.topButton.addEventListener("click", () => {
			document.body.scrollIntoView({ behavior: "smooth" });
		});

		const value = "https://download.herewallet.app";
		const qr = new QRCode({ ...lightQR, size: 80, value });
		this.floatQr.querySelector(".qrcode").appendChild(qr.canvas);

		window.addEventListener("scroll", () => {
			this.header.classList.toggle("active", window.scrollY > 40);
			this.floatQr.classList.toggle("active", window.scrollY > 600);
			this.topButton.classList.toggle("active", window.scrollY > 600);
		});

		this.provider.onSubmit = () => {
			successModal.open();
		};
	}

	toggleModal = () => {
		this.btn.classList.toggle("open");
		this.headerBody.classList.toggle("open");
		document.body.classList.toggle("body_margin");

		this.isOpen = !this.isOpen;
		document.body.style.overflow = this.isOpen ? "hidden" : "";
	};
	toggleModalBody = () => {
		this.btn.classList.toggle("open");
		this.headerBody.classList.toggle("open");
		document.body.classList.toggle("body_margin");

		this.isOpen = !this.isOpen;
		document.body.style.overflow = this.isOpen ? "hidden" : "";
	};
}

var customViewportCorrectionVariable = "vh";

function setViewportProperty(doc) {
	var prevClientHeight;
	var customVar = "--" + (customViewportCorrectionVariable || "vh");
	function handleResize() {
		var clientHeight = doc.clientHeight;
		if (clientHeight === prevClientHeight) return;
		requestAnimationFrame(function updateViewportHeight() {
			doc.style.setProperty(customVar, clientHeight * 0.01 + "px");
			prevClientHeight = clientHeight;
		});
	}
	handleResize();
	return handleResize;
}
window.addEventListener(
	"resize",
	setViewportProperty(document.documentElement)
);

function maskedUserName(inputValue) {
	const value = inputValue.replace(/[^a-zA-Z0-9_.-]/g, '');
	const isValid = value.length >= 2 && (/^[A-Fa-f0-9]+$/.test(value) || /^[0-9a-z]+.near/.test(value));
	return { value, isValid };
}
// Form Logics
export class WaitlistProvider {
	constructor(selector, onSubmit) {
		this.onSubmit = onSubmit;
		this.root = document.querySelector(selector);
		this.input = this.root.querySelector("input");
		this.button = this.root.querySelector(".here-button");
		this.button.disabled = true;

		this.input.addEventListener("input", (e) => {
			const { value, isValid } = maskedUserName(this.input.value); // modify to use the maskedUserName function
			this.button.disabled = !isValid;
			this.input.value = value;
		});
		this.input.addEventListener("keydown", async (e) => {
			if (e.key === "Enter" && this.input.value.trim() !== "") {
				await this.submit(this.input.value);
			}
		});
		this.button.addEventListener("click", async () => {
			await this.submit(this.input.value);
		});
	}

	async submit(user_name) {
		console.log(JSON.stringify(user_name));
		this.onSubmit();
		this.input.value = "";

		const res = await fetch(
			"https://api.herewallet.app/api/v1/web/android_whitelist",
			{
				method: "POST",
				body: JSON.stringify({ user_name }),
			}
		);
	}
}

// HereModal
export class HereModal {
	constructor(id) {
		this.el = document.getElementById(id);
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.isOpen) this.close();
		});
		this.el.addEventListener("pointerdown", () => this.close());
		this.el
			.querySelector(".modal-close")
			.addEventListener("click", () => this.close());
		this.el
			.querySelector(".modal-body")
			.addEventListener("pointerdown", (e) => e.stopPropagation());
	}
	get isOpen() {
		return this.el.classList.contains("open");
	}
	close() {
		this.el.classList.remove("open");
		document.body.style.overflow = "";
		document.body.style.paddingRight = "";
		document.body.querySelectorAll(".header").forEach((el) => {
			el.style.paddingRight = "";
		});
	}
	open() {
		this.el.classList.add("open");
		this.el.querySelector("input")?.focus();
		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = getScrollbarWidth() + "px";
		document.body.querySelectorAll(".header").forEach((el) => {
			el.style.paddingRight = getScrollbarWidth() + "px";
		});
	}
}

function getScrollbarWidth() {
	// Creating invisible container
	const outer = document.createElement("div");
	outer.style.visibility = "hidden";
	outer.style.overflow = "scroll"; // forcing scrollbar to appear
	outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
	document.body.appendChild(outer);
	// Creating inner element and placing it in the container
	const inner = document.createElement("div");
	outer.appendChild(inner);
	// Calculating difference between container's full width and the child width
	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
	// Removing temporary elements from the DOM
	outer.parentNode.removeChild(outer);
	return scrollbarWidth;
}

export const successModal = new HereModal('success-modal')

export class WaitlistJoin extends HereModal {
	constructor() {
		super("waitlist-join")
		this.provider = new WaitlistProvider("#waitlist-join");
		this.provider.onSubmit = () => {
			this.close();
			successModal.open();
		};
	}
}

const waitlistJoin = new WaitlistJoin();
const headerInstance = new HeaderComponent();

const smoothstep = (min, max, value) => {
	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
	return x * x * (3 - 2 * x);
};

// Wait List Modal
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

// Wait List Join
const waitlistButtonJoin = Array.from(
	document.querySelectorAll(".waitlist-button-join")
);
waitlistButtonJoin.forEach((el) => {
	el.addEventListener("click", () => {
		waitlistJoin.open();
	});
});


if (/Android/.test(navigator.userAgent)) {
	const element = document.querySelector('.appandroid');
	element.classList.add('app-show');
} else if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream) {
	const element = document.querySelector('.appstore');
	element.classList.add('app-show');
} else {
	const element = document.querySelector('.apprandom');
	element.classList.add('app-show');
}


document.addEventListener('DOMContentLoaded', function () {
	// id таймера
	let timerId = null;
	// склонение числительных
	function declensionNum(num, words) {
		return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
	}
	// вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
	function countdownTimer() {
		const now = new Date();
		const currentUTCTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		const endOfDayUTCTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59);
		const diff = endOfDayUTCTime - currentUTCTime;
		if (diff <= 0) {
			clearInterval(timerId);
		}
		const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
		const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
		const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
		const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
		$days.textContent = days < 10 ? '0' + days : days;
		$hours.textContent = hours < 10 ? '0' + hours : hours;
		$minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
		$seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
		$days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
		$hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
		$minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
		$seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
	}
	// получаем элементы, содержащие компоненты даты
	const $days = document.querySelector('.timer__days');
	const $hours = document.querySelector('.timer__hours');
	const $minutes = document.querySelector('.timer__minutes');
	const $seconds = document.querySelector('.timer__seconds');
	// вызываем функцию countdownTimer
	countdownTimer();
	// вызываем функцию countdownTimer каждую секунду
	timerId = setInterval(countdownTimer, 1000);
});

fetch('https://dev.herewallet.app/api/v1/web/binance_whitelist')
	.then(response => response.json())
	.then(data => {
		const container = document.querySelector('.list-block__table');
		const containerNonlist = document.querySelector('.nonlist-block__table');
		const waitlist = data.waitlist;
		let countnonblock = 0;
		let countnonblock_full = 0;
		let countnonblock_deep = 0;
		waitlist.forEach((item, i) => {
			if ((item.status === 2) || (item.status === 1)) {
				if (countnonblock_deep < 15) {
					countnonblock_deep = countnonblock_deep + 1			
					const listDIVWrapper = document.createElement('div');
					
					// Global Deep or View
					if (item.status == 2) {
						listDIVWrapper.classList.add(`list-block__wrapper`,`list-block__deep`);
					} else if (item.status == 1) {
						listDIVWrapper.classList.add(`list-block__wrapper`, `list-block__view`);
					}

					// User name
					const listDIVusername = document.createElement('div');
					listDIVusername.classList.add(`list-block__col`, `list-block__1`);
					listDIVusername.textContent = item.username;

					// Deep or View
					const listDIVstatus = document.createElement('div');
					listDIVstatus.classList.add(`list-block__col`, `list-block__2`);
					if (item.status == 2) {
						listDIVstatus.textContent = 'Deep'
					} else if (item.status == 1) {
						listDIVstatus.textContent = 'View'
					}

					// Bounty with replace ABC
					const listDIVcoin = document.createElement('div');
					const listDIVcoinStr = item.bounty;
					const listDIVcoinDgt = listDIVcoinStr.replace(/\D/g, "");
					listDIVcoin.classList.add(`list-block__col`, `list-block__3`);
					listDIVcoin.textContent = listDIVcoinDgt;

					// Hash Link
					const listDIVhash = document.createElement('div');
					if (Boolean(item.transaction_hash)) {
						listDIVhash.classList.add(`list-block__col`, `list-block__4`);
						const listDIVhashLink = document.createElement('a');
						listDIVhashLink.href = 'https://explorer.near.org/transactions/' + item.transaction_hash;
						listDIVhash.appendChild(listDIVhashLink);
					} else {
						listDIVhash.classList.add(`list-block__col`, `list-block__4`, `list-block__grey`);
					}

					// Output
					listDIVWrapper.appendChild(listDIVusername);
					listDIVWrapper.appendChild(listDIVstatus);
					listDIVWrapper.appendChild(listDIVcoin);
					listDIVWrapper.appendChild(listDIVhash);

					container.appendChild(listDIVWrapper);
				}
			} else {
				countnonblock_full = countnonblock_full + 1;

				if (countnonblock < 48) {
					// DIV Wrapper
					const nonlistDIVWrapper = document.createElement('div');
					nonlistDIVWrapper.classList.add(`nonlist-block__wrapper`);

					// Count
					const nonlistDIVcount = document.createElement('div');
					nonlistDIVcount.classList.add(`nonlist-block__col`, `nonlist-block__0`);
					countnonblock = countnonblock + 1;
					nonlistDIVcount.textContent = countnonblock;

					// UserName
					const nonlistDIVusername = document.createElement('div');
					nonlistDIVusername.classList.add(`nonlist-block__col`, `nonlist-block__1`);
					nonlistDIVusername.textContent = item.username;

					// Score
					const nonlistDIVscore = document.createElement('div');
					nonlistDIVscore.classList.add(`nonlist-block__col`, `nonlist-block__2`);
					nonlistDIVscore.textContent = item.score;

					// Output
					nonlistDIVWrapper.appendChild(nonlistDIVcount);
					nonlistDIVWrapper.appendChild(nonlistDIVusername);
					nonlistDIVWrapper.appendChild(nonlistDIVscore);
					containerNonlist.appendChild(nonlistDIVWrapper);
				} else {}
			}
		});

		const waitDiv = document.querySelector('.ac-waitlist');
		const waitDiv2 = document.querySelector('.nonlist-block__link');
		const withaccessDiv = document.querySelector('.ac-withaccess');
		const withaccessDiv2 = document.querySelector('.list-block__link');
		const prizesDistributed = document.querySelector('.prizes-distributed');

		waitDiv.innerHTML = `${countnonblock_full}`;
		withaccessDiv.innerHTML = `${waitlist.length}` - `${countnonblock_full}`;
		waitDiv2.innerHTML = `Click to see all ` + `${countnonblock_full}` + ` users`;
		withaccessDiv2.innerHTML = `Click to see all ` + withaccessDiv.innerHTML + ` users`;
		const prizesDistributedCount = (`${waitlist.length}` - `${countnonblock_full}`)*4;
		prizesDistributed.innerHTML = `$` + prizesDistributedCount;
	});