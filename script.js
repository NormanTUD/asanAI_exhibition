// Defines the optimizer that should be used for training.
// Can be specified for each model seperately and on-demand, but I chose to do it here, because
// then I don't need to define it in other places.
// You can also build a GUI for this.

var keyboard = null;
var is_touch_device_cache = null;
var myKeyboard = null;
var done_loading = false;
var stringToNumberMap = [];
var currentNumber = 0;
var required_nr_images_per_category = 10;
var is_training = false;

function assert(cond, msg) {
	if(!cond) {
		console.error(msg);
	}
}

function closeSpinnerFullScreen() {
	// Entfernen des Styles und des Overlay-Divs
	var overlay = document.getElementById('spinner-overlay');
	if (overlay) {
		document.body.removeChild(overlay);
	}

	var style = document.querySelector('style');
	if (style && style.textContent.includes('#spinner-overlay')) {
		document.head.removeChild(style);
	}
}

function showSpinnerFullScreen() {
	closeSpinnerFullScreen();

	// Erstellen des Styles für das Overlay und den Spinner
	var style = document.createElement('style');
	style.textContent = `
		#spinner-overlay {
		    position: fixed;
		    top: 0;
		    left: 0;
		    width: 100%;
		    height: 100%;
		    background: rgba(0, 0, 0, 0.5);
		    display: flex;
		    justify-content: center;
		    align-items: center;
		    z-index: 2147483647; /* Höchster z-index-Wert */
		}
		.spinner {
		    border: 16px solid #f3f3f3;
		    border-top: 16px solid #3498db;
		    border-radius: 50%;
		    width: 120px;
		    height: 120px;
		    animation: spin 2s linear infinite;
		}
		@keyframes spin {
		    0% { transform: rotate(0deg); }
		    100% { transform: rotate(360deg); }
		}
	`;
	document.head.appendChild(style);

	// Erstellen des Overlay-Divs
	var overlay = document.createElement('div');
	overlay.id = 'spinner-overlay';
	overlay.innerHTML = '<div class="spinner"></div>';
	document.body.appendChild(overlay);
}

var log = console.log;

var batch_size = 200;
var __categories = ["apfel", "banane", "orange"];

var default_optimizer_config = {
	optimizer: "adam",
	loss: "categoricalCrossentropy",
	"learningRate": 0.01
};

// This variable will hold the asanAI object. Each object can have exactly one model loaded.
// But you can have as many objects as you wish, or, e.g., save them in an array or a dictionary
// or whatever you like or need, just like normal variables/objects (which it absolutely is).

var asanai;

var _kernel_initializer = "leCunNormal";
var _bias_initializer = "leCunNormal";

