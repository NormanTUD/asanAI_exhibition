"use strict";

function err (...args) {
	console.error(args);
}

var _default_language = "de";

// Get the language from the cookie or use the default language
var lang_cookie_name = "language_cookie";
var lang = get_lang_cookie();

var urlParams = new URLSearchParams(window.location.search);

// Function to set the language and update translations
async function set_lang(la) {
	if(Object.keys(language).includes(la)) {
		lang = la;
		await update_translations();
	} else {
		err(`Language unknown: ${la}`);
	}
}

// Function to retrieve a cookie value
function get_lang_cookie() {
	const cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(lang_cookie_name + "=")) {
			var cookieValue = cookie.substring(lang_cookie_name.length + 1);
			if(Object.keys(language).includes(cookieValue)) {
				return cookieValue;
			} else {
				err(`Invalid language cookie value: ${cookieValue} not in language. Valid keys: ${Object.keys(language).join(", ")}`);
				set_lang_cookie(_default_language);
			}
		}
	}
	return _default_language;
}

// Function to set a cookie value
function set_lang_cookie(value, days) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + days);
	const cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
	if(Object.keys(language).includes(value)) {
		document.cookie = lang_cookie_name + "=" + cookieValue;
	} else {
		err(`Invalid language cookie value: ${value} not in language. Valid keys: ${Object.keys(language).join(", ")}`);
	}
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

		if (translation) {
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
		set_lang_cookie(lang, 99999);
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
			write_error(e); // await not possible
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
