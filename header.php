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
		if(gethostname() == "thinkpad44020211128") {
?>
			<script src="http://localhost/TensorFlowJS-GUI/asanai.js.php"></script>
<?php
		} else if (gethostname() == "arbeitsrechner") {
?>
			<script src="http://localhost/tf/asanai.js.php"></script>
<?php
		} else {
?>
			<script src="https://asanai.scads.ai/asanai.js.php"></script>
<?php
		}

		$default_max_nr_images = 10;
		$default_nr_epochs = 100;
		$default_width_and_height = 40;

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
?>

		<script>
			var max_nr_images = <?php echo $max_nr_images; ?>;
			var nr_epochs = <?php echo $nr_epochs; ?>;
			var width_and_height = <?php echo $width_and_height; ?>;
		</script>

		<script src="script.js"></script>
		<script src="reload.js"></script>
		<script>
			var language = <?php include("translations.php"); ?>;
		</script>
		<script src="translations.js"></script>
	</head>
<body>
	<div class="button-header" style="display: none">
		<div id="close_button" class="button shadow b_topRight2 hidden">
			<span class="close" onclick="load_page_with_params('01_start_screen.php')"></span>
		</div>
		<div class="button shadow b_topRight" id="b_de" onclick="switch_language()">
			<div class="language_de"></div>
		</div>
	</div>
	<div style="display: none" class="simple-keyboard"></div>
	<div class="asanai_logo"><img class="asanai_img" src="media/images/logo_small_dark.png" /></div>
	<div id="optimizer_div" style="display:none"></div>
