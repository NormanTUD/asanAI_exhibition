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

			<link rel="stylesheet" href="sidebar.css">
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
?>
		<script src="script.js"></script>
	</head>
<body>
