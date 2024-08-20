// Defines the optimizer that should be used for training.
// Can be specified for each model seperately and on-demand, but I chose to do it here, because
// then I don't need to define it in other places.
// You can also build a GUI for this.

var done_loading = false;

function assert(cond, msg) {
	if(!cond) {
		console.error(msg);
	}
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
	{dense: {units: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
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
			translations_file: "translations.json",		// A file containing translations, i. e. in german and english in this casesanai
			optimizer_table_div_name: "optimizer_div",		// A div, in which the settings for the optimizer should be written, so the user may change them
			asanai_object_name: "asanai",				// The name of the variable containing the asanAI object.
			// This is important for things like "onclick"-events and needs to be changed when you use other variable names than
			// `var asanai`.
		});
	} catch (e) {
		if(!("" + e).includes("optimizer_div could not be found")) {
			console.debug(e);
		}
		return;
	}

	//asanai.show_status_bar();

	//asanai.disable_show_bars();

	asanai.set_divide_by(255);

	asanai.set_labels(__categories);

	asanai.set_fcnn_height(400);
	asanai.set_fcnn_width(800);
	asanai.draw_fcnn("fcnn_div", 32, true);
	asanai.enable_fcnn_internals();

	asanai.set_validation_split(0);

	$("#nr_epochs").html(nr_epochs);
	$("#progress").attr("max", nr_epochs);

	done_loading = true;
});

