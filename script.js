// Defines the optimizer that should be used for training.
// Can be specified for each model seperately and on-demand, but I chose to do it here, because
// then I don't need to define it in other places.
// You can also build a GUI for this.

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
	asanai.write_model_summary("summary")

	asanai.show_and_predict_webcam_in_div("webcam_prediction");

	//await asanai.predict_image("test_image", "test_image_prediction", true, true);
	//await asanai.predict_image("test_image_two", "test_image_two_prediction", true, true);

	asanai.write_tensors_info("memory");

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

function test_model_switch () {
	var fl = tf.layers.dense({units: 3, activation: "softmax", inputShape: [20, 20, 3]});
	var xxx = tf.sequential({layers: [fl]});
	xxx.compile(optimizer_config);
	asanai.set_model(xxx)
}

function test_model_switch_two () {
	var new_model_struct = [
		{conv2d: {filters: 4, kernelSize: [3, 3], inputShape: [20, 20, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{flatten: {}},
		{dense: {units: 5, activation: "relu"}},
		{dense: {units: 4, activation: "softmax"}}
	];

	asanai.create_model_from_model_data(new_model_struct, optimizer_config);
}

function test_model_switch_three () {
	var new_model_struct = [
		{dense: {units: 5, activation: "relu", inputShape: [5]}},
		{dense: {units: 4, activation: "softmax"}}
	];

	asanai.create_model_from_model_data(new_model_struct, optimizer_config);
}

function load_test_images () {
	var loaded_data = asanai.load_image_urls_to_div_and_tensor("test_images", [
		["traindata/signs/Apfel/Apfel_77.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_78.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_79.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_80.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_81.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_82.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_38.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_78.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_64.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_63.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_61.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_88.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_49.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_43.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_41.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_40.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_20.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_18.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_11.jpg", "Apfel"],
		["traindata/signs/Banane/Banane_72.jpg", "Banane"],
		["traindata/signs/Banane/Banane_78.jpg", "Banane"],
		["traindata/signs/Banane/Banane_67.jpg", "Banane"],
		["traindata/signs/Banane/Banane_61.jpg", "Banane"],
		["traindata/signs/Banane/Banane_57.jpg", "Banane"],
		["traindata/signs/Banane/Banane_53.jpg", "Banane"],
		["traindata/signs/Banane/Banane_83.jpg", "Banane"],
		["traindata/signs/Banane/Banane_47.jpg", "Banane"],
		["traindata/signs/Banane/Banane_46.jpg", "Banane"],
		["traindata/signs/Banane/Banane_45.jpg", "Banane"],
		["traindata/signs/Banane/Banane_35.jpg", "Banane"],
		["traindata/signs/Banane/Banane_8.jpg", "Banane"],
		["traindata/signs/Banane/Banane_13.jpg", "Banane"],
		["traindata/signs/Banane/Banane_11.jpg", "Banane"],
		["traindata/signs/Banane/Banane_4.jpg", "Banane"],
		["traindata/signs/Banane/Banane_92.jpg", "Banane"],
		["traindata/signs/Banane/Banane_93.jpg", "Banane"],
		["traindata/signs/Banane/Banane_94.jpg", "Banane"],
		["traindata/signs/Orange/Orange_60.jpg", "Orange"],
		["traindata/signs/Orange/Orange_51.jpg", "Orange"],
		["traindata/signs/Orange/Orange_49.jpg", "Orange"],
		["traindata/signs/Orange/Orange_45.jpg", "Orange"],
		["traindata/signs/Orange/Orange_42.jpg", "Orange"],
		["traindata/signs/Orange/Orange_35.jpg", "Orange"],
		["traindata/signs/Orange/Orange_33.jpg", "Orange"],
		["traindata/signs/Orange/Orange_32.jpg", "Orange"],
		["traindata/signs/Orange/Orange_85.jpg", "Orange"],
		["traindata/signs/Orange/Orange_40.jpg", "Orange"],
		["traindata/signs/Orange/Orange_30.jpg", "Orange"],
		["traindata/signs/Orange/Orange_21.jpg", "Orange"],
		["traindata/signs/Orange/Orange_18.jpg", "Orange"],
		["traindata/signs/Orange/Orange_91.jpg", "Orange"],
		["traindata/signs/Orange/Orange_13.jpg", "Orange"],
		["traindata/signs/Orange/Orange_11.jpg", "Orange"],
		["traindata/signs/Orange/Orange_94.jpg", "Orange"],
		["traindata/signs/Orange/Orange_5.jpg", "Orange"],
	], 1);

	console.log(loaded_data);
}

async function new_model_load_test_images_and_train () {
	var new_model_struct = [
		{conv2d: {filters: 4, kernelSize: [3, 3], inputShape: [50, 50, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{conv2d: {filters: 4, kernelSize: [3, 3], activation: "relu"}},
		{flatten: {}},
		{dense: {units: 10, activation: "relu"}},
		{dense: {units: 5, activation: "softmax"}}
	];

	asanai.create_model_from_model_data(new_model_struct, optimizer_config);

	var loaded_data = asanai.load_image_urls_to_div_and_tensor("test_images", [
		["traindata/signs/Apfel/Apfel_64.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_65.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_66.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_67.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_68.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_69.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_70.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_71.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_72.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_73.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_74.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_75.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_76.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_77.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_78.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_79.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_80.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_81.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_82.jpg", "Apfel"],

		["traindata/signs/Banane/Banane_58.jpg", "Banane"],
		["traindata/signs/Banane/Banane_59.jpg", "Banane"],
		["traindata/signs/Banane/Banane_60.jpg", "Banane"],
		["traindata/signs/Banane/Banane_61.jpg", "Banane"],
		["traindata/signs/Banane/Banane_62.jpg", "Banane"],
		["traindata/signs/Banane/Banane_63.jpg", "Banane"],
		["traindata/signs/Banane/Banane_64.jpg", "Banane"],
		["traindata/signs/Banane/Banane_65.jpg", "Banane"],
		["traindata/signs/Banane/Banane_66.jpg", "Banane"],
		["traindata/signs/Banane/Banane_67.jpg", "Banane"],
		["traindata/signs/Banane/Banane_68.jpg", "Banane"],
		["traindata/signs/Banane/Banane_69.jpg", "Banane"],
		["traindata/signs/Banane/Banane_70.jpg", "Banane"],
		["traindata/signs/Banane/Banane_71.jpg", "Banane"],
		["traindata/signs/Banane/Banane_72.jpg", "Banane"],
		["traindata/signs/Banane/Banane_73.jpg", "Banane"],
		["traindata/signs/Banane/Banane_74.jpg", "Banane"],
		["traindata/signs/Banane/Banane_75.jpg", "Banane"],

		["traindata/signs/Orange/Orange_55.jpg", "Orange"],
		["traindata/signs/Orange/Orange_56.jpg", "Orange"],
		["traindata/signs/Orange/Orange_57.jpg", "Orange"],
		["traindata/signs/Orange/Orange_58.jpg", "Orange"],
		["traindata/signs/Orange/Orange_59.jpg", "Orange"],
		["traindata/signs/Orange/Orange_60.jpg", "Orange"],
		["traindata/signs/Orange/Orange_61.jpg", "Orange"],
		["traindata/signs/Orange/Orange_62.jpg", "Orange"],
		["traindata/signs/Orange/Orange_63.jpg", "Orange"],
		["traindata/signs/Orange/Orange_64.jpg", "Orange"],
		["traindata/signs/Orange/Orange_65.jpg", "Orange"],
		["traindata/signs/Orange/Orange_66.jpg", "Orange"],
		["traindata/signs/Orange/Orange_67.jpg", "Orange"],
		["traindata/signs/Orange/Orange_68.jpg", "Orange"],
		["traindata/signs/Orange/Orange_69.jpg", "Orange"],
		["traindata/signs/Orange/Orange_70.jpg", "Orange"],
		["traindata/signs/Orange/Orange_71.jpg", "Orange"],
		["traindata/signs/Orange/Orange_72.jpg", "Orange"],

		["traindata/signs/Apfel/Apfel_1.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_2.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_3.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_4.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_5.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_6.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_7.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_8.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_9.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_10.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_11.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_12.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_13.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_14.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_15.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_16.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_17.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_18.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_19.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_20.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_21.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_22.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_23.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_24.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_25.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_26.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_27.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_28.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_29.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_30.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_31.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_32.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_33.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_35.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_36.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_37.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_38.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_39.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_40.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_41.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_42.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_43.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_44.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_45.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_46.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_47.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_48.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_49.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_50.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_51.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_52.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_53.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_54.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_55.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_56.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_57.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_58.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_59.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_60.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_61.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_62.jpg", "Apfel"],
		["traindata/signs/Apfel/Apfel_63.jpg", "Apfel"],

		["traindata/signs/Banane/Banane_1.jpg", "Banane"],
		["traindata/signs/Banane/Banane_2.jpg", "Banane"],
		["traindata/signs/Banane/Banane_3.jpg", "Banane"],
		["traindata/signs/Banane/Banane_4.jpg", "Banane"],
		["traindata/signs/Banane/Banane_5.jpg", "Banane"],
		["traindata/signs/Banane/Banane_6.jpg", "Banane"],
		["traindata/signs/Banane/Banane_7.jpg", "Banane"],
		["traindata/signs/Banane/Banane_8.jpg", "Banane"],
		["traindata/signs/Banane/Banane_9.jpg", "Banane"],
		["traindata/signs/Banane/Banane_10.jpg", "Banane"],
		["traindata/signs/Banane/Banane_11.jpg", "Banane"],
		["traindata/signs/Banane/Banane_12.jpg", "Banane"],
		["traindata/signs/Banane/Banane_13.jpg", "Banane"],
		["traindata/signs/Banane/Banane_14.jpg", "Banane"],
		["traindata/signs/Banane/Banane_16.jpg", "Banane"],
		["traindata/signs/Banane/Banane_17.jpg", "Banane"],
		["traindata/signs/Banane/Banane_20.jpg", "Banane"],
		["traindata/signs/Banane/Banane_21.jpg", "Banane"],
		["traindata/signs/Banane/Banane_22.jpg", "Banane"],
		["traindata/signs/Banane/Banane_23.jpg", "Banane"],
		["traindata/signs/Banane/Banane_24.jpg", "Banane"],
		["traindata/signs/Banane/Banane_25.jpg", "Banane"],
		["traindata/signs/Banane/Banane_26.jpg", "Banane"],
		["traindata/signs/Banane/Banane_27.jpg", "Banane"],
		["traindata/signs/Banane/Banane_28.jpg", "Banane"],
		["traindata/signs/Banane/Banane_29.jpg", "Banane"],
		["traindata/signs/Banane/Banane_30.jpg", "Banane"],
		["traindata/signs/Banane/Banane_31.jpg", "Banane"],
		["traindata/signs/Banane/Banane_32.jpg", "Banane"],
		["traindata/signs/Banane/Banane_33.jpg", "Banane"],
		["traindata/signs/Banane/Banane_34.jpg", "Banane"],
		["traindata/signs/Banane/Banane_35.jpg", "Banane"],
		["traindata/signs/Banane/Banane_36.jpg", "Banane"],
		["traindata/signs/Banane/Banane_37.jpg", "Banane"],
		["traindata/signs/Banane/Banane_38.jpg", "Banane"],
		["traindata/signs/Banane/Banane_39.jpg", "Banane"],
		["traindata/signs/Banane/Banane_40.jpg", "Banane"],
		["traindata/signs/Banane/Banane_41.jpg", "Banane"],
		["traindata/signs/Banane/Banane_42.jpg", "Banane"],
		["traindata/signs/Banane/Banane_43.jpg", "Banane"],
		["traindata/signs/Banane/Banane_44.jpg", "Banane"],
		["traindata/signs/Banane/Banane_45.jpg", "Banane"],
		["traindata/signs/Banane/Banane_46.jpg", "Banane"],
		["traindata/signs/Banane/Banane_47.jpg", "Banane"],
		["traindata/signs/Banane/Banane_48.jpg", "Banane"],
		["traindata/signs/Banane/Banane_49.jpg", "Banane"],
		["traindata/signs/Banane/Banane_50.jpg", "Banane"],
		["traindata/signs/Banane/Banane_51.jpg", "Banane"],
		["traindata/signs/Banane/Banane_52.jpg", "Banane"],
		["traindata/signs/Banane/Banane_53.jpg", "Banane"],
		["traindata/signs/Banane/Banane_54.jpg", "Banane"],
		["traindata/signs/Banane/Banane_55.jpg", "Banane"],
		["traindata/signs/Banane/Banane_56.jpg", "Banane"],
		["traindata/signs/Banane/Banane_57.jpg", "Banane"],

		["traindata/signs/Orange/Orange_1.jpg", "Orange"],
		["traindata/signs/Orange/Orange_2.jpg", "Orange"],
		["traindata/signs/Orange/Orange_3.jpg", "Orange"],
		["traindata/signs/Orange/Orange_4.jpg", "Orange"],
		["traindata/signs/Orange/Orange_5.jpg", "Orange"],
		["traindata/signs/Orange/Orange_6.jpg", "Orange"],
		["traindata/signs/Orange/Orange_7.jpg", "Orange"],
		["traindata/signs/Orange/Orange_8.jpg", "Orange"],
		["traindata/signs/Orange/Orange_9.jpg", "Orange"],
		["traindata/signs/Orange/Orange_10.jpg", "Orange"],
		["traindata/signs/Orange/Orange_11.jpg", "Orange"],
		["traindata/signs/Orange/Orange_12.jpg", "Orange"],
		["traindata/signs/Orange/Orange_13.jpg", "Orange"],
		["traindata/signs/Orange/Orange_14.jpg", "Orange"],
		["traindata/signs/Orange/Orange_15.jpg", "Orange"],
		["traindata/signs/Orange/Orange_16.jpg", "Orange"],
		["traindata/signs/Orange/Orange_17.jpg", "Orange"],
		["traindata/signs/Orange/Orange_18.jpg", "Orange"],
		["traindata/signs/Orange/Orange_19.jpg", "Orange"],
		["traindata/signs/Orange/Orange_20.jpg", "Orange"],
		["traindata/signs/Orange/Orange_21.jpg", "Orange"],
		["traindata/signs/Orange/Orange_22.jpg", "Orange"],
		["traindata/signs/Orange/Orange_23.jpg", "Orange"],
		["traindata/signs/Orange/Orange_24.jpg", "Orange"],
		["traindata/signs/Orange/Orange_25.jpg", "Orange"],
		["traindata/signs/Orange/Orange_26.jpg", "Orange"],
		["traindata/signs/Orange/Orange_27.jpg", "Orange"],
		["traindata/signs/Orange/Orange_28.jpg", "Orange"],
		["traindata/signs/Orange/Orange_29.jpg", "Orange"],
		["traindata/signs/Orange/Orange_30.jpg", "Orange"],
		["traindata/signs/Orange/Orange_31.jpg", "Orange"],
		["traindata/signs/Orange/Orange_32.jpg", "Orange"],
		["traindata/signs/Orange/Orange_33.jpg", "Orange"],
		["traindata/signs/Orange/Orange_34.jpg", "Orange"],
		["traindata/signs/Orange/Orange_35.jpg", "Orange"],
		["traindata/signs/Orange/Orange_36.jpg", "Orange"],
		["traindata/signs/Orange/Orange_37.jpg", "Orange"],
		["traindata/signs/Orange/Orange_38.jpg", "Orange"],
		["traindata/signs/Orange/Orange_40.jpg", "Orange"],
		["traindata/signs/Orange/Orange_41.jpg", "Orange"],
		["traindata/signs/Orange/Orange_42.jpg", "Orange"],
		["traindata/signs/Orange/Orange_43.jpg", "Orange"],
		["traindata/signs/Orange/Orange_44.jpg", "Orange"],
		["traindata/signs/Orange/Orange_46.jpg", "Orange"],
		["traindata/signs/Orange/Orange_47.jpg", "Orange"],
		["traindata/signs/Orange/Orange_48.jpg", "Orange"],
		["traindata/signs/Orange/Orange_49.jpg", "Orange"],
		["traindata/signs/Orange/Orange_50.jpg", "Orange"],
		["traindata/signs/Orange/Orange_51.jpg", "Orange"],
		["traindata/signs/Orange/Orange_52.jpg", "Orange"],
		["traindata/signs/Orange/Orange_53.jpg", "Orange"],
		["traindata/signs/Orange/Orange_54.jpg", "Orange"],
	]);

	console.log(loaded_data);

	var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 5, batchSize: 100, shuffle: true});

	if(history) {
		console.log("history:", history);
	} else {
		console.error("Training failed");
	}

	await asanai.dispose(loaded_data.x);
	await asanai.dispose(loaded_data.y);
}

async function load_test_images_and_train () {
	var __categories = ["Apfel", "Banane", "Orange"];
	var __max_nr = 40; // obwohl 95 bilder da sind, um jeweils  eines pro kategorie (nr 95)  aus dem training auszunehmen und manuell zu predicten
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
	var __max_nr = 40; // obwohl 95 bilder da sind, um jeweils  eines pro kategorie (nr 95)  aus dem training auszunehmen und manuell zu predicten

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
		var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 10, batchSize: 40, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
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
	document.getElementById("progress-text").innerHTML = document.getElementById("progress").value + "</grün>/10<br><rot>"
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
