const actionBtn = document.querySelector('.binance-here__switch');
const actionItems = document.querySelectorAll('.binance-features__item, .binance-features-2__item');

// Add a click event listener to the button
actionBtn.addEventListener('click', function () {
	actionBtn.classList.toggle('action');
	actionItems.forEach(function (item) {
		item.classList.toggle('action');
	});
});