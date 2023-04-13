export class WaitlistProvider {
	constructor(selector, onSubmit) {
		this.onSubmit = onSubmit;
		this.root = document.querySelector(selector);
		this.input = this.root.querySelector("input");
		this.button = this.root.querySelector(".here-button");
		this.button.disabled = true;

		this.input.addEventListener("input", (e) => {
			const { value, isValid } = maskedPhone(this.input.value);
			this.button.disabled = !isValid;
			this.input.value = value;
		});

		this.button.addEventListener("click", async () => {
			await this.submit(this.input.value);
		});
	}

	async submit(phone_number) {
		this.onSubmit();
		this.input.value = "";

		const res = await fetch(
			"https://api.herewallet.app/api/v1/web/android_whitelist",
			{
				method: "POST",
				body: JSON.stringify({ phone_number }),
			}
		);
	}
}

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

export const maskedPhone = (value) => {
	const mask = "+X (XXX) XXX-XX-XXXX".split("");

	const numbers = value.replace(/\D/g, "").split("");
	const isValid = numbers.length >= 6;

	let result = "";
	for (let i = 0; i < mask.length; i++) {
		if (numbers.length == 0) break;
		const char = mask[i];
		if ([" ", "(", ")", "+", "-"].includes(char)) {
			if (numbers.length) result += char;
			else break;
			continue;
		}

		result += numbers.shift();
	}

	return { value: result, isValid };
};


export const successModal = new HereModal('success-modal')

export class WaitlistModal extends HereModal {
	constructor() {
		super("waitlist-modal")
		this.provider = new WaitlistProvider("#waitlist-modal");
		this.provider.onSubmit = () => {
			this.close();
			successModal.open();
		};
	}
}


const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

const smoothstep = (min, max, value) => {
	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
	return x * x * (3 - 2 * x);
};


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

const newsItems = Array.from(document.querySelectorAll(".news-item"));
newsItems.forEach((el) => {
	el.addEventListener("click", () => {
		el.querySelector("a")?.click();
	});
});

const secureBanner = document.querySelector(".secure-banner");
secureBanner?.addEventListener("click", (e) => {
	if (e.target.tag === "a") return;
	secureBanner.querySelector(".secure-banner-link")?.click();
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