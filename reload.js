// Zeit in Millisekunden (5 Minuten)
const INACTIVITY_TIME = 5 * 60 * 1000;

// Timeout-Variable
let inactivitysTimeout;

// Funktion zum Neustarten des Timers
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

// Event-Listener für Mausbewegungen und Tastatureingaben
window.onload = function() {
	// Timer beim Laden der Seite starten
	resetTimer();

	// Event-Listener hinzufügen, um inactivitys-Timer zurückzusetzen
	document.addEventListener('mousemove', resetTimer);
	document.addEventListener('keydown', resetTimer);
	document.addEventListener('scroll', resetTimer);
};
