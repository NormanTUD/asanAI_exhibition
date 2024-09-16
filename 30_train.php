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
		<div class="button-header">
			<div class="button shadow b_topRight" id="b_en">
				<div class="button shadow b_topRight hidden" id="b_de" onclick="switch_language()">
					<div class="language_de"></div>
				</div>
				<div class="button shadow b_topRight2" onclick="closeInfopanel()">
					<a class="close" href="01_start_screen.php"></a>
				</div>
			</div>
		</div>

		<div id="optimizer_div" style="display:none"></div>

		<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>

		<button hidden="hidden" class="box" id="auswertung_anzeigen" onclick="show_auswertung();">
			<span class="TRANSLATEME_show_results"></span>
		</button>

		<button hidden="hidden" class="box" id="yourself" onclick="try_yourself()">
			<span class="TRANSLATEME_try_it_yourself"></span>
		</button>


		<div style="display: none" id="fcnn_div"></div>

		<div hidden="hidden" id="explanation_after_training">
			<div id="fcnn_div"></div>
			<p id="cam_text" style="font-size: min(3vh, 3vw); text-align: left; position: absolute; left: 13vw; top: 3vh; line-height: 100%">
				<span class="TRANSLATEME_hold_one_of_the_trained_objects"></span>
			</p>

			<div id="webcam_prediction"></div>
				<div id="explanation_group">
				<p id="explanation">
					<span class="TRANSLATEME_the_input_image_is_converted_into_a"></span>
					<span><?php print "${width_and_height}x${width_and_height}"; ?></span>
					<span class="TRANSLATEME_pixel_matrix_representing_height_width_and_rgb_channels"></span>
				</p>

				<p id="explanation">
					<span class="TRANSLATEME_in_the_layers_various_features_such_as_edges_are_filtered_from_the_image"></span>
				</p>

				<p id="explanation">
					<span class="TRANSLATEME_in_each_layer_the_image_is_scanned_by_kernels_section_by_section"></span>
				</p>

				<p id="explanation">
					<span class="TRANSLATEME_based_on_the_extracted_features_the_image_is_eventually_classified"></span>
				</p>
			</div>

		</div>

		<table id="auswertung_element" style="display: none">
		</table>

		<div id="custom_images_table">
			<div id="custom_images_ui">
			<video id="webcam_preview_video"></video>
					<button id="custom_images_cat" class="box inverted" onclick="addCustomCategory()">
						<span class="TRANSLATEME_add_category"></span>
					</button>
					<div id="show_errors" style="display: none">
					</div>
					<br>
					<button style="visibility: hidden;" id="start_custom_training" class="box" onclick="startCustomTraining()">
						<span class="TRANSLATEME_start_training"></span>
					</button>
			</div>
			<div id="custom_images_gallery">
				<div style="width: 95%; vertical-align: baseline;" id="custom_images">
				</div>
			</div>
		</div>

		<!--table id="custom_images_table" style="margin-left: 200px;">
			<tr>
				<td style="width: 330px; vertical-align: baseline;">
					<div>
						<button class="reasonable_box" onclick="addCustomCategory()">Kate&shy;go&shy;rie hin&shy;zu&shy;fü&shy;gen</button>
						<br>
						<br>
						<video id="webcam_preview_video"></video>
					</div>
					<div id="show_errors" style="display: none">
					</div>
					<br>
					<button style="visiblity: hidden;" id="start_custom_training" class="reasonable_box green_box" onclick="startCustomTraining()">Training starten</button>
				</td>
				<td style="width: 100%; vertical-align: baseline;" id="custom_images">
				</td>
			</tr>
		</table-->

		<div hidden="hidden" id="visualization">
			<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
			<div id="canvas_grid_visualization"></div>
			<div id="text_training">
				<p class="smaller">
					<span class="TRANSLATEME_for_images_of_each_category_test_images_are_loaded"></span>
				</p>

				<p class="smaller">
					<span class="TRANSLATEME_the_neural_network_selects_a_random_path_through_the_network_for_each_image"></span>
				</p>

				<p class="smaller">
					<span class="TRANSLATEME_if_a_wrong_result_occurs_it_is_corrected"></span>
				</p>

				<p class="smaller">
					<span class="TRANSLATEME_with_the_help_of_this_feedback_the_path_is_adjusted_until_the_network_reaches_a_correct_output"></span>
				</p>

				<p class="smaller">
					<span class="TRANSLATEME_the_more_iterations_there_are_the_more_effective_the_training"></span>
				</p>

				<p class="smaller">
					<span class="TRANSLATEME_in_this_example_there_are"></span> 
					<span id="nr_epochs"></span> 
					<span class="TRANSLATEME_iterations"></span>
				</p>
			</div>
			<div id="progress-text"></div>
			<progress id="progress" value="0" max="100"></progress>
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
		showSpinnerFullScreen();

		$(document).ready(async function() {
			asanai.set_image_div_name("custom_images");
			asanai.set_image_url_tensor_div("custom_images");

			update_after_relevant_change();
		});

		update_translations();
	</script>
</html>
