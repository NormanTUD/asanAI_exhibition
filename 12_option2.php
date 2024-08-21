<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
	<div>
		<div class="general">
			<button class="box" id="box-wide" onclick="load_and_train_scheine_muenzen_schluessel();">Test-Bilder laden und Training beginnen</button>
			<div id="second_example_images"></div>
			<div hidden="hidden" id="plotly">
				<div id="plotly_history"></div>
			</div>
			<div hidden="hidden" id="visualization">
				<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
				<div id="canvas_grid_visualization"></div>
				<div id="text_training">
					<p class="smaller">Für jede Kategorie werden kategorisierte Test-Bilder geladen.</p>
					<p class="smaller">Das Neuronale Netz wählt für jedes Bild einen zufälligen Weg durch das Netzwerk.</p>
					<p class="smaller">Kommt es zu einem falschen Ergebnis, wird es korrigiert.</p>
					<p class="smaller">Mithilfe dieses Feedbacks wird der Weg angepasst bis das Netz zu einem richtigen Output gelangt.</p>
					<p class="smaller">Je mehr Durchgänge es gibt, desto effektiver ist das Training.</p>
					<p class="smaller">In diesem Beispiel sind es <span id="nr_epochs">0</span> Durchgänge.</p>
				</div>
				<div id="progress-text"></div>
				<progress id="progress" value="0" max="100"></progress>
			</div>

			<button hidden="hidden" class="box" id="evaluation" onclick="show_auswertung(); matrix_texts()">Auswertung anzeigen</button>

			<div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>

			<table id="auswertung_element">
			</table>

			<button hidden="hidden" class="box" id="yourself" onclick="try_yourself()">Probier es aus</button>

			<div hidden="hidden" id="explanation_after_training">
				<div id="fcnn_div"></div>
				<p id="cam_text" style="font-size: 5vh; text-align: left; position: absolute; left: 13vw; top: 3vh; line-height: 100%">Halte eine Frucht <br> in die Kamera:</p>
				<div id="webcam_prediction"></div>
					<p id="explanation">Das Input-Bild wird zu einer <?php print "${width_and_height}x${width_and_height}"; ?>-Pixel-Matrix, die Höhe und Breite sowie in der 3. Dimension die Farbkanäle rot, grün und blau abbildet.</p>
					<p id="explanation">In den Layern werden verschieden Merkmale wie z.B. Kanten aus dem Bild gefiltert.</p>
					<p id="explanation">In jeder Schicht wird das Bild abschnittsweise über Kernels abgetastet.</p>
					<p id="explanation">Anhand der extrahierten Merkmale kann das Bild letztendlich klassifiziert werden. </p>
				</div>
			</div>
			<div class="navbar">
				<ul>
					<li><a class="icon" href="01_start_screen.php"><img src="media/images/Home_icon.svg"></a></li>
					<li><a class="icon" onclick="history.back()"><img src="media/images/Back_icon.svg"></a></li>
				</ul>
			</div>
			<div id="optimizer_div" hidden="hidden"></div>
		</div>
	</div>
	<script>
		$(document).ready(async function() {
			asanai.set_image_div_name("second_example_images");
		});
	</script>
</body>
</html>
