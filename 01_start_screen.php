<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
		<div>
			<div id="optimizer_div" style="display: none;"></div>
			<div class="general">
				<div class="asanai_logo"><img class="asanai_img" src="media/images/logo_small_dark.png" /></div>
				<div class="button shadow b_topRight" id="b_en" onclick="switchLanguage('en')">
					<div class="language_en"></div>
				</div>
				<div class="button shadow b_topRight hidden" id="b_de" onclick="switchLanguage('de')">
					<div class="language_de"></div>
				</div>
				<a href="10_select_data_screen.php"><button draggable="false" id="tryit" class="box">Ausprobieren</button></a>
				<div class="navbar">
					<ul>
						<li><a id="neural_network_explanation_link" class="icon" onclick="neural_network_explanation()">Neuronales Netz</a></li>
						<li><a id="layer_explanation_link" class="icon" onclick="layer_explanation()">Layer</a></li>
						<li><a id="forward_propagation_link" class="icon" onclick="forward_propagation_explanation()">Forward Propagation</a></li>
						<li><a id="training_link" class="icon" onclick="training_explanation()">Training</a></li>
					</ul>
				</div>

				<div style="display: none" class="tab" id="neural_network_explanation_tab">

								<div class="halftext">
									<p>Ein Neuronales Netz ist ein Algorithmus, der die Funktionsweise des menschlichen Gehirns nachahmt.</p>
									<p>Damit lassen sich komplexe Aufgaben aus der Informatik, Wirtschaft, Mathematik etc. lösen.</p>
									<p>Ein Neuronales Netz wird trainiert.</p>
									<p>Dieses Modell des Machine Learning ist auch die Grundlage für Künstliche Intelligenzen.</p>
								</div>

								<div class="pic">
									<img class="largeimg" src="media/images/1layer_bildneu_w.svg">
								</div>
				</div>

				<div style="display: none" class="tab" id="layer_explanation_tab">
								<div class="halftext">
									<p>Wie das menschliche Gehirn, besteht auch ein Neuronales Netzwerk aus (künstlichen) Neuronen.</p>
									<p>Die Neuronen liegen in verschiedenen Layern. Dem Input-Layer werden die initialen Daten, wie z.B. Bilder, übergeben.</p>
									<p>Danach folgen mehrere versteckte Layer, in denen die Kanten zwischen den Knoten gewichtet werden.</p>
									<p>Der Output-Layer gibt die Bild-Kategorie aus, welches aufgrund der Input-Daten berechnet wurde.</p>
								</div>
								<div class="pic">
									<img class="largeimg" src="media/images/2layer_bildneuneu.svg">
								</div>
				</div>

				<div style="display: none"  class="tab" id="forward_propagation_explanation_tab">
								<div class="halftext">
									<p>Die Neuronen nehmen Informationen auf, modifizieren sie und geben sie an das nächste Neuron weiter.</p>
									<p>Die verschieden gewichteten Kanten die zu einem Neuron führen, bestimmen den Wert des nächsten Neurons.</p>
									<p>Eine Aktivierungsfunktion entscheidet, ob bzw. mit welchem Wert Informationen an das nächste Neuron weitergegeben werden. </p>
								</div>
								<div class="pic" id="bild3">
									<img class="largeimg" src="media/images/3aktivierungsfunktionneuneu.svg">
								</div>
				</div>

				<div style="display: none" class="tab" id="training_explanation_tab">
								<div class="halftext">
									<p>Das Netzwerk wird anhand eines klassifizierten Datensatzes trainiert.</p>
									<p>Es lernt durch Feedback, ob der vermutete Output richtig oder falsch ist.</p>
									<p>Die Werte im Input-Layer sind zu Beginn zufällig gewählt und werden mit jedem Durchgang durch das Neuronale Netzwerk angepasst, bis im Output-Layer das richtige Ergebnis ausgegeben wird.</p>
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
			showSpinnerFullScreen();
		</script>
	</body>
</html>
