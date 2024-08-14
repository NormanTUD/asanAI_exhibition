<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="stylesheet.css">
<?php
		if(isset($GLOBALS["use_navigation"])) {
?>
			<link rel="stylesheet" href="navigation.css">
<?php
		} else {
?>

			<link rel="stylesheet" href="sidebar.css">
<?php
		}
?>
		<meta charset="UTF-8">
		<title>Start Screen</title>
<?php
		if(!isset($GLOBALS["dont_load_asanai"])) {
?>
			<script src="https://asanai.scads.ai/asanai.js.php"></script>
			<script src="script.js"></script>
<?php
		}
?>
	</head>
<body>
