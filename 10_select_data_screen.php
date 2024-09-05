<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
		<div id="optimizer_div" style="display: none;"></div>
		<div class="general">
		<div class="asanai_logo">asanAI</div>
			<h2 style="margin: 200px;">Wähle einen existierenden Datensatz oder erstelle deinen Eigenen</h2>
			<div class="container">
				<button id="box1" class="box inverted" onclick="location.href='11_test_images.php'">Obst</button>
				<button id="box2" class="box inverted" onclick="location.href='12_option2.php'">Alltags&shy;gegenstände</button>
				<button id="box3" class="box inverted" onclick="location.href='30_train.php'">Eigener Datensatz</button>
			</div>
		</div>
		<div class="button shadow b_topRight" id="b_en" onclick="switchLanguage('en')">
			<div class="language_en"></div>
		</div>
		<div class="button shadow b_topRight hidden" id="b_de" onclick="switchLanguage('de')">
			<div class="language_de"></div>
		</div>
		<div class="button shadow b_topRight2" onclick="closeInfopanel()">
			<a class="close" href="01_start_screen.php"></a>
		</div>
	</body>
	<script>
		showSpinnerFullScreen();
	</script>
</html>
