const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes

let inactivitysTimeout;

function resetTimer() {
	clearTimeout(inactivitysTimeout);

	inactivitysTimeout = setTimeout(() => {
		const searchParams = new URLSearchParams(window.location.search);

		let indexUrl = 'index.php';
		
		if (searchParams.has('quick')) {
			indexUrl = 'index.php?quick=1';
		}


		window.location.href = indexUrl;
	}, INACTIVITY_TIME);
}

window.onload = function() {
	resetTimer();

	document.addEventListener('mousemove', resetTimer);
	document.addEventListener('keydown', resetTimer);
	document.addEventListener('scroll', resetTimer);
};