var default_model_struct = [
	{conv2d: {filters: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [width_and_height, width_and_height, 3] }},
	{conv2d: {filters: 2, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
	{maxPooling2d: {poolSize: [3, 3] }},
	{flatten: {}},
	{dense: {units: 8, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
	{dense: {units: __categories.length, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
];

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// When the site has fully loaded, initialize the objects
$(document).ready(async function() {
	try {
		asanai = new asanAI({
			model_data: default_model_struct,					// The default model structure that should be loaded
			optimizer_config: default_optimizer_config,			// The config for the optimizer (which trains the model)
			optimizer_table_div_name: "optimizer_div",		// A div, in which the settings for the optimizer should be written, so the user may change them
			asanai_object_name: "asanai",				// The name of the variable containing the asanAI object.
			// This is important for things like "onclick"-events and needs to be changed when you use other variable names than
			// `var asanai`.
		});

		asanai.set_dark_mode();
	} catch (e) {
		console.error(e);

		done_loading = true;

		return;
	}

	//asanai.set_lang("de");

	//asanai.show_status_bar();

	//asanai.disable_show_bars();

	asanai.set_divide_by(255);

	asanai.set_labels(__categories);

	asanai.enable_fcnn_internals();

	asanai.set_validation_split(0);

	$("#nr_epochs").html(nr_epochs);
	$("#progress").attr("max", nr_epochs);

	done_loading = true;

	document.body.style.cursor = get_cursor_or_none("default");

	/*
	if($("#start_custom_training").length) {
		setInterval(function() {
			enable_or_disable_training_if_needed();
		}, 200);
	}
	*/

	enable_or_disable_training_if_needed();

	closeSpinnerFullScreen();
});


function generateThumbnail(container_id) {
	var _container = $('#' + container_id);

	if(_container.length != 1) {
		console.error(`Did not find exactly 1 #${_container_id} element`);
		return;
	}

	var $video = $("#webcam_preview_video");

	if($video.length != 1) {
		console.error(`Did not find exactly 1 #webcam_preview_video element`);
		return;
	}

	var video = $video[0];

	var $thecanvas = $(`<canvas width=220 height=150></canvas>`);
	var thecanvas = $thecanvas[0];

	var context = thecanvas.getContext('2d');
	context.drawImage(video, 0, 0, 220, 150);
	var dataURL = thecanvas.toDataURL();

	var img = document.createElement('img');
	img.setAttribute('src', dataURL);
	img.setAttribute('class', 'custom_image_element');

	_container.append(img);
	_container.append($("<a class='delete_image_x' onclick='delete_image(this)'></a>")[0]);

	enable_or_disable_training_if_needed();
}

function delete_image (elem) {
	$(elem).prev().remove();
	$(elem).remove();

	update_after_relevant_change();
}

async function load_and_train_scheine_muenzen_schluessel() {
	var model_struct = [
		{conv2d: {filters: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [40, 40, 3] }},
		{conv2d: {filters: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{maxPooling2d: {poolSize: [3, 3] }},
		{flatten: {}},
		{dense: {units: 8, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: __categories.length, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
	];

	return await _load_example("scheine_muenzen_schluessel", "second_example_images", 20, model_struct, default_optimizer_config, ["Scheine", "Münzen", "Schlüssel"]);
}

async function load_and_train_fruits_example() {
	return await _load_example("fruits", "first_example_images", 20, default_model_struct, default_optimizer_config, ["apfel", "banane", "orange"]);
}

function assignNumberToString(inputString) {
	// Überprüfen, ob der String bereits im Array vorhanden ist
	for (var i = 0; i < stringToNumberMap.length; i++) {
		if (stringToNumberMap[i].string === inputString) {
			// Wenn der String bereits existiert, die zugehörige Nummer zurückgeben
			return stringToNumberMap[i].number;
		}
	}

	// Wenn der String nicht existiert, eine neue Zuordnung erstellen
	var newMapping = {
		string: inputString,
		number: currentNumber
	};

	// Die Zuordnung zum globalen Array hinzufügen
	stringToNumberMap.push(newMapping);

	// Die aktuelle Nummer zurückgeben und den Zähler erhöhen
	return currentNumber++;
}

function generateOneHotArray(position, length) {
	// Ein Array der gewünschten Länge erstellen, gefüllt mit Nullen
	var oneHotArray = new Array(length).fill(0);

	// An der Position 'position' eine 1 setzen
	if (position >= 0 && position < length) {
		oneHotArray[position] = 1;
	} else {
		throw new Error("Position out of bounds");
	}

	return oneHotArray;
}

//async function _start_custom_training(example_name, to_div_name, max_nr, model_struct, optimizer_config, local_categories) {
async function _start_custom_training(optimizer_config) {
	$("#progress").show();
	$("#progress-text").show();
	$("#text_training").show();
	$("#visualization").show();
	$("#canvas_grid_visualization").show();

	stringToNumberMap = [];
	currentNumber = 0;

	var local_categories = getCustomCategoryNames();

	if(!shouldCustomTrainingBeEnabled(local_categories)) {
		console.error(`Custom training currently disabled`);
		return;
	}

	$("#start_custom_training").hide();

	var _width_and_height = 40;

	var model_struct = [
		{conv2d: {filters: 6, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [_width_and_height, _width_and_height, 3] }},
		{conv2d: {filters: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{flatten: {}},
		{dense: {units: 8, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: local_categories.length, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
	];
	
	var _created_model = asanai.create_model_from_model_data(model_struct, optimizer_config);

	asanai.set_model(_created_model);

	asanai.set_labels(local_categories);

	start_training_show_divs();

	var loaded_data = {};

	var $custom_images_category = $(".custom_images_category");


	var _x = [];
	var _y = [];

	$custom_images_category.each((i, e) => {
		var category_name = $(e).find("input").val();
		var category_id = assignNumberToString(category_name);

		var reply = generateOneHotArray(category_id, $custom_images_category.length);

		var found_imgs = $(e).find("img");

		for (var k = 0; k < found_imgs.length; k++) {
			var this_img = found_imgs[k];

			$(this_img).data("real_category", category_name);

			var this_img_tensor = tf.tidy(() => {
				var fromPixel = tf.browser.fromPixels(this_img);

				var ___res = tf.div(
					tf.image.resizeBilinear(
						fromPixel,
						[_width_and_height, _width_and_height],
						true,
						false
					), tf.scalar(1)
				).arraySync();

				return ___res;
			});

			_x.push(this_img_tensor);
			_y.push(reply);
		}

	});

	if(!_x.length) {
		console.error("_x is empty");
		return;
	}

	if(!_y.length) {
		console.error("_y is empty");
		return;
	}

	if(_x.length != _y.length) {
		console.error("_x has a different length from _y!");
		return;
	}

	var loaded_data = {
		"x": tf.tensor(_x),
		"y": tf.tensor(_y)
	}

	if(loaded_data) {
		asanai.visualize_train();

		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: nr_epochs, batchSize: batch_size, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
		if(!history) {
			console.error("Training failed");
		}

	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}

	await asanai.dispose(loaded_data.x);
	await asanai.dispose(loaded_data.y);

	createAuswertungTable(local_categories);

	$("#visualization").hide();

	$("#progress").hide();
	$("#progress-text").hide();
	$("#text_training").hide();
	$("#visualization").hide();
	$("#canvas_grid_visualization").hide();
}

async function _load_example(example_name, to_div_name, max_nr, model_struct, optimizer_config, local_categories) {
	is_training = true;
	$("#close_button").hide();

	var _created_model = asanai.create_model_from_model_data(model_struct, optimizer_config);

	asanai.set_model(_created_model);

	asanai.set_labels(local_categories);

	start_training_show_divs()

	var exhib_data = [];

	var _cats = asanai.get_labels();

	for (var k = 0; k < _cats.length; k++) {
		var _cat = _cats[k];

		for (var l = 1; l <= max_nr; l++) {
			var this_path = `traindata/${example_name}/${_cat}/${l}.jpg`

			exhib_data.push([this_path, _cat])
		}
	}

	var loaded_data = await asanai.load_image_urls_to_div_and_tensor(to_div_name, exhib_data);

	$("#progress").show();
	$("#progress-text").show();
	$("#text_training").show();
	$("#visualization").show();
	$("#canvas_grid_visualization").show();

	$("#" + to_div_name).hide();

	if(loaded_data) {
		asanai.visualize_train();

		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: nr_epochs, batchSize: batch_size, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
		if(!history) {
			console.error("Training failed");
		}

		await asanai.dispose(loaded_data.x);
		await asanai.dispose(loaded_data.y);
	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}

	createAuswertungTable(local_categories);

	$("#close_button").show();

	$("#progress").hide();
	$("#progress-text").hide();
	$("#text_training").hide();
	$("#canvas_grid_visualization").hide();
	is_training = false;
}

function createAuswertungTable(local_categories) {
	// Entferne alle Inhalte der Tabelle
	$("#auswertung_element").empty();

	// Erste Zeile erstellen
	let firstRow = $("<tr></tr>");
	local_categories.forEach(function(element) {
		let td = $("<td></td>").addClass("auswertung_element").attr("id", "matrix_text_" + md5(element));
		firstRow.append(td);
	});

	// Zweite Zeile erstellen
	let secondRow = $("<tr></tr>");
	let colspanTd = $("<td></td>").
		addClass("auswertung_element").
		attr("id", "matrix_text").
		attr("colspan", local_categories.length)
	;

	secondRow.append(colspanTd);

	firstRow.appendTo("#auswertung_element");
	secondRow.appendTo("#auswertung_element");
}

function try_yourself () {
	asanai.show_and_predict_webcam_in_div("webcam_prediction");

	asanai.start_camera();

	$("#auswertung_element").hide();
	$("#matrix_text").hide();
	$("#analysis").hide();
	$("#yourself").hide();
	$("#explanation_after_training").show();
	$("#fcnn_div").show();

	var _l = asanai.get_labels().map(v => v.toLowerCase());

	for (var k = 0; k < _l.length; k++) {
		$("#matrix_text_" + md5(_l[k])).hide();
	}
}

function start_training_show_divs() {
	$("#box-wide").toggle();
}

function show_auswertung () {
	matrix_texts();

	var _elems_ids = [
		"auswertung",
		"text_training",
		"auswertung_anzeigen",
		"visualization",
		"matrix_text",
		"yourself"
	];

	var _l = asanai.get_labels().map(v => v.toLowerCase());

	for (var k = 0; k < _l.length; k++) {
		_elems_ids.push("matrix_text_" + md5(_l[k]));
	}

	var _elems_classes = [
		"auswertung_element",
	];

	for (var i = 0; i < _elems_ids.length; i++) {
		$("#" + _elems_ids[i]).toggle();
	}

	for (var i = 0; i < _elems_classes.length; i++) {
		$("." + _elems_classes[i]).toggle();
	}

	if($("#fcnn_div").length) {
		asanai.set_fcnn_height(400);
		asanai.set_fcnn_width(800);
		asanai.draw_fcnn("fcnn_div", 32, true);
	} else {
		log("Could not find #fcnn_div");
	}
}

//3 Funktionen, welche Hidden toggeln
let toggle = (element) => {
	if(!element) {
		console.error("Could not find null element")
		return
	}

	let hidden = element.getAttribute("hidden");
	if (hidden) {
		element.removeAttribute("hidden");
	} else {
		element.setAttribute("hidden", "hidden");
	}
}

let toggle_off = (name) => {
	var element = $("#" + name)[0];

	let hidden = element.getAttribute("hidden");
	if (!hidden) {
		element.setAttribute("hidden", "hidden");
	}
}

let toggle_on = (name) => {
	var element = $("#" + name)[0];

	let hidden = element.getAttribute("hidden");
	if (hidden) {
		element.removeAttribute("hidden");
	}
}

//Startseiten explanationen toggle
function neural_network_explanation(){
	$(".tab").hide();
	$("#neural_network_explanation_tab").show();

	highlight("neural_network_explanation_link");

	un_highlight("layer_explanation_link");
	un_highlight("forward_propagation_link");
	un_highlight("training_link");
}

function layer_explanation(){
	$(".tab").hide();
	$("#layer_explanation_tab").show();

	highlight("layer_explanation_link");

	un_highlight("neural_network_explanation_link");
	un_highlight("forward_propagation_link");
	un_highlight("training_link");
}

function forward_propagation_explanation(){
	$(".tab").hide();
	$("#forward_propagation_explanation_tab").show();

	highlight("forward_propagation_link");

	un_highlight("neural_network_explanation_link");
	un_highlight("layer_explanation_link");
	un_highlight("training_link");
}

function training_explanation(){
	$(".tab").hide();
	$("#training_explanation_tab").show();

	highlight("training_link");

	un_highlight("neural_network_explanation_link");
	un_highlight("layer_explanation_link");
	un_highlight("forward_propagation_link");
}

//Startseite "Tab" highlight
function highlight(name) {
	var tab = $("#" + name)[0];

	tab.classList.add("navbarSelected");
}

function un_highlight(name) {
	var tab = $("#" + name)[0];

	tab.classList.remove("navbarSelected");
}

//Ladebalken
var update_progress_bar = async function () {
	document.getElementById("progress").value += 1;
	document.getElementById("progress-text").innerHTML = document.getElementById("progress").value + "</green>/" + nr_epochs + "<br>"
}

//Ladebalken verschwindet / Button erscheint
var training_end = async function(){
	$("#auswertung_anzeigen").show();
	$("#close_button").show();
	$("#progress").hide();
	$("#progress-text").hide();
}

//Confusion Matrix als Text
function matrix_texts() {
	var confusion_matrix_data = asanai.confusion_matrix_data;

	var _keys = asanai.get_labels();
	var correctly_predicted = 0;
	var nr_correct_imgs_per_cat = {};

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];
		if(!confusion_matrix_data) {
			console.error("confusion_matrix_data empty");
		} else if (!Object.keys(confusion_matrix_data).includes(_first_key)) {
			console.error(`confusion_matrix_data does not contain ${_first_key}`, confusion_matrix_data);
		} else if(confusion_matrix_data[_first_key][_first_key]) {
			correctly_predicted += confusion_matrix_data[_first_key][_first_key];
		}
	}

	var total_nr_images = 0

	var num_categories_went_through = 0;

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = 0;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			if(confusion_matrix_data[_first_key][_second_key] !== undefined) {
				this_cat_nr_imgs += confusion_matrix_data[_first_key][_second_key];
			}
		}

		assert(typeof(this_cat_nr_imgs) == "number" && !Number.isNaN(this_cat_nr_imgs), `this_cat_nr_imgs is not a number but ${typeof(this_cat_nr_imgs)}, ${this_cat_nr_imgs}`);

		nr_correct_imgs_per_cat[_first_key] = this_cat_nr_imgs;

		total_nr_images += this_cat_nr_imgs;

		assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(A) total_nr_images is not a number but ${typeof(total_nr_images)}, ${total_nr_images}`);

		num_categories_went_through++;
	}

	//log("confusion_matrix_data:", confusion_matrix_data);
	//log("nr_correct_imgs_per_cat:", nr_correct_imgs_per_cat);

	assert(num_categories_went_through == asanai.get_labels().length, "Went through a different number of categories (${num_categories_went_through}) than asanai.get_labels().length ({asanai.get_labels().length})")
	assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(B) total_nr_images is not a number but ${typeof(total_nr_images)}`);
	assert(total_nr_images > 0, `total_nr_images is smaller than 1: ${total_nr_images}`);
	assert(typeof(correctly_predicted) == "number", `correctly_predicted is not a number but ${typeof(correctly_predicted)}`);

	var percentage = Math.round(correctly_predicted/total_nr_images * 100);

	assert(typeof(percentage) == "number" && !Number.isNaN(percentage), `percentage is not a number but ${typeof(percentage)}, percentage: ${percentage}, correctly_predicted: ${correctly_predicted}, total_nr_images: ${total_nr_images}`);

	var last_msg = `${trm("total_predictions")} <green>${correctly_predicted}</green> ${trm("of")} ${total_nr_images} ${trm("images_recognized_properly")}. <br>${trm("this_means")}<green>${percentage}%</green> ${trm("were_detected_correctly")}.`;

	//$("#matrix_text").html(last_msg);

	var table_string = "<tr>";

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = nr_correct_imgs_per_cat[_first_key];

		var nr_correct_category = confusion_matrix_data[_first_key][_first_key];

		if(nr_correct_category === undefined) {
			nr_correct_category = 0;
		}

		var color_got = `<green>${nr_correct_category}</green>`;
		if (nr_correct_category != this_cat_nr_imgs) {
			color_got = `<red>${nr_correct_category}</red>`;
		}

		var _first_key_uppercase = _first_key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


		var _matrix_string = `${trm("the_training_for")} <b>${_first_key_uppercase}</b> ${trm("resulted_in")}: <br>${color_got} ${trm("of")} <green>${this_cat_nr_imgs}</green> ${trm("images_from_category")} <b>${_first_key_uppercase}</b> ${trm("were_detected_properly")}.<br>\n`;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			var _nr = confusion_matrix_data[_first_key][_second_key]
			var _second_key_uppercase = _second_key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

			if(_nr === undefined) {
				_nr = 0;
			}

			var nr_string = _nr;
			if(_nr != this_cat_nr_imgs) {
				nr_string = `<red>${_nr}</red>`
			}

			if(_first_key != _second_key) {
				var new_line = `${nr_string} ${trm("images_of_category")} <b>${_first_key_uppercase}</b> ${trm("was_detected_as_category")} <b>${_second_key_uppercase}</b> ${trm("erkannt_german_only")}.<br>\n`;
				_matrix_string += new_line;
			}
		}

		//var _matrix_col_name = `#matrix_text_${md5(_first_key.toLowerCase())}`;
		//assert($(_matrix_col_name).length >= 1, `Could not find ${_matrix_col_name}`)
		//$(_matrix_col_name).html(_matrix_string)
		
		table_string += `<td>${_matrix_string}</td>`;
	}

	table_string += "</tr>"

	table_string += `<tr><td colspan="${_keys.length}">${last_msg}</td></tr>`;

	var $analysis = $("#auswertung_element");

	if($analysis.length) {
		$analysis.html(table_string).show();

		update_translations();
	} else {
		console.error(`$("#auswertung_element") was empty!`);
	}
}

function initialize_keyboard(elem) {
	keyboard = window.SimpleKeyboard.default;


	function onChange(input) {
		elem.value = input;

		update_after_relevant_change();
	}

	function onKeyPress(button) {
		console.log("Button pressed", button);

		if(button == "{backspace}") {
			log("elem.value before:", elem.value);
			elem.value = elem.value.substring(0, elem.value.length - 1);
			log("elem.value after:", elem.value);
		} else if(button == "{deleteall}") {
			elem.value = "";
		} else if(button == "{closekeyboard}") {
			myKeyboard.destroy();
		}

		$(elem).focus();

		update_after_relevant_change();
	}

	myKeyboard = new keyboard({
		onChange: input => onChange(input),
		onKeyPress: button => onKeyPress(button),
		mergeDisplay: true,
		layoutName: "default",
		layout: {
			default: [
				"1 2 3 4 5 6 7 8 9 0 {closekeyboard}",
				"q w e r t z u i o p ü",
				"a s d f g h j k l ö ä",
				"y x c v b n m",
				"{deleteall} {space} {backspace}"
			]
		},
		display: {
			"{backspace}": "⌫",
			"{closekeyboard}": "❌",
			"{deleteall}": "🗑️"
		}
	});
}

function hide_keyboard (elem) {
	$(".simple-keyboard").hide();
}

function show_keyboard (elem) {
	if(myKeyboard) {
		myKeyboard.destroy();
	}

	initialize_keyboard(elem);

	$(".simple-keyboard").show();
}

function delete_category (elem) {
	if($(".category_name").length > 1) {
		$(elem).parent().parent().remove()
	} else {
		log("Cannot delete last element")
	}	

	update_after_relevant_change();
}

function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
		(+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
	);
}

function getNextAvailableCategory() {
	var existingCategories = [];

	$(".category_name").each(function(i, e) {
		var value = $(e).val();

		existingCategories.push(value);
	});

	existingCategories.sort();

	var nextCategory = 1;
	var category_name = `Kategorie ${nextCategory}`;

	while (existingCategories.includes(category_name)) {
		nextCategory++;
		category_name = `Kategorie ${nextCategory}`;
	}

	return nextCategory;
}

function addCustomCategory() {
	// Get the target row element by its ID
	var rowElement = document.getElementById('custom_images');

	let catN = getNextAvailableCategory();
	// Count existing categories to generate the category name
	var categoryName = language[lang]["category"] + ' ' + catN;

	// Generate a unique ID for the thumbnail container
	var thumbnailContainerId = 'thumbnailContainer_' + uuidv4();

	// Define the new td content
	var newCategoryContent = `
		<div class="class_ui">
		<button class="take_image box" onclick="generateThumbnail('${thumbnailContainerId}')"> </button>
		&#9998;<input class="category_name" onclick="show_keyboard(this)" onblur="myKeyboard.destroy()" placeholder="${categoryName}" onkeyup="update_after_relevant_change()" onchange="update_after_relevant_change()" value="${categoryName}" />
		<p class="custom_img_error" id="${'cat'+catN}"></p>
		<button class="delete_single_image_button box" onclick="delete_category(this)"></button>
		</div>
		<div class="thumbnail_container" id="${thumbnailContainerId}"></div>
	`;

	// Create a new table element
	var newTableElement = document.createElement('table');
	newTableElement.innerHTML = newCategoryContent;
	newTableElement.setAttribute('class', 'custom_images_category');

	// Append the new table directly to the rowElement (which is the existing <td>)
	rowElement.appendChild(newTableElement);

	update_after_relevant_change();
}


function is_tablet () {
	var userAgent = navigator.userAgent.toLowerCase();
	var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

	return isTablet;
}

function is_touch_device () {
	if(is_touch_device_cache !== null) {
		return is_touch_device_cache;
	}

	var res = (("ontouchstart" in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));

	if(!res) {
		res = !!window.matchMedia("(pointer: coarse)").matches;
	}

	is_touch_device_cache = res;

	return res;
}

function get_cursor_or_none (cursorname) {
	try {
		if(is_touch_device() && is_tablet()) {
			return "none";
		}
	} catch (e) {
		if(("" + e).includes("is_touch_device is not defined")) {
			return cursorname;
		}
	}

	return cursorname;
}

function getCustomCategoryNames() {
	// Array, um die Werte der Kategorie-Namen zu speichern
	var categoryNames = [];

	// Durch alle Elemente mit der Klasse .category_name iterieren
	$('.category_name').each(function() {
		// Den Wert des aktuellen Elements abrufen und zum Array hinzufügen
		var value = $(this).val();
		categoryNames.push(value);
	});

	// Das Array mit den Werten kann jetzt verwendet werden
	return categoryNames;
}

function update_after_relevant_change () {
	$(".custom_images_category").each((i, e) => {
		var name = $(e).find("input").val();

		if(!name) {
			name = "<i>Leerer Name</i>";
		} else {
			name = `<i>${name}</i>`;
		}

		$(e).find(".category_name_shower").html(name);
	});

	enable_or_disable_training_if_needed();
}

function count_custom_image_categories (ret) {
	$(".custom_images_category").each((i, e) => {
		var imgs_in_this_cat = $(e).find("img");
		var cat_name = $(e).find("input").val();

		if (imgs_in_this_cat.length < required_nr_images_per_category) {
			let iMissing = required_nr_images_per_category - imgs_in_this_cat.length;
			if(iMissing > 1){
				$("#cat" + (i+1)).html(`<span class="TRANSLATEME_still"></span> ${required_nr_images_per_category - imgs_in_this_cat.length} <span class="TRANSLATEME_images_required"></span>`).show();
			} else {
				$("#cat" + (i+1)).html(`<span class="TRANSLATEME_still"></span> ${required_nr_images_per_category - imgs_in_this_cat.length} <span class="TRANSLATEME_image_required"></span>`).show();
			}
			
			ret = false;

			update_translations();
		} else {
			$("#cat" + (i+1)).html("").hide();
		}
	});

	return ret;
}

function shouldCustomTrainingBeEnabled(_custom_categories=[]) {
	if(!_custom_categories || _custom_categories.length == 0 || !Array.isArray(_custom_categories)) {
		_custom_categories = getCustomCategoryNames();
	}

	var errors = [];
	var ret = true;

	var _custom_categories_has_duplicates = new Set(_custom_categories).size !== _custom_categories.length;

	if(_custom_categories_has_duplicates) {
		errors.push(trm("some_category_names_are_equal"));
		ret = false;
	}

	if(!_custom_categories) {
		errors.push(trm("list_of_category_names_was_empty"));
		ret = false;
	}

	if(_custom_categories.length < 2) {
		errors.push(`${trm('there_have_to_be_at_least_two_categories')}.`);

		ret = false;
	}

	if(_custom_categories.length <= 2) {
		$(".delete_single_image_button").hide();
	} else {
		$(".delete_single_image_button").show();
	}

	ret = count_custom_image_categories(ret);

	var shown_empty_warning = false;

	for (var i = 0; i < _custom_categories.length; i++) {
		if(_custom_categories[i] == "") {
			if(!shown_empty_warning) {
				errors.push("Mindestens einer der Kategoriennamen war leer");
				shown_empty_warning = true;
			}
			ret = false;
		}
	}

	if(errors.length > 0) {
		var errors_string = `${trm('the_following_problems_must_be_solved_before_training')}:<br>`;
		if(errors.length == 1) {
			errors_string += `<br>${errors[0]}\n`;
		} else {
			errors_string += "<ul>";

			for (var i = 0; i < errors.length; i++) {
				errors_string += `\t<li>${errors[i]}</li>\n`;
			}

			errors_string += "</ul>";

		}

		$("#show_errors").html(errors_string).show();

		update_translations();
	} else {
		$("#show_errors").html("").hide();
	}

	return ret;
}

function enable_or_disable_training_if_needed() {
	if(shouldCustomTrainingBeEnabled(getCustomCategoryNames())) {
		$("#start_custom_training").css("visibility", "visible");
		$("#start_custom_training").removeClass("disabled_class")
		$("#start_custom_training").removeAttr("disabled")
	} else {
		$("#start_custom_training").css("visibility", "hidden");
		$("#start_custom_training").prop("disabled", true);
		$("#start_custom_training").addClass("disabled_class")
	}
}

async function startCustomTraining () {
	if(myKeyboard) {
		myKeyboard.destroy();
	}

	if(shouldCustomTrainingBeEnabled(getCustomCategoryNames())) {
		$("#custom_images_table").hide();

		return await _start_custom_training(default_optimizer_config);
	} else {
		console.error(`Custom training not enabled.`);
	}
}
