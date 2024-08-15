// Defines the optimizer that should be used for training.
// Can be specified for each model seperately and on-demand, but I chose to do it here, because
// then I don't need to define it in other places.
// You can also build a GUI for this.

function assert(cond, msg) {
	if(!cond) {
		console.error(msg);
	}
}

var log = console.log;

var max_epochs = 30;
var max_nr_images = 5;
var batch_size = 200;

var optimizer_config = { optimizer: "adam", loss: "categoricalCrossentropy", "learningRate": 0.001 }

// This variable will hold the asanAI object. Each object can have exactly one model loaded.
// But you can have as many objects as you wish, or, e.g., save them in an array or a dictionary
// or whatever you like or need, just like normal variables/objects (which it absolutely is).

var asanai;

var _kernel_initializer = "leCunNormal";
var _bias_initializer = "leCunNormal";

var model_struct = [
	{conv2d: {filters: 16, activation: "relu", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [40, 40, 3] }},
	{conv2d: {filters: 8, activation: "relu", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
	{conv2d: {filters: 4, activation: "relu", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
	{maxPooling2d: {poolSize: [3, 3] }},
	{flatten: {}},
	{dense: {units: 8, activation: "sigmoid", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
	{dense: {units: 4, activation: "sigmoid", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
	{dense: {units: 3, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
];

// When the site has fully loaded, initialize the objects
$(document).ready(async function() {
	try {
		asanai = new asanAI({
			model_data: model_struct,					// The default model structure that should be loaded
			optimizer_config: optimizer_config,			// The config for the optimizer (which trains the model)
			translations_file: "translations.json",		// A file containing translations, i. e. in german and english in this case
			optimizer_table_div_name: "optimizer_div",		// A div, in which the settings for the optimizer should be written, so the user may change them
			asanai_object_name: "asanai",				// The name of the variable containing the asanAI object.
			// This is important for things like "onclick"-events and needs to be changed when you use other variable names than
			// `var asanai`.
			//math_tab_code_div: "math_tab_code"			// When commented in, this looks for a div with the id `math_tab_code`, and automatically writes the math mode contents to it.
		});
	} catch (e) {
		if(!("" + e).includes("optimizer_div could not be found")) {
			console.debug(e);
		}
		return;
	}

	// This sets the mode, there is expert and beginner. This is not used anywhere (yet)
	//asanai.set_mode("expert");

	// This enables the status bar at the bottom, where a tensor debugger is shown, and also the messages via log, warn and error are shown.
	//asanai.show_status_bar();

	// This is optional, but lets you allow colors of the bars in predictions
	//await asanai.set_default_bar_color("yellow")
	//await asanai.set_max_bar_color("red")
	//await asanai.set_bar_background_color("#003366")

	// This sets the maximum amount of iterations for "layer visualization images".
	//asanai.set_max_activation_iterations(4)

	// This sets the number the input is divided by by default, so that, for example, images. whose values are between 0 and 255, get shrinked to 0 and 1.
	// This makes training more effective in many cases.
	asanai.set_divide_by(255);

	// With this, you can set the labels that are used all throughout the GUI whenever it shows which categories are there or predicts something
	asanai.set_labels(["Apfel", "Banane", "Orange"]);

	// The first parameter to show_internals is the id-name of a div, in which the internals are printed.
	// Internals are that which you see as input/output of each layer/neuron, which are visualized to make it easier to understand what the network does.
	// The second parameter allows you to enable (1) or disable (0) the size sliders for neurons/outputs
	//asanai.show_internals("internal_states", 1);

	// Hide internals, when called, hides the internals again after they've been shown
	//asanai.hide_internals();

	// draw_fcnn shows the FCNN style visualization the a div with the provided ID.
	asanai.set_fcnn_height(300);
	asanai.set_fcnn_width(700);
	asanai.draw_fcnn("fcnn_div", 32, true);

	// Shows the output of model.summary in a div.
	//asanai.write_model_summary("summary")

	asanai.show_and_predict_webcam_in_div("webcam_prediction");

	//await asanai.predict_image("test_image", "test_image_prediction", true, true);
	//await asanai.predict_image("test_image_two", "test_image_two_prediction", true, true);

	//asanai.write_tensors_info("memory");

	$('#enable-btn').click(function() {
		$('#del-table-btn').enable();
		$('#del-page-btn').enable();
		$('#save-btn').enable();
		$('#other-btn-2').enable();

		$('#enable-btn').hide();
		$('#disable-btn').show();
	});

	$('#disable-btn').click(function() {
		$('#del-table-btn').disable();
		$('#del-page-btn').disable();
		$('#save-btn').disable();
		$('#other-btn-2').disable();

		$('#disable-btn').hide();
		$('#enable-btn').show();
	});

	// enable live view of nn
	asanai.enable_fcnn_internals();

	$("#nr_epochs").html(max_epochs);
});

async function load_test_images_and_train () {
	var __categories = ["Apfel", "Banane", "Orange"];
	var __max_nr = max_nr_images; // obwohl 95 bilder da sind, um jeweils eines pro kategorie (nr 95) aus dem training auszunehmen und manuell zu predicten
	var exhib_data = [];

	for (var k = 0; k < __categories.length; k++) {
		var _cat = __categories[k];

		for (var l = 1; l <= __max_nr; l++) {
			var this_path = `traindata/signs/${_cat}/${_cat}_${l}.jpg`

			exhib_data.push([this_path, _cat])
		}
	}

	var loaded_data = asanai.load_image_urls_to_div_and_tensor("test_images", exhib_data);

	if(loaded_data) {
		asanai.visualize_train();
		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 20, batchSize: batch_size, shuffle: true}, {});

		if(history) {
			log("history:", history);
		} else {
			console.error("Training failed");
		}

		await asanai.dispose(loaded_data.x);
		await asanai.dispose(loaded_data.y);
	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}
}

async function load_exhib_data_and_train () {
	asanai.set_validation_split(0.1);

	asanai.create_model_from_model_data(model_struct, { optimizer: "adam", loss: "categoricalCrossentropy", "learningRate": 0.025 });

	var exhib_data = [];

	var __categories = ["Apfel", "Banane", "Orange"];
	//var __max_nr = 94; // 94, obwohl 95 bilder da sind, um jeweils eines pro kategorie (nr 95) aus dem training auszunehmen und manuell zu predicten
	var __max_nr = max_nr_images; // obwohl 95 bilder da sind, um jeweils eines pro kategorie (nr 95) aus dem training auszunehmen und manuell zu predicten

	for (var k = 0; k < __categories.length; k++) {
		var _cat = __categories[k];

		for (var l = 1; l <= __max_nr; l++) {
			var this_path = `traindata/signs/${_cat}/${_cat}_${l}.jpg`

			exhib_data.push([this_path, _cat])
		}
	}

	var loaded_data = await asanai.load_image_urls_to_div_and_tensor("test_images", exhib_data);

	try {
		log("loaded data unique and flattened: ", uniqueArray(loaded_data.x.arraySync().flat().flat().flat()))
	} catch (e) {
		console.error(e)
	}

	if(loaded_data) {
		asanai.visualize_train();
		//Ladebalken über max_epochs Epochen
		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: max_epochs, batchSize: batch_size, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
		if(history) {
			log("history:", history);
		} else {
			console.error("Training failed");
		}

		await asanai.dispose(loaded_data.x);
		await asanai.dispose(loaded_data.y);
	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}
}

function uniqueArray( ar ) {
	var j = {};

	ar.forEach( function(v) {
		j[v+ '::' + typeof v] = v;
	});

	return Object.keys(j).map(function(v){
		return j[v];
	});
}

function toggle_button2() {
	let element = document.getElementById("hiddenButton");
	toggle(element);
}

//Anzeigen/Verstecken von Dingen auf Seite 11_Test_Images
function toggle_button(status) {
	if (status === 1) {
		toggle(document.getElementById("box-wide"));
		toggle(document.getElementById("visualization"));
	} else if (status === 2) {
		toggle(document.getElementById("text_training"));
		toggle(document.getElementById("evaluation"));
		toggle(document.getElementById("visualization"));
		toggle(document.getElementById("matrix_text"));
		toggle(document.getElementById("matrix_text_apfel"));
		toggle(document.getElementById("matrix_text_orange"));
		toggle(document.getElementById("matrix_text_banane"));
		toggle(document.getElementById("test_images"));
		toggle(document.getElementById("math_tab_code"));
		toggle(document.getElementById("yourself"));
	} else if (status === 3) {
		asanai.start_camera();
		toggle(document.getElementById("matrix_text"));
		toggle(document.getElementById("matrix_text_apfel"));
		toggle(document.getElementById("matrix_text_orange"));
		toggle(document.getElementById("matrix_text_banane"));
		toggle(document.getElementById("yourself"));
		toggle(document.getElementById("status_3"));
		toggle(document.getElementById("internal"));
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

let toggle_off = (element) => {
	let hidden = element.getAttribute("hidden");
	if (hidden) {} else {
		element.setAttribute("hidden", "hidden");
	}
}

let toggle_on = (element) => {
	let hidden = element.getAttribute("hidden");
	if (hidden) {
		element.removeAttribute("hidden");
	}
}

//Startseiten erklärungen toggle
function button1(){
	toggle_on(document.getElementById("text1"));
	toggle_off(document.getElementById("text2"));
	toggle_off(document.getElementById("text3"));
	toggle_off(document.getElementById("text4"));
	toggle_on(document.getElementById("bild1"));
	toggle_off(document.getElementById("bild2"));
	toggle_off(document.getElementById("bild3"));
	toggle_off(document.getElementById("bild4"));
	highlight(document.getElementById("icon1"));
	un_highlight(document.getElementById("icon2"));
	un_highlight(document.getElementById("icon3"));
	un_highlight(document.getElementById("icon4"));
}

function button2(){
	toggle_off(document.getElementById("text1"));
	toggle_on(document.getElementById("text2"));
	toggle_off(document.getElementById("text3"));
	toggle_off(document.getElementById("text4"));
	toggle_off(document.getElementById("bild1"));
	toggle_on(document.getElementById("bild2"));
	toggle_off(document.getElementById("bild3"));
	toggle_off(document.getElementById("bild4"));
	highlight(document.getElementById("icon2"));
	un_highlight(document.getElementById("icon1"));
	un_highlight(document.getElementById("icon3"));
	un_highlight(document.getElementById("icon4"));
}

function button3(){
	toggle_off(document.getElementById("text1"));
	toggle_off(document.getElementById("text2"));
	toggle_on(document.getElementById("text3"));
	toggle_off(document.getElementById("text4"));
	toggle_off(document.getElementById("bild1"));
	toggle_off(document.getElementById("bild2"));
	toggle_on(document.getElementById("bild3"));
	toggle_off(document.getElementById("bild4"));
	highlight(document.getElementById("icon3"));
	un_highlight(document.getElementById("icon1"));
	un_highlight(document.getElementById("icon2"));
	un_highlight(document.getElementById("icon4"));
}

function button4(){
	toggle_off(document.getElementById("text1"));
	toggle_off(document.getElementById("text2"));
	toggle_off(document.getElementById("text3"));
	toggle_on(document.getElementById("text4"));
	toggle_off(document.getElementById("bild1"));
	toggle_off(document.getElementById("bild2"));
	toggle_off(document.getElementById("bild3"));
	toggle_on(document.getElementById("bild4"));
	highlight(document.getElementById("icon4"));
	un_highlight(document.getElementById("icon1"));
	un_highlight(document.getElementById("icon2"));
	un_highlight(document.getElementById("icon3"));
}

//Startseite "Tab" highlight
function highlight(tab) {
	if (tab.style.backgroundColor !== "#003366"){
		tab.style.backgroundColor = "#003366";
		tab.style.color = "white";
	}
}

function un_highlight(tab) {
	if (tab.style.backgroundColor !== "white"){
		tab.style.backgroundColor = "white";
		tab.style.color = "black";
	}
}

//Ladebalken
var update_progress_bar = async function () {
	document.getElementById("progress").value += 1;
	document.getElementById("progress-text").innerHTML = document.getElementById("progress").value + "</green>/" + max_epochs + "<br><rot>"
}

//Ladebalken verschwindet / Button erscheint
var training_end = async function(){
	toggle(document.getElementById("evaluation"));
	toggle(document.getElementById("progress"));
}


//Confusion Matrix als Text
function matrix_texts(){
	var cmd = asanai.confusion_matrix_data;

	var _keys = asanai.get_labels();

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];
		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];

			if (cmd[_first_key][_second_key] === undefined){
				cmd[_second_key][_second_key] = 0;
			}
		}
		
	}

	var correctly_predicted = 0;
	var nr_correct_imgs_per_cat = {};

	log("cmd:", cmd);

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];
		correctly_predicted += cmd[_first_key][_first_key];
	}

	assert(typeof(correctly_predicted) == "number", `correctly_predicted is not a number but ${typeof(correctly_predicted)}`);


	var total_nr_images = 0

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = 0;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			if(cmd[_first_key][_second_key]) {
				this_cat_nr_imgs += cmd[_first_key][_second_key];
			}
		}

		assert(typeof(this_cat_nr_imgs) == "number" && !Number.isNaN(this_cat_nr_imgs), `this_cat_nr_imgs is not a number but ${typeof(this_cat_nr_imgs)}, ${this_cat_nr_imgs}`);

		nr_correct_imgs_per_cat[_first_key] = this_cat_nr_imgs;

		total_nr_images += this_cat_nr_imgs;

		assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(A) total_nr_images is not a number but ${typeof(total_nr_images)}, ${total_nr_images}`);
	}

	assert(typeof(total_nr_images) == "number" && !Number.isNaN(total_nr_images), `(B) total_nr_images is not a number but ${typeof(total_nr_images)}`);
	assert(total_nr_images > 0, `total_nr_images is smaller than 1: ${total_nr_images}`);

	var percentage = Math.round(correctly_predicted/total_nr_images * 100);

	assert(typeof(percentage) == "number", `percentage is not a number but ${typeof(percentage)}`);

	$("#matrix_text").html(`Es wurden insgesamt <green>${correctly_predicted}</green> von ${total_nr_images} Bildern richtig erkannt. <br>Das entspricht <green>${percentage}%</green>.`);

	for (var first_key_idx = 0; first_key_idx < _keys.length; first_key_idx++) {
		var _first_key = _keys[first_key_idx];

		var this_cat_nr_imgs = nr_correct_imgs_per_cat[_first_key];

		var _matrix_string = `Das Training für '${_first_key}' hat ergeben: <br><green>${cmd[_first_key][_first_key]}</green> von ${this_cat_nr_imgs} Bildern aus der Kategorie '${_first_key}' wurden richtig erkannt.<br>\n`;

		for (var second_key_idx = 0; second_key_idx < _keys.length; second_key_idx++) {
			var _second_key = _keys[second_key_idx];
			if(_second_key != _first_key) {
				var _nr = cmd[_first_key][_second_key]
				if(_nr === undefined) {
					_nr = 0;
				}

				var new_line = `<rot>${_nr}</rot> Bilder der Kategorie '${_first_key}' wurden als Kategorie '${_second_key}' erkannt.<br>\n`;
				_matrix_string += new_line;
			}
		}

		var _matrix_col_name = `#matrix_text_${_first_key.toLowerCase()}`;

		assert($(_matrix_col_name).length >= 1, `Could not find ${_matrix_col_name}`)

		log("_matrix_col_name:", _matrix_col_name, "_matrix_string:", _matrix_string);

		$(_matrix_col_name).html(_matrix_string)

	}
}
