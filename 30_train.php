<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
		<div class="general">
			<div style="clear: both;"></div>
				<div class="flex_box">
					<div id="webcam_prediction"></div>
				</div>
			</div>
		</div>

		<div class="navbar">
			<ul>
				<li><a class="icon" href="01_start_screen.php"><img src="media/images/Home_icon.svg"></a></li>
				<li><a class="icon" onclick="history.back()"><img src="media/images/Back_icon.svg"></a></li>
			</ul>
		</div>

		<div id="optimizer_div" style="display:none"></div>

		<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>

		<button hidden="hidden" class="box" id="evaluation" onclick="show_auswertung(); matrix_texts()">Auswertung anzeigen</button>
		<button hidden="hidden" class="box" id="yourself" onclick="try_yourself()">Probier es aus</button>

		<div style="display: none" id="fcnn_div"></div>

		<div hidden="hidden" id="explanation_after_training">
			<div id="fcnn_div"></div>
			<p id="cam_text" style="font-size: 5vh; text-align: left; position: absolute; left: 13vw; top: 3vh; line-height: 100%">Halte eine Frucht <br> in die Kamera:</p>
			<div id="webcam_prediction"></div>
				<p id="erklärung">Das Input-Bild wird zu einer <?php print "${width_and_height}x${width_and_height}"; ?>-Pixel-Matrix, die Höhe und Breite sowie in der 3. Dimension die Farbkanäle rot, grün und blau abbildet.</p>
				<p id="erklärung">In den Layern werden verschieden Merkmale wie z.B. Kanten aus dem Bild gefiltert.</p>
				<p id="erklärung">In jeder Schicht wird das Bild abschnittsweise über Kernels abgetastet.</p>
				<p id="erklärung">Anhand der extrahierten Merkmale kann das Bild letztendlich klassifiziert werden. </p>
			</div>
		</div>

		<div id="analysis"></div>

		<table id="custom_images_table" style="margin-left: 200px;">
			<tr>
				<td style="width: 330px; vertical-align: baseline;">
					<div>
						<button style="visiblity: hidden;" id="start_custom_training" class="reasonable_box green_box" onclick="startCustomTraining()">Training starten</button>
						<br>
						<br>
						<button class="reasonable_box" onclick="addCustomCategory()">Neue Kategorie hinzufügen</button>
						<br>
						<br>
						<video id="webcam_preview_video"></video>
					</div>
				</td>
				<td style="width: max-content;" id="custom_images">
				</td>
			</tr>
		</table>

		<div hidden="hidden" id="visualization">
			<div id="canvas_grid_visualization"></div>
		</div>

		<div style="display: none">
			<div id="plotly_history" style="display: none"></div>
		</div>

		<div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>

		<div hidden="hidden" id="progress-text"></div>
		<progress hidden="hidden" id="progress" value="0" max="100"></progress>

		<script>
			$(document).ready(async function() {
				if(asanai) {
					asanai.tf_data_webcam($("#webcam_preview_video")[0])

					addCustomCategory();
					addCustomCategory();
				} else {
					log("asanai is undefined");
				}
			});
		</script>
	</body>

	<script>
		$(document).ready(async function() {
			asanai.set_image_div_name("custom_images");
			asanai.set_image_url_tensor_div("custom_images");

			rename_category_labels();
		});
	</script>
</html>
