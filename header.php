<!DOCTYPE html>
<html lang="en">
	<head>
		<title>asanAI exhibition</title>
		<link rel="stylesheet" href="styles/stylesheet.css">
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
		} else {
?>
			<script src="https://asanai.scads.ai/asanai.js.php"></script>
<?php
		}
		$default_max_nr_images = 10;
		$default_nr_epochs = 100;

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
?>

		<script>
			var max_nr_images = <?php echo $max_nr_images; ?>;
			var nr_epochs = <?php echo $nr_epochs; ?>;
		</script>

		<script src="script.js"></script>
	</head>
<body>
