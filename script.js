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
    await asanai.set_max_bar_color("#ff00aa")
    await asanai.set_bar_background_color("#929090")

    // This sets the maximum amount of iterations for "layer visualization images".
    asanai.set_max_activation_iterations(4)

    // This sets the number the input is divided by by default, so that, for example, images. whose values are between 0 and 255, get shrinked to 0 and 1.
    // This makes training more effective in many cases.
    asanai.set_divide_by(255);

    // With this, you can set the labels that are used all throughout the GUI whenever it shows which categories are there or predicts something
    asanai.set_labels(["apple", "banana", "orange"]);

    // The first parameter to show_internals is the id-name of a div, in which the internals are printed.
    // Internals are that which you see as input/output of each layer/neuron, which are visualized to make it easier to understand what the network does.
    // The second parameter allows you to enable (1) or disable (0) the size sliders for neurons/outputs
    asanai.show_internals("internal_states", 1);

    // Hide internals, when called, hides the internals again after they've been shown
    //asanai.hide_internals();

    // draw_fcnn shows the FCNN style visualization the a div with the provided ID.
    asanai.set_fcnn_height(300);
    asanai.set_fcnn_width(700);
    asanai.draw_fcnn("fcnn_div");

    // Shows the output of model.summary in a div.
    //asanai.write_model_summary("summary")

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
        ["traindata/signs/apple/apple_77.jpg", "apple"],
        ["traindata/signs/apple/apple_78.jpg", "apple"],
        ["traindata/signs/apple/apple_79.jpg", "apple"],
        ["traindata/signs/apple/apple_80.jpg", "apple"],
        ["traindata/signs/apple/apple_81.jpg", "apple"],
        ["traindata/signs/apple/apple_82.jpg", "apple"],
        ["traindata/signs/apple/apple_38.jpg", "apple"],
        ["traindata/signs/apple/apple_78.jpg", "apple"],
        ["traindata/signs/apple/apple_64.jpg", "apple"],
        ["traindata/signs/apple/apple_63.jpg", "apple"],
        ["traindata/signs/apple/apple_61.jpg", "apple"],
        ["traindata/signs/apple/apple_88.jpg", "apple"],
        ["traindata/signs/apple/apple_49.jpg", "apple"],
        ["traindata/signs/apple/apple_43.jpg", "apple"],
        ["traindata/signs/apple/apple_41.jpg", "apple"],
        ["traindata/signs/apple/apple_40.jpg", "apple"],
        ["traindata/signs/apple/apple_20.jpg", "apple"],
        ["traindata/signs/apple/apple_18.jpg", "apple"],
        ["traindata/signs/apple/apple_11.jpg", "apple"],
        ["traindata/signs/banana/banana_72.jpg", "banana"],
        ["traindata/signs/banana/banana_78.jpg", "banana"],
        ["traindata/signs/banana/banana_67.jpg", "banana"],
        ["traindata/signs/banana/banana_61.jpg", "banana"],
        ["traindata/signs/banana/banana_57.jpg", "banana"],
        ["traindata/signs/banana/banana_53.jpg", "banana"],
        ["traindata/signs/banana/banana_83.jpg", "banana"],
        ["traindata/signs/banana/banana_47.jpg", "banana"],
        ["traindata/signs/banana/banana_46.jpg", "banana"],
        ["traindata/signs/banana/banana_45.jpg", "banana"],
        ["traindata/signs/banana/banana_35.jpg", "banana"],
        ["traindata/signs/banana/banana_8.jpg", "banana"],
        ["traindata/signs/banana/banana_13.jpg", "banana"],
        ["traindata/signs/banana/banana_11.jpg", "banana"],
        ["traindata/signs/banana/banana_4.jpg", "banana"],
        ["traindata/signs/banana/banana_92.jpg", "banana"],
        ["traindata/signs/banana/banana_93.jpg", "banana"],
        ["traindata/signs/banana/banana_94.jpg", "banana"],
        ["traindata/signs/orange/orange_60.jpg", "orange"],
        ["traindata/signs/orange/orange_51.jpg", "orange"],
        ["traindata/signs/orange/orange_49.jpg", "orange"],
        ["traindata/signs/orange/orange_45.jpg", "orange"],
        ["traindata/signs/orange/orange_42.jpg", "orange"],
        ["traindata/signs/orange/orange_35.jpg", "orange"],
        ["traindata/signs/orange/orange_33.jpg", "orange"],
        ["traindata/signs/orange/orange_32.jpg", "orange"],
        ["traindata/signs/orange/orange_85.jpg", "orange"],
        ["traindata/signs/orange/orange_40.jpg", "orange"],
        ["traindata/signs/orange/orange_30.jpg", "orange"],
        ["traindata/signs/orange/orange_21.jpg", "orange"],
        ["traindata/signs/orange/orange_18.jpg", "orange"],
        ["traindata/signs/orange/orange_91.jpg", "orange"],
        ["traindata/signs/orange/orange_13.jpg", "orange"],
        ["traindata/signs/orange/orange_11.jpg", "orange"],
        ["traindata/signs/orange/orange_94.jpg", "orange"],
        ["traindata/signs/orange/orange_5.jpg", "orange"],
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
        ["traindata/signs/apple/apple_64.jpg", "apple"],
        ["traindata/signs/apple/apple_65.jpg", "apple"],
        ["traindata/signs/apple/apple_66.jpg", "apple"],
        ["traindata/signs/apple/apple_67.jpg", "apple"],
        ["traindata/signs/apple/apple_68.jpg", "apple"],
        ["traindata/signs/apple/apple_69.jpg", "apple"],
        ["traindata/signs/apple/apple_70.jpg", "apple"],
        ["traindata/signs/apple/apple_71.jpg", "apple"],
        ["traindata/signs/apple/apple_72.jpg", "apple"],
        ["traindata/signs/apple/apple_73.jpg", "apple"],
        ["traindata/signs/apple/apple_74.jpg", "apple"],
        ["traindata/signs/apple/apple_75.jpg", "apple"],
        ["traindata/signs/apple/apple_76.jpg", "apple"],
        ["traindata/signs/apple/apple_77.jpg", "apple"],
        ["traindata/signs/apple/apple_78.jpg", "apple"],
        ["traindata/signs/apple/apple_79.jpg", "apple"],
        ["traindata/signs/apple/apple_80.jpg", "apple"],
        ["traindata/signs/apple/apple_81.jpg", "apple"],
        ["traindata/signs/apple/apple_82.jpg", "apple"],

        ["traindata/signs/banana/banana_58.jpg", "banana"],
        ["traindata/signs/banana/banana_59.jpg", "banana"],
        ["traindata/signs/banana/banana_60.jpg", "banana"],
        ["traindata/signs/banana/banana_61.jpg", "banana"],
        ["traindata/signs/banana/banana_62.jpg", "banana"],
        ["traindata/signs/banana/banana_63.jpg", "banana"],
        ["traindata/signs/banana/banana_64.jpg", "banana"],
        ["traindata/signs/banana/banana_65.jpg", "banana"],
        ["traindata/signs/banana/banana_66.jpg", "banana"],
        ["traindata/signs/banana/banana_67.jpg", "banana"],
        ["traindata/signs/banana/banana_68.jpg", "banana"],
        ["traindata/signs/banana/banana_69.jpg", "banana"],
        ["traindata/signs/banana/banana_70.jpg", "banana"],
        ["traindata/signs/banana/banana_71.jpg", "banana"],
        ["traindata/signs/banana/banana_72.jpg", "banana"],
        ["traindata/signs/banana/banana_73.jpg", "banana"],
        ["traindata/signs/banana/banana_74.jpg", "banana"],
        ["traindata/signs/banana/banana_75.jpg", "banana"],

        ["traindata/signs/orange/orange_55.jpg", "orange"],
        ["traindata/signs/orange/orange_56.jpg", "orange"],
        ["traindata/signs/orange/orange_57.jpg", "orange"],
        ["traindata/signs/orange/orange_58.jpg", "orange"],
        ["traindata/signs/orange/orange_59.jpg", "orange"],
        ["traindata/signs/orange/orange_60.jpg", "orange"],
        ["traindata/signs/orange/orange_61.jpg", "orange"],
        ["traindata/signs/orange/orange_62.jpg", "orange"],
        ["traindata/signs/orange/orange_63.jpg", "orange"],
        ["traindata/signs/orange/orange_64.jpg", "orange"],
        ["traindata/signs/orange/orange_65.jpg", "orange"],
        ["traindata/signs/orange/orange_66.jpg", "orange"],
        ["traindata/signs/orange/orange_67.jpg", "orange"],
        ["traindata/signs/orange/orange_68.jpg", "orange"],
        ["traindata/signs/orange/orange_69.jpg", "orange"],
        ["traindata/signs/orange/orange_70.jpg", "orange"],
        ["traindata/signs/orange/orange_71.jpg", "orange"],
        ["traindata/signs/orange/orange_72.jpg", "orange"],

        ["traindata/signs/apple/apple_1.jpg", "apple"],
        ["traindata/signs/apple/apple_2.jpg", "apple"],
        ["traindata/signs/apple/apple_3.jpg", "apple"],
        ["traindata/signs/apple/apple_4.jpg", "apple"],
        ["traindata/signs/apple/apple_5.jpg", "apple"],
        ["traindata/signs/apple/apple_6.jpg", "apple"],
        ["traindata/signs/apple/apple_7.jpg", "apple"],
        ["traindata/signs/apple/apple_8.jpg", "apple"],
        ["traindata/signs/apple/apple_9.jpg", "apple"],
        ["traindata/signs/apple/apple_10.jpg", "apple"],
        ["traindata/signs/apple/apple_11.jpg", "apple"],
        ["traindata/signs/apple/apple_12.jpg", "apple"],
        ["traindata/signs/apple/apple_13.jpg", "apple"],
        ["traindata/signs/apple/apple_14.jpg", "apple"],
        ["traindata/signs/apple/apple_15.jpg", "apple"],
        ["traindata/signs/apple/apple_16.jpg", "apple"],
        ["traindata/signs/apple/apple_17.jpg", "apple"],
        ["traindata/signs/apple/apple_18.jpg", "apple"],
        ["traindata/signs/apple/apple_19.jpg", "apple"],
        ["traindata/signs/apple/apple_20.jpg", "apple"],
        ["traindata/signs/apple/apple_21.jpg", "apple"],
        ["traindata/signs/apple/apple_22.jpg", "apple"],
        ["traindata/signs/apple/apple_23.jpg", "apple"],
        ["traindata/signs/apple/apple_24.jpg", "apple"],
        ["traindata/signs/apple/apple_25.jpg", "apple"],
        ["traindata/signs/apple/apple_26.jpg", "apple"],
        ["traindata/signs/apple/apple_27.jpg", "apple"],
        ["traindata/signs/apple/apple_28.jpg", "apple"],
        ["traindata/signs/apple/apple_29.jpg", "apple"],
        ["traindata/signs/apple/apple_30.jpg", "apple"],
        ["traindata/signs/apple/apple_31.jpg", "apple"],
        ["traindata/signs/apple/apple_32.jpg", "apple"],
        ["traindata/signs/apple/apple_33.jpg", "apple"],
        ["traindata/signs/apple/apple_35.jpg", "apple"],
        ["traindata/signs/apple/apple_36.jpg", "apple"],
        ["traindata/signs/apple/apple_37.jpg", "apple"],
        ["traindata/signs/apple/apple_38.jpg", "apple"],
        ["traindata/signs/apple/apple_39.jpg", "apple"],
        ["traindata/signs/apple/apple_40.jpg", "apple"],
        ["traindata/signs/apple/apple_41.jpg", "apple"],
        ["traindata/signs/apple/apple_42.jpg", "apple"],
        ["traindata/signs/apple/apple_43.jpg", "apple"],
        ["traindata/signs/apple/apple_44.jpg", "apple"],
        ["traindata/signs/apple/apple_45.jpg", "apple"],
        ["traindata/signs/apple/apple_46.jpg", "apple"],
        ["traindata/signs/apple/apple_47.jpg", "apple"],
        ["traindata/signs/apple/apple_48.jpg", "apple"],
        ["traindata/signs/apple/apple_49.jpg", "apple"],
        ["traindata/signs/apple/apple_50.jpg", "apple"],
        ["traindata/signs/apple/apple_51.jpg", "apple"],
        ["traindata/signs/apple/apple_52.jpg", "apple"],
        ["traindata/signs/apple/apple_53.jpg", "apple"],
        ["traindata/signs/apple/apple_54.jpg", "apple"],
        ["traindata/signs/apple/apple_55.jpg", "apple"],
        ["traindata/signs/apple/apple_56.jpg", "apple"],
        ["traindata/signs/apple/apple_57.jpg", "apple"],
        ["traindata/signs/apple/apple_58.jpg", "apple"],
        ["traindata/signs/apple/apple_59.jpg", "apple"],
        ["traindata/signs/apple/apple_60.jpg", "apple"],
        ["traindata/signs/apple/apple_61.jpg", "apple"],
        ["traindata/signs/apple/apple_62.jpg", "apple"],
        ["traindata/signs/apple/apple_63.jpg", "apple"],

        ["traindata/signs/banana/banana_1.jpg", "banana"],
        ["traindata/signs/banana/banana_2.jpg", "banana"],
        ["traindata/signs/banana/banana_3.jpg", "banana"],
        ["traindata/signs/banana/banana_4.jpg", "banana"],
        ["traindata/signs/banana/banana_5.jpg", "banana"],
        ["traindata/signs/banana/banana_6.jpg", "banana"],
        ["traindata/signs/banana/banana_7.jpg", "banana"],
        ["traindata/signs/banana/banana_8.jpg", "banana"],
        ["traindata/signs/banana/banana_9.jpg", "banana"],
        ["traindata/signs/banana/banana_10.jpg", "banana"],
        ["traindata/signs/banana/banana_11.jpg", "banana"],
        ["traindata/signs/banana/banana_12.jpg", "banana"],
        ["traindata/signs/banana/banana_13.jpg", "banana"],
        ["traindata/signs/banana/banana_14.jpg", "banana"],
        ["traindata/signs/banana/banana_16.jpg", "banana"],
        ["traindata/signs/banana/banana_17.jpg", "banana"],
        ["traindata/signs/banana/banana_20.jpg", "banana"],
        ["traindata/signs/banana/banana_21.jpg", "banana"],
        ["traindata/signs/banana/banana_22.jpg", "banana"],
        ["traindata/signs/banana/banana_23.jpg", "banana"],
        ["traindata/signs/banana/banana_24.jpg", "banana"],
        ["traindata/signs/banana/banana_25.jpg", "banana"],
        ["traindata/signs/banana/banana_26.jpg", "banana"],
        ["traindata/signs/banana/banana_27.jpg", "banana"],
        ["traindata/signs/banana/banana_28.jpg", "banana"],
        ["traindata/signs/banana/banana_29.jpg", "banana"],
        ["traindata/signs/banana/banana_30.jpg", "banana"],
        ["traindata/signs/banana/banana_31.jpg", "banana"],
        ["traindata/signs/banana/banana_32.jpg", "banana"],
        ["traindata/signs/banana/banana_33.jpg", "banana"],
        ["traindata/signs/banana/banana_34.jpg", "banana"],
        ["traindata/signs/banana/banana_35.jpg", "banana"],
        ["traindata/signs/banana/banana_36.jpg", "banana"],
        ["traindata/signs/banana/banana_37.jpg", "banana"],
        ["traindata/signs/banana/banana_38.jpg", "banana"],
        ["traindata/signs/banana/banana_39.jpg", "banana"],
        ["traindata/signs/banana/banana_40.jpg", "banana"],
        ["traindata/signs/banana/banana_41.jpg", "banana"],
        ["traindata/signs/banana/banana_42.jpg", "banana"],
        ["traindata/signs/banana/banana_43.jpg", "banana"],
        ["traindata/signs/banana/banana_44.jpg", "banana"],
        ["traindata/signs/banana/banana_45.jpg", "banana"],
        ["traindata/signs/banana/banana_46.jpg", "banana"],
        ["traindata/signs/banana/banana_47.jpg", "banana"],
        ["traindata/signs/banana/banana_48.jpg", "banana"],
        ["traindata/signs/banana/banana_49.jpg", "banana"],
        ["traindata/signs/banana/banana_50.jpg", "banana"],
        ["traindata/signs/banana/banana_51.jpg", "banana"],
        ["traindata/signs/banana/banana_52.jpg", "banana"],
        ["traindata/signs/banana/banana_53.jpg", "banana"],
        ["traindata/signs/banana/banana_54.jpg", "banana"],
        ["traindata/signs/banana/banana_55.jpg", "banana"],
        ["traindata/signs/banana/banana_56.jpg", "banana"],
        ["traindata/signs/banana/banana_57.jpg", "banana"],

        ["traindata/signs/orange/orange_1.jpg", "orange"],
        ["traindata/signs/orange/orange_2.jpg", "orange"],
        ["traindata/signs/orange/orange_3.jpg", "orange"],
        ["traindata/signs/orange/orange_4.jpg", "orange"],
        ["traindata/signs/orange/orange_5.jpg", "orange"],
        ["traindata/signs/orange/orange_6.jpg", "orange"],
        ["traindata/signs/orange/orange_7.jpg", "orange"],
        ["traindata/signs/orange/orange_8.jpg", "orange"],
        ["traindata/signs/orange/orange_9.jpg", "orange"],
        ["traindata/signs/orange/orange_10.jpg", "orange"],
        ["traindata/signs/orange/orange_11.jpg", "orange"],
        ["traindata/signs/orange/orange_12.jpg", "orange"],
        ["traindata/signs/orange/orange_13.jpg", "orange"],
        ["traindata/signs/orange/orange_14.jpg", "orange"],
        ["traindata/signs/orange/orange_15.jpg", "orange"],
        ["traindata/signs/orange/orange_16.jpg", "orange"],
        ["traindata/signs/orange/orange_17.jpg", "orange"],
        ["traindata/signs/orange/orange_18.jpg", "orange"],
        ["traindata/signs/orange/orange_19.jpg", "orange"],
        ["traindata/signs/orange/orange_20.jpg", "orange"],
        ["traindata/signs/orange/orange_21.jpg", "orange"],
        ["traindata/signs/orange/orange_22.jpg", "orange"],
        ["traindata/signs/orange/orange_23.jpg", "orange"],
        ["traindata/signs/orange/orange_24.jpg", "orange"],
        ["traindata/signs/orange/orange_25.jpg", "orange"],
        ["traindata/signs/orange/orange_26.jpg", "orange"],
        ["traindata/signs/orange/orange_27.jpg", "orange"],
        ["traindata/signs/orange/orange_28.jpg", "orange"],
        ["traindata/signs/orange/orange_29.jpg", "orange"],
        ["traindata/signs/orange/orange_30.jpg", "orange"],
        ["traindata/signs/orange/orange_31.jpg", "orange"],
        ["traindata/signs/orange/orange_32.jpg", "orange"],
        ["traindata/signs/orange/orange_33.jpg", "orange"],
        ["traindata/signs/orange/orange_34.jpg", "orange"],
        ["traindata/signs/orange/orange_35.jpg", "orange"],
        ["traindata/signs/orange/orange_36.jpg", "orange"],
        ["traindata/signs/orange/orange_37.jpg", "orange"],
        ["traindata/signs/orange/orange_38.jpg", "orange"],
        ["traindata/signs/orange/orange_40.jpg", "orange"],
        ["traindata/signs/orange/orange_41.jpg", "orange"],
        ["traindata/signs/orange/orange_42.jpg", "orange"],
        ["traindata/signs/orange/orange_43.jpg", "orange"],
        ["traindata/signs/orange/orange_44.jpg", "orange"],
        ["traindata/signs/orange/orange_46.jpg", "orange"],
        ["traindata/signs/orange/orange_47.jpg", "orange"],
        ["traindata/signs/orange/orange_48.jpg", "orange"],
        ["traindata/signs/orange/orange_49.jpg", "orange"],
        ["traindata/signs/orange/orange_50.jpg", "orange"],
        ["traindata/signs/orange/orange_51.jpg", "orange"],
        ["traindata/signs/orange/orange_52.jpg", "orange"],
        ["traindata/signs/orange/orange_53.jpg", "orange"],
        ["traindata/signs/orange/orange_54.jpg", "orange"],
    ]);

    console.log(loaded_data);

    var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 5, batchSize: 1000, shuffle: true});

    if(history) {
        console.log("history:", history);
    } else {
        console.error("Training failed");
    }

    await asanai.dispose(loaded_data.x);
    await asanai.dispose(loaded_data.y);
}

