	<div class="main_content">
		<div class="general">
		<div class="asanai_logo"><img class="asanai_img" src="media/images/logo_small_dark.png" /></div>

		<button class="box" id="box-wide" onclick="load_and_train_fruits_example();">
			<span class="TRANSLATEME_load_test_images_and_start_training"></span>
		</button>
		<div hidden="hidden" id="plotly">
			<div id="plotly_history"></div>
		</div>
		<div hidden="hidden" id="visualization">
			<div class="image_download_area" id="first_example_images"></div>
			<input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
			<div id="canvas_grid_visualization"></div>
			<div id="text_training" style="display: none">
				<p class="smaller"><span class="TRANSLATEME_categorized_test_images_are_loaded_for_each_fruit"></span></p>
				<p class="smaller"><span class="TRANSLATEME_the_neural_network_selects_a_random_path_through_the_network_for_each_image"></span></p>
				<p class="smaller"><span class="TRANSLATEME_if_a_wrong_result_occurs_it_is_corrected"></span></p>
				<p class="smaller"><span class="TRANSLATEME_using_this_feedback_the_path_is_adjusted_until_the_network_arrives_at_the_correct_output"></span></p>
				<p class="smaller"><span class="TRANSLATEME_the_more_passes_the_more_effective_the_training"></span></p>
				<p class="smaller"><span class="TRANSLATEME_in_this_example_there_are"></span> <span id="nr_epochs">0</span> <span class="TRANSLATEME_passes"></span></p>
			</div>
			<div style="display: none" id="progress-text"></div>
			<progress style="display: none" id="progress" value="0" max="100"></progress>
		</div>

		<button hidden="hidden" class="box" id="auswertung_anzeigen" onclick="show_auswertung();">
			<span class="TRANSLATEME_show_evaluation"></span>
		</button>

		<div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>

		<table id="auswertung_element" style="display: none">
		</table>

		<button hidden="hidden" class="box" id="yourself" onclick="try_yourself();">
			<span class="TRANSLATEME_try_yourself"></span>
		</button>

		<div hidden="hidden" id="explanation_after_training">
			<div id="fcnn_div"></div>
			<p id="cam_text" class="info-box"><span class="TRANSLATEME_hold_a_fruit_in_front_of_the_camera"></span><br></p>
			<div id="webcam_prediction"></div>
			
			<p id="explanation_input" class="info-box">
				<span class="TRANSLATEME_the_input_image_is_converted_into_a_matrix_with"></span>
				<?php print "${width_and_height}x${width_and_height}"; ?>
				<span class="TRANSLATEME_pixels_representing_height_and_width_and_color_channels_red_green_blue"></span>
			</p>
			<div id="line_exp_input" class="connectionLine"></div>
			<p id="explanation_filter" class="info-box">
				<span class="TRANSLATEME_various_features_such_as_edges_are_filtered_from_the_image_in_the_layers"></span>
			</p>

			<p id="explanation_kernel" class="info-box">
				<span class="TRANSLATEME_in_each_layer_the_image_is_sampled_section_by_section_using_kernels"></span>
			</p>

			<p id="explanation_classification" class="info-box">
				<span class="TRANSLATEME_based_on_extracted_features_the_image_is_classified"></span>
			</p>
			<div id="optimizer_div" hidden="hidden"></div>
		</div>
		<script>
			$(document).ready(async function() {
				asanai.set_image_div_name("first_example_images");
				asanai.set_image_url_tensor_div("first_example_images");
			});

			update_translations();
		</script>
	</div>
