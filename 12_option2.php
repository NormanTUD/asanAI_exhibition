    <div class="main_content">
        <div class="general">
            <button class="box" id="box-wide" onclick="load_and_train_scheine_muenzen_schluessel();">
                <span class="TRANSLATEME_load_test_images_and_start_training"></span>
            </button>
            <div hidden="hidden" id="plotly">
                <div id="plotly_history"></div>
            </div>
            <div hidden="hidden" id="visualization">
                <div class="image_download_area" id="second_example_images"></div>
                <input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
                <div id="canvas_grid_visualization"></div>
                <div id="text_training" style="display: none">
                    <p class="smaller">
                        <span class="TRANSLATEME_for_each_category_categorized_test_images_are_loaded"></span>
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

                    <p class="smaller"><span class="TRANSLATEME_the_higher_up_the_images_the_more_sure_the_network_is"></span></p>

                    <p class="smaller">
                        <span class="TRANSLATEME_in_this_example_there_are"></span> 
                        <span id="nr_epochs"></span> 
                        <span class="TRANSLATEME_iterations">.</span>
                    </p>
                </div>
                <div style="display: none" id="progress-text"></div>
                <progress style="display: none" id="progress" value="0" max="100"></progress>
            </div>

            <button hidden="hidden" class="box" id="auswertung_anzeigen" onclick="show_auswertung();">
                <span class="TRANSLATEME_show_evaluation font_bold"></span>
            </button>

            <div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>

            <table id="auswertung_element" style="display: none">
            </table>
            <div id="success_rate" style="display: none"></div>

            <button hidden="hidden" class="box" id="yourself" onclick="try_yourself();">
                <span class="TRANSLATEME_try_yourself"></span>
            </button>


            <div hidden="hidden" id="explanation_after_training">
            <div id="fcnn_div"></div>
            <p id="cam_text" class="info-box"><span class="TRANSLATEME_hold_a_key_coin_or_bill_into_the_camera"></span><br></p>
            <div id="webcam_prediction"></div>
            <div id="webcam_prediction_results"></div>
            
            <p id="explanation_input" class="info-box">
                <span class="TRANSLATEME_the_input_image_is_converted_into_a_matrix_with"></span>
                <?php print "{$width_and_height}x{$width_and_height}"; ?>
                <span class="TRANSLATEME_pixels_representing_height_and_width_and_color_channels_red_green_blue"></span>
            </p>
            <div id="line_exp_input" class="connectionLine"></div>
            <p id="explanation_filter" class="info-box">
                <span class="TRANSLATEME_various_features_such_as_edges_are_filtered_from_the_image_in_the_layers"></span>
            </p>
            <div id="line_exp_filter" class="connectionLine"></div>

            <p id="explanation_kernel" class="info-box">
                <span class="TRANSLATEME_in_each_layer_the_image_is_sampled_section_by_section_using_kernels"></span>
            </p>
            <div id="line_exp_kernel" class="connectionLine"></div>

            <p id="explanation_classification" class="info-box">
                <span class="TRANSLATEME_based_on_extracted_features_the_image_is_classified"></span>
            </p>
            <div id="line_exp_classification" class="connectionLine"></div>
        </div>
            <div class="button shadow b_topRight hidden" id="b_de" onclick="switch_language()">
                <div class="language_de"></div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(async function() {
            asanai.set_image_div_name("second_example_images");
            asanai.set_image_url_tensor_div("second_example_images");
        });

        update_translations();
    </script>
