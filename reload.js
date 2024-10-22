const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes

let inactivitysTimeout;

function resetTimer() {
	clearTimeout(inactivitysTimeout);

	inactivitysTimeout = setTimeout(() => {
		const searchParams = new URLSearchParams(window.location.search);

		let indexUrl = 'index.php?reload=1';

		if (searchParams.has('quick')) {
			indexUrl += '&quick=1';
		}	

		if (searchParams.has('load_11')) {
			indexUrl += '&load_11=1';
		}

		window.location.href = indexUrl;
	}, INACTIVITY_TIME);
}

window.onload = function() {
	resetTimer();

	document.addEventListener('mousemove', resetTimer);
	document.addEventListener('keydown', resetTimer);
	document.addEventListener('scroll', resetTimer);

	var _searchParams = new URLSearchParams(window.location.search);
	if (_searchParams.has('quick') && _searchParams.has('load_11')) {
		load_page_with_params("11_test_images.php");
	}
};
