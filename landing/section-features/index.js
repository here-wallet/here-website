function slider(sliderElement) {
	const slides = sliderElement.querySelectorAll('.slides img');
	const featureContent = sliderElement.closest('.feature').querySelector('.feature-content');
	const pagination = sliderElement.querySelector('.pagination');
	const featureContentlistItems = featureContent.querySelectorAll('.feature-content li');

	let currentSlide = 0;
	let slideInterval;


	// При клике на кнопку пагинации
	pagination.querySelectorAll('span').forEach(function (span) {
		span.addEventListener('click', function () {
			// Найти индекс текущей кнопки
			const currentIndex = Array.prototype.indexOf.call(pagination.children, this);
			// Переключить соответствующий элемент списка на активный
			featureContentlistItems.forEach(function (item, index) {
				if (index === currentIndex) {
					item.classList.add('active');
				} else {
					item.classList.remove('active');
				}
			});
		});
	});

	function startSlider() {
		slides[0].classList.add('active');
		slideInterval = setInterval(nextSlide, 3000);
	}

	function pauseSlider() {
		clearInterval(slideInterval);
	}

	function nextSlide() {
		slides[currentSlide].classList.remove('active');
		featureContentlistItems[currentSlide].classList.remove('active');
		currentSlide = (currentSlide + 1) % slides.length;
		slides[currentSlide].classList.add('active');
		featureContentlistItems[currentSlide].classList.add('active');
		updatePagination();
		slides.forEach(slide => {
			slide.style.transform = `translateX(-${currentSlide * 100}%)`;
		});
	}

	function previousSlide() {
		slides[currentSlide].classList.remove('active');
		featureContentlistItems[currentSlide].classList.remove('active');
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		slides[currentSlide].classList.add('active');
		featureContentlistItems[currentSlide].classList.add('active');
		updatePagination();
		slides.forEach(slide => {
			slide.style.transform = `translateX(-${currentSlide * 100}%)`;
		});
	}

	function updatePagination() {
		pagination.innerHTML = '';
		for (let i = 0; i < slides.length; i++) {
			const span = document.createElement('span');
			if (i === currentSlide) {
				span.classList.add('active');
			}
			span.addEventListener('click', () => {
				pauseSlider();
				slides[currentSlide].classList.remove('active');
				currentSlide = i;
				slides[currentSlide].classList.add('active');
				updatePagination();
				slides.forEach(slide => {
					slide.style.transform = `translateX(-${currentSlide * 100}%)`;
				});
			});
			pagination.appendChild(span);
		}
	}
	startSlider();
	updatePagination();
}

document.querySelectorAll('.slider').forEach(sliderElement => slider(sliderElement));