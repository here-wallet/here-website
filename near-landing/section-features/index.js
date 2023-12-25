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
		slides.forEach((slide, index) => {
			if (currentSlide === 0) {
				if (index === slides.length - 1) {
					slide.style.transform = `translateX(-${(index + 1) * 100}%)`;
				} else if (index === 0) {
					setTimeout(() => {
						slide.style.transition = 'none'
						slide.style.opacity = '0'
						slide.style.transform = `translateX(100%)`;
					}, 10)
					setTimeout(() => {
						slide.style.transition = 'opacity .8s ease-in, transform .8s cubic-bezier(.4, 1, .55, 1.05)'
						slide.style.opacity = '1';
						slide.style.transform = `translateX(-${currentSlide * 100}%)`;
					}, 200);
				}
				else {
					slide.style.transform = `translateX(-${currentSlide * 100}%)`;
				}
			} else {
				slide.style.transform = `translateX(-${currentSlide * 100}%)`;
			}
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