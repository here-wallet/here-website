import { QRCode, lightQR } from "@here-wallet/core/build/qrcode-strategy";
import { HeaderComponent } from "../landing/scripts/HeaderComponent";
import { WaitlistModal } from "../landing/scripts/WaitlistModal";

const waitlistModal = new WaitlistModal();
const headerInstance = new HeaderComponent();

const smoothstep = (min, max, value) => {
	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
	return x * x * (3 - 2 * x);
};

// Wait List Join
const waitlistButtons = Array.from(
	document.querySelectorAll(".waitlist-button")
);
// Switch Between ModalForm and MiniForm-in-MenuToggle
waitlistButtons.forEach((el) => {
	el.addEventListener("click", () => {
		if (window.innerWidth <= 778) {
			headerInstance.toggleModal();
		} else {
			waitlistModal.open();
		}
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


window.addEventListener('DOMContentLoaded', function () {
	var headerNote = document.querySelector('.header-note');
	var closeButton = document.querySelector('.header-note__close');

	// Check if the header-note should be shown
	var isHeaderNoteClosed = (document.cookie.indexOf('headerNoteClosed') !== -1) || (localStorage.getItem('headerNoteClosed') === 'true');

	if (!isHeaderNoteClosed) {
		var scrollHandler = function () {
			if (window.scrollY >= 300) {
				headerNote.classList.add('open');
			} else {
				headerNote.classList.remove('open');
			}
		};

		window.addEventListener('scroll', scrollHandler);

		// Close the header-note when the close button is clicked
		closeButton.addEventListener('click', function () {
			headerNote.classList.remove('open');
			document.cookie = 'headerNoteClosed=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
			localStorage.setItem('headerNoteClosed', 'true');

			// Remove the scroll event listener after closing the header-note
			window.removeEventListener('scroll', scrollHandler);
		});
	} else {
		headerNote.classList.remove('open');
		document.cookie = 'headerNoteClosed=true; expires=Fri, 31 Dec 2000 23:59:59 GMT; path=/';
		localStorage.removeItem('headerNoteClosed');
	}
});

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


fetch("https://api.herewallet.app/api/v1/web/binance_whitelist")
  .then((response) => response.json())
  .then((data) => {
    const container = document.querySelector(".list-block__table");
    const containerNonlist = document.querySelector(".nonlist-block__table");
    const waitlist = data.waitlist;
    let countnonblock = 0;
    let countnonblock_full = 0;
    let countnonblock_deep = 0;
    waitlist.forEach((item, i) => {
      if (item.status === 2 || item.status === 1) {
        if (countnonblock_deep < 15) {
          countnonblock_deep = countnonblock_deep + 1;
          const listDIVWrapper = document.createElement("div");

          // Global Deep or View
          if (item.status == 2) {
            listDIVWrapper.classList.add(
              `list-block__wrapper`,
              `list-block__deep`
            );
          } else if (item.status == 1) {
            listDIVWrapper.classList.add(
              `list-block__wrapper`,
              `list-block__view`
            );
          }

          // User name
          const listDIVusername = document.createElement("div");
          listDIVusername.classList.add(`list-block__col`, `list-block__1`);
          listDIVusername.textContent = item.username;

          // Deep or View
          const listDIVstatus = document.createElement("div");
          listDIVstatus.classList.add(`list-block__col`, `list-block__2`);
          if (item.status == 2) {
            listDIVstatus.textContent = "Deep";
          } else if (item.status == 1) {
            listDIVstatus.textContent = "View";
          }

          // Bounty with replace ABC
          const listDIVcoin = document.createElement("div");
          const listDIVcoinStr = item.bounty;
          const listDIVcoinDgt = listDIVcoinStr.replace(/\D/g, "");
          listDIVcoin.classList.add(`list-block__col`, `list-block__3`);
          listDIVcoin.textContent = listDIVcoinDgt;

          // Hash Link
          const listDIVhash = document.createElement("div");
          if (Boolean(item.transaction_hash)) {
            listDIVhash.classList.add(`list-block__col`, `list-block__4`);
            const listDIVhashLink = document.createElement("a");
            listDIVhashLink.href =
              "https://explorer.near.org/transactions/" + item.transaction_hash;
            listDIVhash.appendChild(listDIVhashLink);
          } else {
            listDIVhash.classList.add(
              `list-block__col`,
              `list-block__4`,
              `list-block__grey`
            );
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
          const nonlistDIVWrapper = document.createElement("div");
          nonlistDIVWrapper.classList.add(`nonlist-block__wrapper`);

          // Count
          const nonlistDIVcount = document.createElement("div");
          nonlistDIVcount.classList.add(
            `nonlist-block__col`,
            `nonlist-block__0`
          );
          countnonblock = countnonblock + 1;
          nonlistDIVcount.textContent = countnonblock;

          // UserName
          const nonlistDIVusername = document.createElement("div");
          nonlistDIVusername.classList.add(
            `nonlist-block__col`,
            `nonlist-block__1`
          );
          nonlistDIVusername.textContent = item.username;

          // Score
          const nonlistDIVscore = document.createElement("div");
          nonlistDIVscore.classList.add(
            `nonlist-block__col`,
            `nonlist-block__2`
          );
          nonlistDIVscore.textContent = item.score;

          // Output
          nonlistDIVWrapper.appendChild(nonlistDIVcount);
          nonlistDIVWrapper.appendChild(nonlistDIVusername);
          nonlistDIVWrapper.appendChild(nonlistDIVscore);
          containerNonlist.appendChild(nonlistDIVWrapper);
        } else {
        }
      }
    });

    const waitDiv = document.querySelector(".ac-waitlist");
    const waitDiv2 = document.querySelector(".nonlist-block__link");
    const withaccessDiv = document.querySelector(".ac-withaccess");
    const withaccessDiv2 = document.querySelector(".list-block__link");
    const prizesDistributed = document.querySelector(".prizes-distributed");

    waitDiv.innerHTML = `${countnonblock_full}`;
    withaccessDiv.innerHTML = `${waitlist.length}` - `${countnonblock_full}`;
    waitDiv2.innerHTML =
      `Click to see all ` + `${countnonblock_full}` + ` users`;
    withaccessDiv2.innerHTML =
      `Click to see all ` + withaccessDiv.innerHTML + ` users`;
    const prizesDistributedCount =
      (`${waitlist.length}` - `${countnonblock_full}`) * 4;
    prizesDistributed.innerHTML = `$` + prizesDistributedCount;
  });


const asks = Array.from(document.querySelectorAll(".ask-block"));
asks.forEach((el) => {
	el.addEventListener("click", () => {
		const header = el.querySelector(".ask-block-header");
		const body = el.querySelector(".ask-block-body");
		const headerBox = header.getBoundingClientRect();

		asks.forEach((ask) => {
			if (ask == el) return;
			const header = ask.querySelector(".ask-block-header");
			const box = header.getBoundingClientRect();
			ask.classList.remove("open");
			ask.style.height = box.height + "px";
		});

		el.style.height = headerBox.height + "px";
		body.style.display = "block";
		setTimeout(() => {
			const { height } = body.getBoundingClientRect();
			el.classList.toggle("open");
			el.style.height = el.classList.contains("open")
				? `${headerBox.height + height}px`
				: headerBox.height + "px";
		}, 10);
	});
});

