const asks = Array.from(document.querySelectorAll(".faq-block"));
asks.forEach((el) => {
  el.addEventListener("click", () => {
    const header = el.querySelector(".faq-block-header");
    const body = el.querySelector(".faq-block-body");
    const headerBox = header.getBoundingClientRect();

    asks.forEach((ask) => {
      if (ask == el) return;
      const header = ask.querySelector(".faq-block-header");
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

document.addEventListener("DOMContentLoaded", function() {
	const burgerClosetButton = document.querySelector(".burger-closet");
	const burgerOpenButton = document.querySelector(".burger-open");
	const headerBlock = document.querySelector(".header");

	// По клику на кнопку открываем меню
	burgerClosetButton.addEventListener("click", function() {
		headerBlock.classList.add("active");
	});

	// По клику на кнопку закрываем меню
	burgerOpenButton.addEventListener("click", function() {
		headerBlock.classList.remove("active");
	});
});



document.addEventListener("DOMContentLoaded", function() {
  var withChildItems = document.querySelectorAll('.menu-link_children');
  var forEcosystemBlock = document.querySelector('.for-ecosystem');

  withChildItems.forEach(function(item) {
      item.addEventListener('click', function(event) {
          event.stopPropagation();
          var isAlreadyOpen = item.classList.contains('show');

          // Убираем класс "show" у всех элементов с классом "with-child"
          withChildItems.forEach(function(item) {
              item.classList.remove('show');
          });

          // Убираем класс "show" у блока с классом "for-ecosystem"
          forEcosystemBlock.classList.remove('show');

          if (!isAlreadyOpen) {
              // Если элемент не был открыт, добавляем класс "show" к самому элементу и к блоку "for-ecosystem"
              item.classList.add('show');
              forEcosystemBlock.classList.add('show');
          }
      });
  });

  document.addEventListener('click', function(event) {
      if (!event.target.closest('.for-ecosystem')) {
          withChildItems.forEach(function(item) {
              item.classList.remove('show');
          });
          forEcosystemBlock.classList.remove('show');
      }
  });
});

