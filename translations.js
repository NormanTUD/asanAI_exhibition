"use strict";

function err (...args) {
	console.error(args);
}


var _default_language = "de";

// Get the language from the cookie or use the default language
var lang_cookie_name = "language_cookie";
var lang = _default_language;

var urlParams = new URLSearchParams(window.location.search);

// Function to set the language and update translations
async function set_lang(la) {
	var old_lang = lang;
	if(Object.keys(language).includes(la)) {
		lang = la;
		await update_translations();

		if(old_lang && la) {
			//$($("#b_de").children(0)[0]).removeClass(`language_${old_lang}`).addClass(`language_${la}`);
			$($("#b_de").children(0)[0]).removeClass(`language_${la}`).addClass(`language_${old_lang}`);
		}
	} else {
		err(`Language unknown: ${la}`);
	}
}

function switch_language () {
	var new_lang = "";
	if(lang == "de") {
		new_lang = "en";
	} else {
		new_lang = "de";
	}

	set_lang(new_lang);
}

// Function to update the translation of elements
async function update_translations(force=0) {
	var elements = document.querySelectorAll("[class^=\"TRANSLATEME_\"]");
	elements.forEach((element) => {
		const translationKey = element.classList[0].substring(12);

		if(!lang) {
			err("lang is not defined! Something is seriously wrong here...");
			return;
		}

		const translation = language[lang][translationKey];

		if (typeof(translation) == "string") {
			if($(element).attr("data-lang") != lang || force) {
				element.innerHTML = translation;

				$(element).attr("data-lang", lang);
			}
		} else {
			console.error("Could not translate '" + translationKey + "' to " + lang);
		}

	});
}

// Update translations when language selector links are clicked
var languageSelectors = $(".language-selector").find("span");
Array.from(languageSelectors).forEach((selector) => {
	selector.addEventListener("click", async function (event) {
		event.preventDefault();
		const newLang = this.dataset.lang;
		if (newLang !== lang) {
			await set_lang(newLang);
		}
	});
});

// Update translations when language is changed via URL parameter
window.addEventListener("popstate", async function () {
	const newLang = urlParams.get("lang") || "en";
	if (newLang !== lang) {
		await set_lang(newLang);
	}
});

async function update_lang(la) {
	if(Object.keys(language).includes(la)) {
		lang = la;
		await update_translations();
	} else {
		err(`Language unknown: ${la}`);
	}
}

function trm (name) {
	if(Object.keys(language[lang]).includes(name)) {
		return `<span class='TRANSLATEME_${name}'></span>`;
	}

	console.error(`${name} NOT FOUND`);

	return `${name} NOT FOUND`;
}

function _get_new_translations() {
	var url = "translations.php?print=1";

	function parse(data) {
		try {
			language = JSON.parse(data);

			update_translations(1); // await not possible
		} catch (e) {
			console.error(e); // await not possible
		}
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: parse
	});
}

// _get_new_translations()

// Update translations on initial page load
update_translations(); // await not possible
