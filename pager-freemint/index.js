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
			el.style.height = el.classList.contains("open")
				? `${headerBox.height + height}px`
				: headerBox.height + "px";
		}, 10);
	});
});

// Функция для выполнения асинхронного запроса к API
    async function checkAuthentication() {
      try {
        // Выполняем запрос к API
        const response = await fetch("https://api.herewallet.app/api/v1/docs#/partners_api/get_aurora_missions_partners_aurora_missions_get");

        // Проверяем, что статус ответа равен 401 (Not authenticated)
        if (response.status === 401) {
          // Если ответ "Not authenticated", то добавляем класс "not-active" блоку
          document.querySelector("body").classList.add("not-active");
        } else {
          // В противном случае добавляем класс "active"
          document.querySelector("body").classList.add("active");
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      }
    }

    // Вызываем функцию проверки авторизации при загрузке страницы
    checkAuthentication();

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
