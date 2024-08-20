<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
		<div id="optimizer_div" style="display: none;"></div>
		<div class="general">
			<p style="margin: 200px;">Wähle einen existierenden Datensatz oder erstelle deinen Eigenen</p>
			<div class="container">
				<button id="box1" class="box" onclick="location.href='11_test_images.php'">Obst</button>
				<button id="box2" class="box" onclick="location.href='12_option2.php'">Alltags&shy;gegenstände</button>
				<button id="box3" class="box" onclick="location.href='30_train.php'">Eigener Datensatz</button>
			</div>
		</div>
		<div class="navbar" id="only_1">
			<ul>
				<li><a class="icon" href="index.php"><img src="media/images/Home_icon.svg"></a></li>
			</ul>
		</div>
	</body>
</html>
