<?php
	$GLOBALS['translations'] = array(
		'en' => array(
			'optimizer' => 'Optimizer',
			'a_neural_network_is_an_algorithm_that_mimics_the_functionality_of_the_human_brain' => 'A Neural Network is an algorithm that mimics the functionality of the human brain.',
			'it_can_solve_complex_tasks_in_computer_science_economics_mathematics_etc' => 'It can solve complex tasks in computer science, economics, mathematics, etc.',
			'a_neural_network_is_trained' => 'A Neural Network is trained.',
			'this_model_of_machine_learning_is_also_the_basis_for_artificial_intelligences' => 'This model of Machine Learning is also the basis for Artificial Intelligences.',

			'like_the_human_brain_a_neural_network_also_consists_of_artificial_neurons' => 'Like the human brain, a neural network also consists of (artificial) neurons.',
			'the_neurons_are_arranged_in_different_layers_the_input_layer_receives_the_initial_data_such_as_images' => 'The neurons are arranged in different layers. The input layer receives the initial data, such as images.',
			'afterwards_several_hidden_layers_follow_where_the_edges_between_the_nodes_are_weighted' => 'Afterwards, several hidden layers follow where the edges between the nodes are weighted.',
			'the_output_layer_provides_the_image_category_calculated_based_on_the_input_data' => 'The output layer provides the image category calculated based on the input data.',

			'the_neurons_receive_modify_and_pass_on_information_to_the_next_neuron' => 'The neurons receive, modify, and pass on information to the next neuron.',
			'the_variously_weighted_edges_leading_to_a_neuron_determine_the_value_of_the_next_neuron' => 'The variously weighted edges leading to a neuron determine the value of the next neuron.',
			'an_activation_function_decides_whether_and_with_what_value_information_is_passed_on_to_the_next_neuron' => 'An activation function decides whether and with what value information is passed on to the next neuron.',

			'the_network_is_trained_on_a_classified_dataset' => 'The network is trained on a classified dataset.',
			'it_learns_through_feedback_whether_the_predicted_output_is_right_or_wrong' => 'It learns through feedback whether the predicted output is right or wrong.',
			'the_values_in_the_input_layer_are_randomly_chosen_at_first_and_adjusted_with_each_pass_through_the_neural_network_until_the_correct_result_is_output_in_the_output_layer' => 'The values in the input layer are randomly chosen at first and adjusted with each pass through the neural network until the correct result is output in the output layer.',
			'learning_rate' => 'Learning Rate',
			'try_it' => "Try it",
			"neural_network" => "Neuronales Netz",

			'choose_an_existing_dataset_or_create_your_own' => 'Choose an existing dataset or create your own',
			'fruit' => 'Fruit',
			'everyday_objects' => 'Everyday objects',
			'own_dataset' => 'Own dataset',
		),
		'de' => array(
			'optimizer' => 'Optimierer',
			'a_neural_network_is_an_algorithm_that_mimics_the_functionality_of_the_human_brain' => 'Ein Neuronales Netz ist ein Algorithmus, der die Funktionsweise des menschlichen Gehirns nachahmt.',
			'it_can_solve_complex_tasks_in_computer_science_economics_mathematics_etc' => 'Damit lassen sich komplexe Aufgaben aus der Informatik, Wirtschaft, Mathematik etc. lösen.',
			'a_neural_network_is_trained' => 'Ein Neuronales Netz wird trainiert.',
			'this_model_of_machine_learning_is_also_the_basis_for_artificial_intelligences' => 'Dieses Modell des Machine Learning ist auch die Grundlage für Künstliche Intelligenzen.',

			'like_the_human_brain_a_neural_network_also_consists_of_artificial_neurons' => 'Wie das menschliche Gehirn, besteht auch ein Neuronales Netzwerk aus (künstlichen) Neuronen.',
			'the_neurons_are_arranged_in_different_layers_the_input_layer_receives_the_initial_data_such_as_images' => 'Die Neuronen liegen in verschiedenen Layern. Dem Input-Layer werden die initialen Daten, wie z.B. Bilder, übergeben.',
			'afterwards_several_hidden_layers_follow_where_the_edges_between_the_nodes_are_weighted' => 'Danach folgen mehrere versteckte Layer, in denen die Kanten zwischen den Knoten gewichtet werden.',
			'the_output_layer_provides_the_image_category_calculated_based_on_the_input_data' => 'Der Output-Layer gibt die Bild-Kategorie aus, welches aufgrund der Input-Daten berechnet wurde.',

			'the_neurons_receive_modify_and_pass_on_information_to_the_next_neuron' => 'Die Neuronen nehmen Informationen auf, modifizieren sie und geben sie an das nächste Neuron weiter.',
			'the_variously_weighted_edges_leading_to_a_neuron_determine_the_value_of_the_next_neuron' => 'Die verschieden gewichteten Kanten die zu einem Neuron führen, bestimmen den Wert des nächsten Neurons.',
			'an_activation_function_decides_whether_and_with_what_value_information_is_passed_on_to_the_next_neuron' => 'Eine Aktivierungsfunktion entscheidet, ob bzw. mit welchem Wert Informationen an das nächste Neuron weitergegeben werden.',

			'the_network_is_trained_on_a_classified_dataset' => 'Das Netzwerk wird anhand eines klassifizierten Datensatzes trainiert.',
			'it_learns_through_feedback_whether_the_predicted_output_is_right_or_wrong' => 'Es lernt durch Feedback, ob der vermutete Output richtig oder falsch ist.',
			'the_values_in_the_input_layer_are_randomly_chosen_at_first_and_adjusted_with_each_pass_through_the_neural_network_until_the_correct_result_is_output_in_the_output_layer' => 'Die Werte im Input-Layer sind zu Beginn zufällig gewählt und werden mit jedem Durchgang durch das Neuronale Netzwerk angepasst, bis im Output-Layer das richtige Ergebnis ausgegeben wird.',
			'learning_rate' => 'Lernrate',
			'try_it' => "Ausprobieren",
			"neural_network" => "Neural Network",

			'choose_an_existing_dataset_or_create_your_own' => 'Wähle einen existierenden Datensatz oder erstelle deinen Eigenen',
			'fruit' => 'Obst',
			'everyday_objects' => 'Alltagsgegenstände',
			'own_dataset' => 'Eigener Datensatz',
		)
	);


	function checkSubElementsKeys($array) {
		$keys = [];

		foreach ($array as $subArray) {
			if (!is_array($subArray)) {
				die("Sub-element is not an array");
			}

			$subKeys = array_keys($subArray);

			if (empty($keys)) {
				$keys = $subKeys;
			} elseif ($keys !== $subKeys) {
				$missingKeys = array_diff($keys, $subKeys);
				if($missingKeys) {
					die("Missing key: " . reset($missingKeys));
				}
			}
		}

		return true;
	}

	if(!checkSubElementsKeys($GLOBALS["translations"])) {
		die("Sub-elements do not have the same keys");
	}

	if(!count($GLOBALS["translations"]["en"])) {
		die("No elements in translations specified.");
	}

	print json_encode($translations);
?>