async function load_test_images_and_train () {
    var loaded_data = asanai.load_image_urls_to_div_and_tensor("test_images", [
        ["traindata/signs/apple/apple_64.jpg", "apple"],
        ["traindata/signs/apple/apple_65.jpg", "apple"],
        ["traindata/signs/apple/apple_66.jpg", "apple"],
        ["traindata/signs/apple/apple_67.jpg", "apple"],
        ["traindata/signs/apple/apple_68.jpg", "apple"],
        ["traindata/signs/apple/apple_69.jpg", "apple"],
        ["traindata/signs/apple/apple_70.jpg", "apple"],
        ["traindata/signs/apple/apple_71.jpg", "apple"],
        ["traindata/signs/apple/apple_72.jpg", "apple"],
        ["traindata/signs/apple/apple_73.jpg", "apple"],
        ["traindata/signs/apple/apple_74.jpg", "apple"],
        ["traindata/signs/apple/apple_75.jpg", "apple"],
        ["traindata/signs/apple/apple_76.jpg", "apple"],
        ["traindata/signs/apple/apple_77.jpg", "apple"],
        ["traindata/signs/apple/apple_78.jpg", "apple"],
        ["traindata/signs/apple/apple_79.jpg", "apple"],
        ["traindata/signs/apple/apple_80.jpg", "apple"],
        ["traindata/signs/apple/apple_81.jpg", "apple"],
        ["traindata/signs/apple/apple_82.jpg", "apple"],

        ["traindata/signs/banana/banana_58.jpg", "banana"],
        ["traindata/signs/banana/banana_59.jpg", "banana"],
        ["traindata/signs/banana/banana_60.jpg", "banana"],
        ["traindata/signs/banana/banana_61.jpg", "banana"],
        ["traindata/signs/banana/banana_62.jpg", "banana"],
        ["traindata/signs/banana/banana_63.jpg", "banana"],
        ["traindata/signs/banana/banana_64.jpg", "banana"],
        ["traindata/signs/banana/banana_65.jpg", "banana"],
        ["traindata/signs/banana/banana_66.jpg", "banana"],
        ["traindata/signs/banana/banana_67.jpg", "banana"],
        ["traindata/signs/banana/banana_68.jpg", "banana"],
        ["traindata/signs/banana/banana_69.jpg", "banana"],
        ["traindata/signs/banana/banana_70.jpg", "banana"],
        ["traindata/signs/banana/banana_71.jpg", "banana"],
        ["traindata/signs/banana/banana_72.jpg", "banana"],
        ["traindata/signs/banana/banana_73.jpg", "banana"],
        ["traindata/signs/banana/banana_74.jpg", "banana"],
        ["traindata/signs/banana/banana_75.jpg", "banana"],

        ["traindata/signs/orange/orange_55.jpg", "orange"],
        ["traindata/signs/orange/orange_56.jpg", "orange"],
        ["traindata/signs/orange/orange_57.jpg", "orange"],
        ["traindata/signs/orange/orange_58.jpg", "orange"],
        ["traindata/signs/orange/orange_59.jpg", "orange"],
        ["traindata/signs/orange/orange_60.jpg", "orange"],
        ["traindata/signs/orange/orange_61.jpg", "orange"],
        ["traindata/signs/orange/orange_62.jpg", "orange"],
        ["traindata/signs/orange/orange_63.jpg", "orange"],
        ["traindata/signs/orange/orange_64.jpg", "orange"],
        ["traindata/signs/orange/orange_65.jpg", "orange"],
        ["traindata/signs/orange/orange_66.jpg", "orange"],
        ["traindata/signs/orange/orange_67.jpg", "orange"],
        ["traindata/signs/orange/orange_68.jpg", "orange"],
        ["traindata/signs/orange/orange_69.jpg", "orange"],
        ["traindata/signs/orange/orange_70.jpg", "orange"],
        ["traindata/signs/orange/orange_71.jpg", "orange"],
        ["traindata/signs/orange/orange_72.jpg", "orange"],

        ["traindata/signs/apple/apple_1.jpg", "apple"],
        ["traindata/signs/apple/apple_2.jpg", "apple"],
        ["traindata/signs/apple/apple_3.jpg", "apple"],
        ["traindata/signs/apple/apple_4.jpg", "apple"],
        ["traindata/signs/apple/apple_5.jpg", "apple"],
        ["traindata/signs/apple/apple_6.jpg", "apple"],
        ["traindata/signs/apple/apple_7.jpg", "apple"],
        ["traindata/signs/apple/apple_8.jpg", "apple"],
        ["traindata/signs/apple/apple_9.jpg", "apple"],
        ["traindata/signs/apple/apple_10.jpg", "apple"],
        ["traindata/signs/apple/apple_11.jpg", "apple"],
        ["traindata/signs/apple/apple_12.jpg", "apple"],
        ["traindata/signs/apple/apple_13.jpg", "apple"],
        ["traindata/signs/apple/apple_14.jpg", "apple"],
        ["traindata/signs/apple/apple_15.jpg", "apple"],
        ["traindata/signs/apple/apple_16.jpg", "apple"],
        ["traindata/signs/apple/apple_17.jpg", "apple"],
        ["traindata/signs/apple/apple_18.jpg", "apple"],
        ["traindata/signs/apple/apple_19.jpg", "apple"],
        ["traindata/signs/apple/apple_20.jpg", "apple"],
        ["traindata/signs/apple/apple_21.jpg", "apple"],
        ["traindata/signs/apple/apple_22.jpg", "apple"],
        ["traindata/signs/apple/apple_23.jpg", "apple"],
        ["traindata/signs/apple/apple_24.jpg", "apple"],
        ["traindata/signs/apple/apple_25.jpg", "apple"],
        ["traindata/signs/apple/apple_26.jpg", "apple"],
        ["traindata/signs/apple/apple_27.jpg", "apple"],
        ["traindata/signs/apple/apple_28.jpg", "apple"],
        ["traindata/signs/apple/apple_29.jpg", "apple"],
        ["traindata/signs/apple/apple_30.jpg", "apple"],
        ["traindata/signs/apple/apple_31.jpg", "apple"],
        ["traindata/signs/apple/apple_32.jpg", "apple"],
        ["traindata/signs/apple/apple_33.jpg", "apple"],
        ["traindata/signs/apple/apple_35.jpg", "apple"],
        ["traindata/signs/apple/apple_36.jpg", "apple"],
        ["traindata/signs/apple/apple_37.jpg", "apple"],
        ["traindata/signs/apple/apple_38.jpg", "apple"],
        ["traindata/signs/apple/apple_39.jpg", "apple"],
        ["traindata/signs/apple/apple_40.jpg", "apple"],
        ["traindata/signs/apple/apple_41.jpg", "apple"],
        ["traindata/signs/apple/apple_42.jpg", "apple"],
        ["traindata/signs/apple/apple_43.jpg", "apple"],
        ["traindata/signs/apple/apple_44.jpg", "apple"],
        ["traindata/signs/apple/apple_45.jpg", "apple"],
        ["traindata/signs/apple/apple_46.jpg", "apple"],
        ["traindata/signs/apple/apple_47.jpg", "apple"],
        ["traindata/signs/apple/apple_48.jpg", "apple"],
        ["traindata/signs/apple/apple_49.jpg", "apple"],
        ["traindata/signs/apple/apple_50.jpg", "apple"],
        ["traindata/signs/apple/apple_51.jpg", "apple"],
        ["traindata/signs/apple/apple_52.jpg", "apple"],
        ["traindata/signs/apple/apple_53.jpg", "apple"],
        ["traindata/signs/apple/apple_54.jpg", "apple"],
        ["traindata/signs/apple/apple_55.jpg", "apple"],
        ["traindata/signs/apple/apple_56.jpg", "apple"],
        ["traindata/signs/apple/apple_57.jpg", "apple"],
        ["traindata/signs/apple/apple_58.jpg", "apple"],
        ["traindata/signs/apple/apple_59.jpg", "apple"],
        ["traindata/signs/apple/apple_60.jpg", "apple"],
        ["traindata/signs/apple/apple_61.jpg", "apple"],
        ["traindata/signs/apple/apple_62.jpg", "apple"],
        ["traindata/signs/apple/apple_63.jpg", "apple"],

        ["traindata/signs/banana/banana_1.jpg", "banana"],
        ["traindata/signs/banana/banana_2.jpg", "banana"],
        ["traindata/signs/banana/banana_3.jpg", "banana"],
        ["traindata/signs/banana/banana_4.jpg", "banana"],
        ["traindata/signs/banana/banana_5.jpg", "banana"],
        ["traindata/signs/banana/banana_6.jpg", "banana"],
        ["traindata/signs/banana/banana_7.jpg", "banana"],
        ["traindata/signs/banana/banana_8.jpg", "banana"],
        ["traindata/signs/banana/banana_9.jpg", "banana"],
        ["traindata/signs/banana/banana_10.jpg", "banana"],
        ["traindata/signs/banana/banana_11.jpg", "banana"],
        ["traindata/signs/banana/banana_12.jpg", "banana"],
        ["traindata/signs/banana/banana_13.jpg", "banana"],
        ["traindata/signs/banana/banana_14.jpg", "banana"],
        ["traindata/signs/banana/banana_16.jpg", "banana"],
        ["traindata/signs/banana/banana_17.jpg", "banana"],
        ["traindata/signs/banana/banana_20.jpg", "banana"],
        ["traindata/signs/banana/banana_21.jpg", "banana"],
        ["traindata/signs/banana/banana_22.jpg", "banana"],
        ["traindata/signs/banana/banana_23.jpg", "banana"],
        ["traindata/signs/banana/banana_24.jpg", "banana"],
        ["traindata/signs/banana/banana_25.jpg", "banana"],
        ["traindata/signs/banana/banana_26.jpg", "banana"],
        ["traindata/signs/banana/banana_27.jpg", "banana"],
        ["traindata/signs/banana/banana_28.jpg", "banana"],
        ["traindata/signs/banana/banana_29.jpg", "banana"],
        ["traindata/signs/banana/banana_30.jpg", "banana"],
        ["traindata/signs/banana/banana_31.jpg", "banana"],
        ["traindata/signs/banana/banana_32.jpg", "banana"],
        ["traindata/signs/banana/banana_33.jpg", "banana"],
        ["traindata/signs/banana/banana_34.jpg", "banana"],
        ["traindata/signs/banana/banana_35.jpg", "banana"],
        ["traindata/signs/banana/banana_36.jpg", "banana"],
        ["traindata/signs/banana/banana_37.jpg", "banana"],
        ["traindata/signs/banana/banana_38.jpg", "banana"],
        ["traindata/signs/banana/banana_39.jpg", "banana"],
        ["traindata/signs/banana/banana_40.jpg", "banana"],
        ["traindata/signs/banana/banana_41.jpg", "banana"],
        ["traindata/signs/banana/banana_42.jpg", "banana"],
        ["traindata/signs/banana/banana_43.jpg", "banana"],
        ["traindata/signs/banana/banana_44.jpg", "banana"],
        ["traindata/signs/banana/banana_45.jpg", "banana"],
        ["traindata/signs/banana/banana_46.jpg", "banana"],
        ["traindata/signs/banana/banana_47.jpg", "banana"],
        ["traindata/signs/banana/banana_48.jpg", "banana"],
        ["traindata/signs/banana/banana_49.jpg", "banana"],
        ["traindata/signs/banana/banana_50.jpg", "banana"],
        ["traindata/signs/banana/banana_51.jpg", "banana"],
        ["traindata/signs/banana/banana_52.jpg", "banana"],
        ["traindata/signs/banana/banana_53.jpg", "banana"],
        ["traindata/signs/banana/banana_54.jpg", "banana"],
        ["traindata/signs/banana/banana_55.jpg", "banana"],
        ["traindata/signs/banana/banana_56.jpg", "banana"],
        ["traindata/signs/banana/banana_57.jpg", "banana"],

        ["traindata/signs/orange/orange_1.jpg", "orange"],
        ["traindata/signs/orange/orange_2.jpg", "orange"],
        ["traindata/signs/orange/orange_3.jpg", "orange"],
        ["traindata/signs/orange/orange_4.jpg", "orange"],
        ["traindata/signs/orange/orange_5.jpg", "orange"],
        ["traindata/signs/orange/orange_6.jpg", "orange"],
        ["traindata/signs/orange/orange_7.jpg", "orange"],
        ["traindata/signs/orange/orange_8.jpg", "orange"],
        ["traindata/signs/orange/orange_9.jpg", "orange"],
        ["traindata/signs/orange/orange_10.jpg", "orange"],
        ["traindata/signs/orange/orange_11.jpg", "orange"],
        ["traindata/signs/orange/orange_12.jpg", "orange"],
        ["traindata/signs/orange/orange_13.jpg", "orange"],
        ["traindata/signs/orange/orange_14.jpg", "orange"],
        ["traindata/signs/orange/orange_15.jpg", "orange"],
        ["traindata/signs/orange/orange_16.jpg", "orange"],
        ["traindata/signs/orange/orange_17.jpg", "orange"],
        ["traindata/signs/orange/orange_18.jpg", "orange"],
        ["traindata/signs/orange/orange_19.jpg", "orange"],
        ["traindata/signs/orange/orange_20.jpg", "orange"],
        ["traindata/signs/orange/orange_21.jpg", "orange"],
        ["traindata/signs/orange/orange_22.jpg", "orange"],
        ["traindata/signs/orange/orange_23.jpg", "orange"],
        ["traindata/signs/orange/orange_24.jpg", "orange"],
        ["traindata/signs/orange/orange_25.jpg", "orange"],
        ["traindata/signs/orange/orange_26.jpg", "orange"],
        ["traindata/signs/orange/orange_27.jpg", "orange"],
        ["traindata/signs/orange/orange_28.jpg", "orange"],
        ["traindata/signs/orange/orange_29.jpg", "orange"],
        ["traindata/signs/orange/orange_30.jpg", "orange"],
        ["traindata/signs/orange/orange_31.jpg", "orange"],
        ["traindata/signs/orange/orange_32.jpg", "orange"],
        ["traindata/signs/orange/orange_33.jpg", "orange"],
        ["traindata/signs/orange/orange_34.jpg", "orange"],
        ["traindata/signs/orange/orange_35.jpg", "orange"],
        ["traindata/signs/orange/orange_36.jpg", "orange"],
        ["traindata/signs/orange/orange_37.jpg", "orange"],
        ["traindata/signs/orange/orange_38.jpg", "orange"],
        ["traindata/signs/orange/orange_40.jpg", "orange"],
        ["traindata/signs/orange/orange_41.jpg", "orange"],
        ["traindata/signs/orange/orange_42.jpg", "orange"],
        ["traindata/signs/orange/orange_43.jpg", "orange"],
        ["traindata/signs/orange/orange_44.jpg", "orange"],
        ["traindata/signs/orange/orange_46.jpg", "orange"],
        ["traindata/signs/orange/orange_47.jpg", "orange"],
        ["traindata/signs/orange/orange_48.jpg", "orange"],
        ["traindata/signs/orange/orange_49.jpg", "orange"],
        ["traindata/signs/orange/orange_50.jpg", "orange"],
        ["traindata/signs/orange/orange_51.jpg", "orange"],
        ["traindata/signs/orange/orange_52.jpg", "orange"],
        ["traindata/signs/orange/orange_53.jpg", "orange"],
        ["traindata/signs/orange/orange_54.jpg", "orange"],
    ]);

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

    var __categories = ["apple", "banana", "orange"];
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
        var history = await asanai.fit(loaded_data.x, loaded_data.y, {epochs: 100, batchSize: 40, shuffle: true}, {'div': 'plotly_history'}, {"onEpochEnd": update_progress_bar, "onTrainEnd": training_end});
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

function toggle_button(status) {
    if (status === 1) {
        toggle(document.getElementById("box-wide"));
        toggle(document.getElementById("visualization"));
    }else if (status === 2){
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
var update_progress_bar = async function () {
    document.getElementById("progress").value += 1;
}

var training_end = async function(){
    toggle(document.getElementById("evaluation"));
    toggle(document.getElementById("progress"));
}

function matrix_texts(){
        if (asanai.confusion_matrix_data["banana"]["banana"] === undefined){
        asanai.confusion_matrix_data["banana"]["banana"] = 0;
    }
    if (asanai.confusion_matrix_data["orange"]["banana"] === undefined){
        asanai.confusion_matrix_data["orange"]["banana"] = 0;
    }
    if (asanai.confusion_matrix_data["apple"]["banana"] === undefined){
        asanai.confusion_matrix_data["apple"]["banana"] = 0;
    }
    if (asanai.confusion_matrix_data["banana"]["apple"] === undefined){
        asanai.confusion_matrix_data["banana"]["apple"] = 0;
    }
    if (asanai.confusion_matrix_data["apple"]["apple"] === undefined){
        asanai.confusion_matrix_data["apple"]["apple"] = 0;
    }
    if (asanai.confusion_matrix_data["orange"]["apple"] === undefined){
        asanai.confusion_matrix_data["orange"]["apple"] = 0;
    }
    if (asanai.confusion_matrix_data["banana"]["orange"] === undefined){
        asanai.confusion_matrix_data["banana"]["orange"] = 0;
    }
    if (asanai.confusion_matrix_data["apple"]["orange"] === undefined){
        asanai.confusion_matrix_data["apple"]["orange"] = 0;
    }
    if (asanai.confusion_matrix_data["orange"]["orange"] === undefined){
        asanai.confusion_matrix_data["orange"]["orange"] = 0;
    }

    var richtig = asanai.confusion_matrix_data["banana"]["banana"] + asanai.confusion_matrix_data["orange"]["orange"] + asanai.confusion_matrix_data["apple"]["apple"];
    var prozent = Math.round(richtig/1.2);

    document.getElementById("matrix_text").innerHTML = "Es wurden insgesamt <grün>"
        + richtig
        + "</grün>  von 120 Bildern richtig erkannt. <br>"
        + "Das entspricht <grün>"
        + prozent
        + "%.</grün>";

    document.getElementById("matrix_text_banana").innerHTML = "Das Training für Bananen hat ergeben: <br><grün>"
        + asanai.confusion_matrix_data["banana"]["banana"]
        + "</grün> von 40 Bananen wurden richtig erkannt. <br><rot>"
        + asanai.confusion_matrix_data["banana"]["apple"]
        + "</rot> Bananen wurden als Apfel erkannt, <br><rot>"
        + asanai.confusion_matrix_data["banana"]["orange"]
        + "</rot> Bananen wurden als Orange erkannt. <br>";

    document.getElementById("matrix_text_orange").innerHTML = "Das Training für Orangen hat ergeben: <br><grün>"
        + asanai.confusion_matrix_data["orange"]["orange"]
        + "</grün> von 40 Orangen wurden richtig erkannt. <br><rot>"
        + asanai.confusion_matrix_data["orange"]["apple"]
        + "</rot> Orangen wurden als Apfel erkannt, <br><rot>"
        + asanai.confusion_matrix_data["orange"]["banana"]
        + "</rot> Orangen wurden als Banane erkannt. <br>";

    document.getElementById("matrix_text_apple").innerHTML = "Das Training für Äpfel hat ergeben: <br><grün>"
        + asanai.confusion_matrix_data["apple"]["apple"]
        + "</grün> von 40 Äpfel wurden richtig erkannt. <br><rot>"
        + asanai.confusion_matrix_data["apple"]["banana"]
        + "</rot> Äpfel wurden als Banane erkannt, <br><rot>"
        + asanai.confusion_matrix_data["apple"]["orange"]
        + "</rot> Äpfel wurden als Orange erkannt. <br>";
}