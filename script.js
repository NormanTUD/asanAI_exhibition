// Defines the optimizer that should be used for training.
// Can be specified for each model seperately and on-demand, but I chose to do it here, because
// then I don't need to define it in other places.
// You can also build a GUI for this.

var max_epochs = 100;

var optimizer_config = { optimizer: "adam", loss: "categoricalCrossentropy", "learningRate": 0.001 }

// This variable will hold the asanAI object. Each object can have exactly one model loaded.
// But you can have as many objects as you wish, or, e.g., save them in an array or a dictionary
// or whatever you like or need, just like normal variables/objects (which it absolutely is).

var asanai;

// When the site has fully loaded, initialize the objects
$(document).ready(async function() {
	// Default model:
	// 2 Conv layers, one flatten, 2 dense layers, last one having 4 categories and SoftMax activation function.
	// This allows classification of images into 4 categories.

	var model_data = [
		{conv2d: {filters: 16, kernelSize: [3, 3], inputShape: [20, 20, 3], activation: "relu", kernelInitializer: "glorotUniform"}},
		{conv2d: {filters: 8, kernelSize: [3, 3], activation: "relu", kernelInitializer: "glorotUniform"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu", biasInitializer: "glorotUniform"}},
		{flatten: {}},
		{dense: {units: 32, activation: "relu"}},
		{dense: {units: 16, activation: "relu"}},
		{dense: {units: 8, activation: "relu"}},
		{dense: {units: 3, activation: "softmax"}}
	];

	// Declaration of asanAI-object, which was previously globally defined.

	try {
		asanai = new asanAI({
			model_data: model_data,					// The default model structure that should be loaded
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
	asanai.set_mode("expert");

	// This enables the status bar at the bottom, where a tensor debugger is shown, and also the messages via log, warn and error are shown.
	//asanai.show_status_bar();

	// This is optional, but lets you allow colors of the bars in predictions
	await asanai.set_default_bar_color("yellow")
	await asanai.set_max_bar_color("red")
	await asanai.set_bar_background_color("#003366")

	// This sets the maximum amount of iterations for "layer visualization images".
	asanai.set_max_activation_iterations(4)

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
});

async function load_test_images_and_train () {
	var __categories = ["Apfel", "Banane", "Orange"];
	var __max_nr = 50; // obwohl 95 bilder da sind, um jeweils  eines pro kategorie (nr 95)  aus dem training auszunehmen und manuell zu predicten
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
		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 20, batchSize: 40, shuffle: true}, {});

		if(history) {
			console.log("history:", history);
		} else {
			console.error("Training failed");
		}

		await asanai.dispose(loaded_data.x);
		await asanai.dispose(loaded_data.y);
	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}
}

function maximally_activate_all_neurons () {
	var model = asanai.get_model();

	var layers = model.layers;

	for (var i = 0; i < layers.length; i++) {
		asanai.draw_maximally_activated_layer(i);
	}
}

async function load_exhib_data_and_train () {
	var _kernel_initializer = "leCunNormal";
	var _bias_initializer = "leCunNormal";


	asanai.set_validation_split(0.1);

	var new_model_struct = [
		{conv2d: {filters: 2, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3], inputShape: [40, 40, 3] }},
		{conv2d: {filters: 2, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{maxPooling2d: {poolSize: [3, 3] }},
		{conv2d: {filters: 2, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer, kernelSize: [3, 3] }},
		{maxPooling2d: {poolSize: [3, 3] }},
		{flatten: {}},
		{dense: {units: 5, activation: "tanh", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}},
		{dense: {units: 3, activation: "softmax", kernelInitializer: _kernel_initializer, biasInitializer: _bias_initializer}}
	];

	asanai.create_model_from_model_data(new_model_struct, { optimizer: "adam", loss: "categoricalCrossentropy", "learningRate": 0.025 });

	await asanai.predict_image("exhib_example_a", "test_image_prediction_exhib_a", true, true);
	await asanai.predict_image("exhib_example_b", "test_image_prediction_exhib_b", true, true);
	await asanai.predict_image("exhib_example_c", "test_image_prediction_exhib_c", true, true);

	var exhib_data = [];

	var __categories = ["Apfel", "Banane", "Orange"];
	//var __max_nr = 94; // 94, obwohl 95 bilder da sind, um jeweils  eines pro kategorie (nr 95)  aus dem training auszunehmen und manuell zu predicten
	var __max_nr = 50; // obwohl 95 bilder da sind, um jeweils  eines pro kategorie (nr 95)  aus dem training auszunehmen und manuell zu predicten

	for (var k = 0; k < __categories.length; k++) {
		var _cat = __categories[k];

		for (var l = 1; l <= __max_nr; l++) {
			var this_path = `traindata/signs/${_cat}/${_cat}_${l}.jpg`

			exhib_data.push([this_path, _cat])
		}
	}

	var loaded_data = await asanai.load_image_urls_to_div_and_tensor("test_images", exhib_data);


	try {
		console.log("loaded data unique and flattened: ", uniqueArray1(loaded_data.x.arraySync().flat().flat().flat()))
	} catch (e) {
		console.error(e)
	}

	if(loaded_data) {
		asanai.visualize_train();
		//Ladebalken über 100 Epochen
		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: max_epochs, batchSize: 40, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
		if(history) {
			console.log("history:", history);
		} else {
			console.error("Training failed");
		}

		await asanai.dispose(loaded_data.x);
		await asanai.dispose(loaded_data.y);
	} else {
		console.warn(`loaded_data was undefined! Something went wrong using asanai.load_image_urls_to_div_and_tensor`);
	}
}

function uniqueArray1( ar ) {
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
	}else if (status === 2){
		toggle(document.getElementById("text_training"));
		toggle(document.getElementById("evaluation"));
		toggle(document.getElementById("visualization"));
		toggle(document.getElementById("matrix_text"));
		toggle(document.getElementById("matrix_text_apple"));
		toggle(document.getElementById("matrix_text_orange"));
		toggle(document.getElementById("matrix_text_banana"));
		toggle(document.getElementById("test_images"));
		toggle(document.getElementById("math_tab_code"));
		toggle(document.getElementById("yourself"));
	}else if (status === 3){
		asanai.start_camera();
		toggle(document.getElementById("matrix_text"));
		toggle(document.getElementById("matrix_text_apple"));
		toggle(document.getElementById("matrix_text_orange"));
		toggle(document.getElementById("matrix_text_banana"));
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
	document.getElementById("progress-text").innerHTML = document.getElementById("progress").value + "</grün>/" + max_epochs + "<br><rot>"
}

//Ladebalken verschwindet / Button erscheint
var training_end = async function(){
	toggle(document.getElementById("evaluation"));
	toggle(document.getElementById("progress"));
}


//Confusion Matrix als Text
function matrix_texts(){
	if (asanai.confusion_matrix_data["Banane"]["Banane"] === undefined){
		asanai.confusion_matrix_data["Banane"]["Banane"] = 0;
	}
	if (asanai.confusion_matrix_data["Orange"]["Banane"] === undefined){
		asanai.confusion_matrix_data["Orange"]["Banane"] = 0;
	}
	if (asanai.confusion_matrix_data["Apfel"]["Banane"] === undefined){
		asanai.confusion_matrix_data["Apfel"]["Banane"] = 0;
	}
	if (asanai.confusion_matrix_data["Banane"]["Apfel"] === undefined){
		asanai.confusion_matrix_data["Banane"]["Apfel"] = 0;
	}
	if (asanai.confusion_matrix_data["Apfel"]["Apfel"] === undefined){
		asanai.confusion_matrix_data["Apfel"]["Apfel"] = 0;
	}
	if (asanai.confusion_matrix_data["Orange"]["Apfel"] === undefined){
		asanai.confusion_matrix_data["Orange"]["Apfel"] = 0;
	}
	if (asanai.confusion_matrix_data["Banane"]["Orange"] === undefined){
		asanai.confusion_matrix_data["Banane"]["Orange"] = 0;
	}
	if (asanai.confusion_matrix_data["Apfel"]["Orange"] === undefined){
		asanai.confusion_matrix_data["Apfel"]["Orange"] = 0;
	}
	if (asanai.confusion_matrix_data["Orange"]["Orange"] === undefined){
		asanai.confusion_matrix_data["Orange"]["Orange"] = 0;
	}

	var richtig = asanai.confusion_matrix_data["Banane"]["Banane"] + asanai.confusion_matrix_data["Orange"]["Orange"] + asanai.confusion_matrix_data["Apfel"]["Apfel"];
	var prozent = Math.round(richtig/1.2);

	document.getElementById("matrix_text").innerHTML = "Es wurden insgesamt <grün>"
		+ richtig
		+ "</grün>  von 120 Bildern richtig erkannt. <br>"
		+ "Das entspricht <grün>"
		+ prozent
		+ "%.</grün>";

	document.getElementById("matrix_text_banana").innerHTML = "Das Training für Bananen hat ergeben: <br><grün>"
		+ asanai.confusion_matrix_data["Banane"]["Banane"]
		+ "</grün> von 40 Bananen wurden richtig erkannt. <br><rot>"
		+ asanai.confusion_matrix_data["Banane"]["Apfel"]
		+ "</rot> Bananen wurden als Apfel erkannt, <br><rot>"
		+ asanai.confusion_matrix_data["Banane"]["Orange"]
		+ "</rot> Bananen wurden als Orange erkannt. <br>";

	document.getElementById("matrix_text_orange").innerHTML = "Das Training für Orangen hat ergeben: <br><grün>"
		+ asanai.confusion_matrix_data["Orange"]["Orange"]
		+ "</grün> von 40 Orangen wurden richtig erkannt. <br><rot>"
		+ asanai.confusion_matrix_data["Orange"]["Apfel"]
		+ "</rot> Orangen wurden als Apfel erkannt, <br><rot>"
		+ asanai.confusion_matrix_data["Orange"]["Banane"]
		+ "</rot> Orangen wurden als Banane erkannt. <br>";

	document.getElementById("matrix_text_apple").innerHTML = "Das Training für Äpfel hat ergeben: <br><grün>"
		+ asanai.confusion_matrix_data["Apfel"]["Apfel"]
		+ "</grün> von 40 Äpfel wurden richtig erkannt. <br><rot>"
		+ asanai.confusion_matrix_data["Apfel"]["Banane"]
		+ "</rot> Äpfel wurden als Banane erkannt, <br><rot>"
		+ asanai.confusion_matrix_data["Apfel"]["Orange"]
		+ "</rot> Äpfel wurden als Orange erkannt. <br>";
}
