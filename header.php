<!DOCTYPE html>
<html lang="en">
    <head>
        <title>asanAI exhibition</title>
        <link rel="stylesheet" href="styles/stylesheet.css">
        <link rel="stylesheet" href="simple-keyboard.css">
        <link rel="stylesheet" href="css/style.css">
        <script src="simple-keyboard.js"></script>
        <script src="md5.js"></script>
<?php
if(isset($GLOBALS["use_navigation"])) {
    ?>
            <link rel="stylesheet" href="styles/navigation.css">
    <?php
} else {
    ?>

            <link rel="stylesheet" href="styles/sidebar.css">
    <?php
}
?>
        <meta charset="UTF-8">
<?php
function fetch_js($url) {
    $options = array(
        "http" => array(
            "method" => "GET",
            "timeout" => 5,
            "header" => "User-Agent: PHP-fetch-js/1.0\r\n"
        )
    );
    $context = stream_context_create($options);

    $content = @file_get_contents($url, false, $context);

    if ($content === false) {
        return "console.error('Fehler: Konnte JavaScript von " . addslashes($url) . " nicht laden.');";
    }

    return $content;
}

$hostname = gethostname();

if ($hostname === "thinkpad44020211128") {
    $url = "http://localhost/TensorFlowJS-GUI/asanai.js.php";
} else if ($hostname === "arbeitsrechner") {
    $url = "http://localhost/tf/asanai.js.php";
} else {
    $url = "https://asanai.scads.ai/asanai.js.php";
}

$js_code = fetch_js($url);

echo "<script>\n" . $js_code . "\n</script>";

$default_max_nr_images = 40;
$default_nr_epochs = 100;
$default_width_and_height = 60;

// max_nr_images Wert überprüfen und setzen
if (isset($_GET['max_nr_images']) && is_numeric($_GET['max_nr_images']) && intval($_GET['max_nr_images']) == $_GET['max_nr_images']) {
	$max_nr_images = intval($_GET['max_nr_images']);
} else {
	$max_nr_images = $default_max_nr_images;
}

// nr_epochs Wert überprüfen und setzen
if (isset($_GET['nr_epochs']) && is_numeric($_GET['nr_epochs']) && intval($_GET['nr_epochs']) == $_GET['nr_epochs']) {
	$nr_epochs = intval($_GET['nr_epochs']);
} else {
	$nr_epochs = $default_nr_epochs;
}

// width_and_height Wert überprüfen und setzen
if (isset($_GET['width_and_height']) && is_numeric($_GET['width_and_height']) && intval($_GET['width_and_height']) == $_GET['width_and_height']) {
	$width_and_height = intval($_GET['width_and_height']);
} else {
	$width_and_height = $default_width_and_height;
}

if (isset($_GET["quick"])) {
	$max_nr_images = 2;
	$nr_epochs = 2;
	$width_and_height = 30;
}
?>

        <script>
            var max_nr_images = <?php echo $max_nr_images; ?>;
            var nr_epochs = <?php echo $nr_epochs; ?>;
            var width_and_height = <?php echo $width_and_height; ?>;
        </script>

        <script src="script.js"></script>
        <script src="reload.js"></script>
        <script>
            var language = <?php require "translations.php"; ?>;
        </script>
        <script src="translations.js"></script>
    </head>
<body>
    <div class="button-header" style="display: none">
        <div id="close_button" class="button shadow b_topRight2 hidden">
            <span class="close" onclick="load_page_with_params('01_start_screen.php')"></span>
        </div>
        <div class="button shadow b_topRight" id="b_de" onclick="switch_language()">
            <div class="language_en"></div>
        </div>
    </div>
    <div style="display: none" class="simple-keyboard"></div>
    <div class="asanai_logo"><img onclick="load_page_with_params('01_start_screen.php')" class="asanai_img" src="media/images/logo_small_dark.png" /></div>
    <div id="optimizer_div" style="display:none"></div>
