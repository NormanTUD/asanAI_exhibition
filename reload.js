const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes

let inactivitysTimeout;

function resetTimer() {
	// Timeout zurücksetzen
	clearTimeout(inactivitysTimeout);

	// Neuen Timeout setzen
	inactivitysTimeout = setTimeout(() => {
		let aktuelleUrl = window.location.href;
		let indexUrl = 'index.php';

		window.location.href = indexUrl;
	}, INACTIVITY_TIME);
}

window.onload = function() {
	resetTimer();

	document.addEventListener('mousemove', resetTimer);
	document.addEventListener('keydown', resetTimer);
	document.addEventListener('scroll', resetTimer);
};
