<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
	<div>
		<div class="general">
		<div class="asanai_logo"><img src="media/images/logo_small_dark.png" /></div>
		<div class="button shadow b_topRight" id="b_en" onclick="switchLanguage('en')">
			<div class="language_en"></div>
		</div>
		<div class="button shadow b_topRight hidden" id="b_de" onclick="switchLanguage('de')">
			<div class="language_de"></div>
		</div>
		<div class="button shadow b_topRight2" onclick="closeInfopanel()">
			<a class="close" href="01_start_screen.php"></a>
		</div>
			<button class="box inverted" id="box-wide" onclick="load_and_train_fruits_example();">Test-Bilder laden und Training beginnen</button>
			<div hidden="hidden" id="plotly">
				<div id="plotly_history"></div>
			</div>
			<div hidden="hidden" id="visualization">
				<div class="image_download_area" id="first_example_images"></div>
				<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
				<div id="canvas_grid_visualization"></div>
				<div id="text_training">
					<p class="smaller">Für jedes Obst werden kategorisierte Test-Bilder geladen.</p>
					<p class="smaller">Das Neuronale Netz wählt für jedes Bild einen zufälligen Weg durch das Netzwerk.</p>
					<p class="smaller">Kommt es zu einem falschen Ergebnis, wird es korrigiert.</p>
					<p class="smaller">Mithilfe dieses Feedbacks wird der Weg angepasst bis das Netz zu einem richtigen Output gelangt.</p>
					<p class="smaller">Je mehr Durchgänge es gibt, desto effektiver ist das Training.</p>
					<p class="smaller">In diesem Beispiel sind es <span id="nr_epochs">0</span> Durchgänge.</p>
				</div>
				<div id="progress-text"></div>
				<progress id="progress" value="0" max="100"></progress>
			</div>

			<button hidden="hidden" class="box inverted" id="auswertung_anzeigen" onclick="show_auswertung();">Auswertung anzeigen</button>

			<div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>

			<table id="auswertung_element" style="display: none">
			</table>

			<button hidden="hidden" class="box" id="yourself" onclick="try_yourself()">Probier es aus</button>

			<div hidden="hidden" id="explanation_after_training">
				<div id="fcnn_div"></div>
				<p id="cam_text" class="info-box">Halte eine Frucht <br> in die Kamera:</p>
				<div id="webcam_prediction"></div>
				
				<p id="explanation_input" class="info-box">Das Input-Bild wird zu einer <?php print "${width_and_height}x${width_and_height}"; ?>-Pixel-Matrix, die Höhe und Breite sowie in der 3. Dimension die Farbkanäle rot, grün und blau abbildet.</p>
				<div id="line_exp_input" class="connectionLine"></div>
				<p id="explanation_filter" class="info-box">In den Layern werden verschieden Merkmale wie z.B. Kanten aus dem Bild gefiltert.</p>
				<p id="explanation_kernel" class="info-box">In jeder Schicht wird das Bild abschnittsweise über Kernels abgetastet.</p>
				<p id="explanation_classification" class="info-box">Anhand der extrahierten Merkmale kann das Bild letztendlich klassifiziert werden. </p>
				
			<div id="optimizer_div" hidden="hidden"></div>
		</div>
	</div>
	<script>
		showSpinnerFullScreen();

		$(document).ready(async function() {
			asanai.set_image_div_name("first_example_images");
			asanai.set_image_url_tensor_div("first_example_images");
		});
	</script>
</body>
</html>
