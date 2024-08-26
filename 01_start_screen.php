<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
<div>
	<div id="optimizer_div" style="display: none;"></div>
	<div class="general">
		<a href="10_select_data_screen.php"><button id="tryit" class="box">Probier es selbst!</button></a>
		<div class="navbar">
			<ul>
				<li><a id="neural_network_explanation_link" class="icon" onclick="neural_network_explanation()">Neuronales Netz</a></li>
				<li><a id="layer_explanation_link" class="icon" onclick="layer_explanation()">Layer</a></li>
				<li><a id="forward_propagation_link" class="icon" onclick="forward_propagation_explanation()">Forward Propagation</a></li>
				<li><a id="training_link" class="icon" onclick="training_explanation()">Training</a></li>
			</ul>
		</div>

		<div style="display: none" class="tab" id="neural_network_explanation_tab">
			<table>
				<tr>
					<td>
						<div class="halftext">
							<p>Ein Neuronales Netz ist ein Algorithmus, der die Funktionsweise des menschlichen Gehirns nachahmt.</p>
							<p>Damit lassen sich komplexe Aufgaben aus der Informatik, Wirtschaft, Mathematik etc. lösen.</p>
							<p>Ein Neuronales Netz wird trainiert.</p>
							<p>Dieses Modell des Machine Learning ist auch die Grundlage für Künstliche Intelligenzen.</p>
						</div>
					</td>
					<td>
						<div class="pic">
							<img class="largeimg" src="media/images/1layer_bildneu.svg">
						</div>
					</td>
				</tr>
			</table>
		</div>

		<div style="display: none" class="tab" id="layer_explanation_tab">
			<table>
				<tr>
					<td>
						<div class="halftext">
							<p>Wie das menschliche Gehirn, besteht auch ein Neuronales Netzwerk aus (künstlichen) Neuronen.</p>
							<p>Die Neuronen liegen in verschiedenen Layern. Dem Input-Layer werden die initialen Daten, wie z.B. Bilder, übergeben.</p>
							<p>Danach folgen mehrere versteckte Layer, in denen die Kanten zwischen den Knoten gewichtet werden.</p>
							<p>Der Output-Layer gibt die Bild-Kategorie aus, welches aufgrund der Input-Daten berechnet wurde.</p>
						</div>
					</td>
					<td>
						<div class="pic">
							<img class="largeimg" src="media/images/2layer_bildneuneu.svg">
						</div>
					</td>
				</tr>
			</table>
		</div>

		<div hidden="hidden" class="tab" id="forward_propagation_explanation_tab">
			<table>
				<tr>
					<td>
						<div class="halftext">
							<p>Die Neuronen nehmen Informationen auf, modifizieren sie und geben sie an das nächste Neuron weiter.</p>
							<p>Die verschieden gewichteten Kanten die zu einem Neuron führen, bestimmen den Wert des nächsten Neurons.</p>
							<p>Eine Aktivierungsfunktion entscheidet, ob bzw. mit welchem Wert Informationen an das nächste Neuron weitergegeben werden. </p>
						</div>
					</td>
					<td>
						<div class="pic" id="bild3">
							<img class="largeimg" src="media/images/3aktivierungsfunktionneuneu.svg">
						</div>
					</td>
				</tr>
			</table>
		</div>

		<div style="display: none" class="tab" id="training_explanation_tab">
			<table>
				<tr>
					<td>
						<div>
							<p>Das Netzwerk wird anhand eines klassifizierten Datensatzes trainiert.</p>
							<p>Es lernt durch Feedback, ob der vermutete Output richtig oder falsch ist.</p>
							<p>Die Werte im Input-Layer sind zu Beginn zufällig gewählt und werden mit jedem Durchgang durch das Neuronale Netzwerk angepasst, bis im Output-Layer das richtige Ergebnis ausgegeben wird.</p>
						</div>
					</td>
					<td>
						<div class="video-container">
							<video id="video" autoplay loop muted>
								<source type="video/webm" src="media/images/fcnn_animation_new_3.mp4">
							</video>
						</div>

					</td>
				</tr>
			</table>

		</div>
	</div>
</div>
<script>
	neural_network_explanation();
</script>
</body>
</html>
