<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
<div>
	<div class="general">
		<a href="10_select_data_screen.php"><button id="tryit" class="box">Probier es selbst!</button></a>
		<div class="navbar">
			<ul>
				<li><a id="icon1" class="icon" onclick="neural_network_explanation()">Neuronales Netz</a></li>
				<li><a id="icon2" class="icon" onclick="layer_explanation()">Layer</a></li>
				<li><a id="icon3" class="icon" onclick="forward_propagation_explanation()">Forward Propagation</a></li>
				<li><a id="icon4" class="icon" onclick="training_explanation()">Training</a></li>
			</ul>
		</div>

		<div class="text" id="startseite_text_1">
			<p>Ein Neuronales Netz ist ein Algorithmus, der die Funktionsweise des menschlichen Gehirns nachahmt.<p>
			<p>Damit lassen sich komplexe Aufgaben aus der Informatik, Wirtschaft, Mathematik etc. lösen.</p>
			<p>Ein Neuronales Netz wird trainiert.</p>
			<p>Dieses Modell des Machine Learning ist auch die Grundlage für Künstliche Intelligenzen.</p>
		</div>

		<div class="pic" id="example_static_fcnn">

		<img class="largeimg" src="media/images/1layer_bildneu.svg">
		</div>

		<div hidden="hidden" class="text" id="startseite_text_2">
			<p>Wie das menschliche Gehirn, besteht auch ein Neuronales Netzwerk aus (künstlichen) Neuronen.</p>
			<p>Die Neuronen liegen in verschiedenen Layern. Dem Input-Layer werden die initialen Daten, wie z.B. Bilder, übergeben.</p>
			<p>Danach folgen mehrere versteckte Layer, in denen die Kanten zwischen den Knoten gewichtet werden.</p>
			<p>Der Output-Layer gibt die Bild-Kategorie aus, welches aufgrund der Input-Daten berechnet wurde.</p>
		</div>

		<div class="pic" hidden="hidden" id="example_static_fcnn_with_boxes">
			<img class="largeimg" src="media/images/2layer_bildneuneu.svg">
		</div>

		<div hidden="hidden" class="text" id="startseite_text_3">
			<p>Die Neuronen nehmen Informationen auf, modifizieren sie und geben sie an das nächste Neuron weiter.</p>
			<p>Die verschieden gewichteten Kanten die zu einem Neuron führen, bestimmen den Wert des nächsten Neurons.</p>
			<p>Eine Aktivierungsfunktion entscheidet, ob bzw. mit welchem Wert Informationen an das nächste Neuron weitergegeben werden. </p>
		</div>

		<div class="pic" hidden="hidden" id="bild3">
		<img class="largeimg" src="media/images/3aktivierungsfunktionneuneu.svg">
		</div>

		<div hidden="hidden" class="text" id="startseite_text_4">
			<p>Das Netzwerk wird anhand eines klassifizierten Datensatzes trainiert.</p>
			<p>Es lernt durch Feedback, ob der vermutete Output richtig oder falsch ist.</p>
			<p>Die Werte im Input-Layer sind zu Beginn zufällig gewählt und werden mit jedem Durchgang durch das Neuronale Netzwerk angepasst, bis im Output-Layer das richtige Ergebnis ausgegeben wird.</p>
		</div>
		<div hidden="hidden" id="fcnn_animated_video">
			<video class="halfvideo" autoplay loop muted>
			<source type="video/webm" src="media/images/fcnn_animation_new_3.mp4">
		</video>
		</div>
	</div>
</div>
</body>
</html>
