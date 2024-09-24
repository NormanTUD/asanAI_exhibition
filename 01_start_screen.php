		<div>
			<div class="general">
				<span onclick="load_page_with_params('10_select_data_screen.php')"><button draggable="false" id="tryit" class="box"><span class="TRANSLATEME_try_it"></span></button></span>
				<div class="navbar">
					<ul>
						<li><a id="neural_network_explanation_link" class="icon" onclick="neural_network_explanation()"><span class="TRANSLATEME_neural_network"></span></a></li>
						<li><a id="layer_explanation_link" class="icon" onclick="layer_explanation()"><span>Layer</span></a></li>
						<li><a id="forward_propagation_link" class="icon" onclick="forward_propagation_explanation()"><span>Forward Propagation</span></a></li>
						<li><a id="training_link" class="icon" onclick="training_explanation()"><span>Training</span></a></li>
					</ul>
				</div>

				<div style="display: none" class="tab" id="neural_network_explanation_tab">
					<div class="halftext">
						<p><span class="TRANSLATEME_a_neural_network_is_an_algorithm_that_mimics_the_functionality_of_the_human_brain"></span></p>
						<p><span class="TRANSLATEME_it_can_solve_complex_tasks_in_computer_science_economics_mathematics_etc"></span></p>
						<p><span class="TRANSLATEME_a_neural_network_is_trained"></span></p>
						<p><span class="TRANSLATEME_this_model_of_machine_learning_is_also_the_basis_for_artificial_intelligences"></span></p>
					</div>

					<div class="pic">
						<img class="largeimg" src="media/images/1layer_bildneu_w.svg">
					</div>
				</div>

				<div style="display: none" class="tab" id="layer_explanation_tab">
					<div class="halftext">
						<p><span class="TRANSLATEME_like_the_human_brain_a_neural_network_also_consists_of_artificial_neurons"></span></p>
						<p><span class="TRANSLATEME_the_neurons_are_arranged_in_different_layers_the_input_layer_receives_the_initial_data_such_as_images"></span></p>
						<p><span class="TRANSLATEME_afterwards_several_hidden_layers_follow_where_the_edges_between_the_nodes_are_weighted"></span></p>
						<p><span class="TRANSLATEME_the_output_layer_provides_the_image_category_calculated_based_on_the_input_data"></span></p>

					</div>
					<div class="pic">
						<img class="largeimg" src="media/images/2layer_bildneuneu.svg">
					</div>
				</div>

				<div style="display: none"  class="tab" id="forward_propagation_explanation_tab">
					<div class="halftext">
						<p><span class="TRANSLATEME_the_neurons_receive_modify_and_pass_on_information_to_the_next_neuron"></span></p>
						<p><span class="TRANSLATEME_the_variously_weighted_edges_leading_to_a_neuron_determine_the_value_of_the_next_neuron"></span></p>
						<p><span class="TRANSLATEME_an_activation_function_decides_whether_and_with_what_value_information_is_passed_on_to_the_next_neuron"></span></p>
					</div>
					<div class="pic" id="bild3">
						<img class="largeimg" src="media/images/3aktivierungsfunktionneuneu.svg">
					</div>
				</div>

				<div style="display: none" class="tab" id="training_explanation_tab">
					<div class="halftext">
						<p><span class="TRANSLATEME_the_network_is_trained_on_a_classified_dataset"></span></p>
						<p><span class="TRANSLATEME_it_learns_through_feedback_whether_the_predicted_output_is_right_or_wrong"></span></p>
						<p><span class="TRANSLATEME_the_values_in_the_input_layer_are_randomly_chosen_at_first_and_adjusted_with_each_pass_through_the_neural_network_until_the_correct_result_is_output_in_the_output_layer"></span></p>
					</div>
					<div class="video-container">
						<video id="video" autoplay loop muted>
							<source type="video/webm" src="media/images/fcnn_animation_new_3.mp4">
						</video>
					</div>
				</div>
			</div>
		</div>
		<script>
			neural_network_explanation();

			update_translations();
		</script>