async function load_and_train_scheine_muenzen_schluessel() {
	var model_struct = [
		{conv2d: {filters: 8, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [40, 40, 3] }},
		{conv2d: {filters: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{conv2d: {filters: 2, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{maxPooling2d: {poolSize: [3, 3] }},
		{flatten: {}},
		{dense: {units: 8, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: 4, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: __categories.length, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
	];

	return await _load_example("scheine_muenzen_schluessel", "test_images", 2, model_struct, default_optimizer_config, ["scheine", "muenzen", "schluessel"]);
}

async function load_and_train_fruits_example() {
	return await _load_example("fruits", "test_images", 2, default_model_struct, default_optimizer_config, ["apfel", "banane", "orange"]);
}

async function _load_example(example_name, to_div_name, max_nr, model_struct, optimizer_config, local_categories) {
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
}

function createAuswertungTable(elements) {
	// Entferne alle Inhalte der Tabelle
	$("#auswertung_element").empty();

	// Erste Zeile erstellen
	let firstRow = $("<tr></tr>");
	elements.forEach(function(element) {
		let td = $("<td></td>").addClass("auswertung_element").attr("id", "matrix_text_" + element);
		firstRow.append(td);
	});

	// Zweite Zeile erstellen
	let secondRow = $("<tr></tr>");
	let colspanTd = $("<td></td>").addClass("auswertung_element").attr("id", "matrix_text").attr("colspan", elements.length);
	secondRow.append(colspanTd);

	// Füge beide Zeilen an den Anfang der Tabelle hinzu
	$("#auswertung_element").append(firstRow).append(secondRow);
}

function try_yourself () {
	asanai.show_and_predict_webcam_in_div("webcam_prediction");

	asanai.start_camera();

	$("#matrix_text").hide();
	$("#yourself").hide();
	$("#explanation_after_training").show();

	var _l = asanai.get_labels().map(v => v.toLowerCase());

	for (var k = 0; k < _l.length; k++) {
		$("#matrix_text_" + _l[k]).hide();
	}
}

function start_training_show_divs() {
	$("#box-wide").toggle();
	$("#visualization").toggle();
}

function show_auswertung () {
	var _elems_ids = [
		"auswertung",
		"text_training",
		"evaluation",
		"visualization",
		"matrix_text",
		"test_images",
		"yourself"
	];

	var _l = asanai.get_labels().map(v => v.toLowerCase());

	for (var k = 0; k < _l.length; k++) {
		_elems_ids.push("matrix_text_" + _l[k]);
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

//Startseiten erklärungen toggle
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

	if (tab.style.backgroundColor !== "#003366"){
		tab.style.backgroundColor = "#003366";
		tab.style.color = "white";
	}
}

function un_highlight(name) {
	var tab = $("#" + name)[0];

	if (tab.style.backgroundColor !== "white"){
		tab.style.backgroundColor = "white";
		tab.style.color = "black";
	}
}

//Ladebalken
var update_progress_bar = async function () {
	document.getElementById("progress").value += 1;
	document.getElementById("progress-text").innerHTML = document.getElementById("progress").value + "</green>/" + nr_epochs + "<br>"
}

//Ladebalken verschwindet / Button erscheint
var training_end = async function(){
	toggle(document.getElementById("evaluation"));
	toggle(document.getElementById("progress"));
}

//Confusion Matrix als Text
function matrix_texts(){
	var c_m_d = asanai.confusion_matrix_data;

	var _keys = asanai.get_labels();
	var correctly_predicted = 0;
	var nr_correct_imgs_per_cat = {};

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];
		if(c_m_d[_first_key][_first_key]) {
			correctly_predicted += c_m_d[_first_key][_first_key];
		}
	}

	var total_nr_images = 0

	var num_categories_went_through = 0;

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = 0;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			if(c_m_d[_first_key][_second_key] !== undefined) {
				this_cat_nr_imgs += c_m_d[_first_key][_second_key];
			}
		}

		assert(typeof(this_cat_nr_imgs) == "number" && !Number.isNaN(this_cat_nr_imgs), `this_cat_nr_imgs is not a number but ${typeof(this_cat_nr_imgs)}, ${this_cat_nr_imgs}`);

		nr_correct_imgs_per_cat[_first_key] = this_cat_nr_imgs;

		total_nr_images += this_cat_nr_imgs;

		assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(A) total_nr_images is not a number but ${typeof(total_nr_images)}, ${total_nr_images}`);

		num_categories_went_through++;
	}

	//log("c_m_d:", c_m_d);
	//log("nr_correct_imgs_per_cat:", nr_correct_imgs_per_cat);

	assert(num_categories_went_through == asanai.get_labels().length, "Went through a different number of categories (${num_categories_went_through}) than asanai.get_labels().length ({asanai.get_labels().length})")
	assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(B) total_nr_images is not a number but ${typeof(total_nr_images)}`);
	assert(total_nr_images > 0, `total_nr_images is smaller than 1: ${total_nr_images}`);
	assert(typeof(correctly_predicted) == "number", `correctly_predicted is not a number but ${typeof(correctly_predicted)}`);

	var percentage = Math.round(correctly_predicted/total_nr_images * 100);

	assert(typeof(percentage) == "number" && !Number.isNaN(percentage), `percentage is not a number but ${typeof(percentage)}, percentage: ${percentage}, correctly_predicted: ${correctly_predicted}, total_nr_images: ${total_nr_images}`);

	$("#matrix_text").html(`Es wurden insgesamt <green>${correctly_predicted}</green> von ${total_nr_images} Bildern richtig erkannt. <br>Das entspricht <green>${percentage}%</green>.`);

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = nr_correct_imgs_per_cat[_first_key];

		var nr_correct_category = c_m_d[_first_key][_first_key];

		if(nr_correct_category === undefined) {
			nr_correct_category = 0;
		}

		var color_got = `<green>${nr_correct_category}</green>`;
		if (nr_correct_category != this_cat_nr_imgs) {
			color_got = `<red>${nr_correct_category}</red>`;
		}

		var _first_key_uppercase = _first_key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


		var _matrix_string = `Das Training für <b>${_first_key_uppercase}</b> hat ergeben: <br>${color_got} von <green>${this_cat_nr_imgs}</green> Bildern aus der Kategorie <b>${_first_key_uppercase}</b> wurden richtig erkannt.<br>\n`;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			var _nr = c_m_d[_first_key][_second_key]
			var _second_key_uppercase = _second_key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

			if(_nr === undefined) {
				_nr = 0;
			}

			var nr_string = _nr;
			if(_nr != this_cat_nr_imgs) {
				nr_string = `<red>${_nr}</red>`
			}

			var new_line = `${nr_string} Bilder der Kategorie <b>${_first_key_uppercase}</b> wurden als Kategorie <b>${_second_key_uppercase}</b> erkannt.<br>\n`;
			_matrix_string += new_line;
		}

		var _matrix_col_name = `#matrix_text_${_first_key.toLowerCase()}`;

		assert($(_matrix_col_name).length >= 1, `Could not find ${_matrix_col_name}`)

		//log("_matrix_col_name:", _matrix_col_name, "_matrix_string:", _matrix_string);

		$(_matrix_col_name).html(_matrix_string)
	}
}
