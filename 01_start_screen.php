<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
<div class="groeße">
    <div class="general">
        <a href="10_SelectDatasetScreen.php">
            <button id="tryit" class="box">Probier es selbst!</button>
        </a>
        <div class="navbar">
            <ul>
                <li><a id="icon1" class="icon" onclick="button1()">Neuronales Netz</a></li>
                <li><a id="icon2" class="icon" onclick="button2()">Layer</a></li>
                <li><a id="icon3" class="icon" onclick="button3()">Forward Propagation</a></li>
                <li><a id="icon4" class="icon" onclick="button4()">Training</a></li>
            </ul>
        </div>
            <div class="text" id="text1">
                <p>Ein Neuronales Netz ist ein Algorithmus,
                    <br>der die Funktionsweise des menschlichen Gehirns nachahmt.
                    <br>Damit lassen sich komplexe Aufgaben aus der Informatik, Wirtschaft, Mathematik etc. lösen.
                    <br>Ein Neuronales Netz wird trainiert.
                    <br>Dieses Modell des Machine Learning ist auch
                    <br>die Grundlage für Künstliche Intelligenzen.</p>
            </div>
        <div class="pic" id="bild1">
            <img class="largeimg" src="media/images/1layer_bildneu.svg">
        </div>
            <div hidden="hidden" class="text" id="text2">
                <p>Wie das menschliche Gehirn, besteht auch ein Neuronales Netzwerk aus (künstlichen) Neuronen.
                    <br>Die Neuronen liegen in verschiedenen Layern.
                    <br>Dem Input-Layer werden die initialen Daten, wie z.B. Bilder, übergeben.
                    <br>Danach folgen mehrere versteckte Layer, in denen die Kanten zwischen den Knoten gewichtet werden.
                    <br>Der Output-Layer gibt die Bild-Kategorie aus, welches aufgrund der Input-Daten berechnet wurde.</p>
            </div>
            <div class="pic" hidden="hidden" id="bild2">
                <img class="largeimg" src="media/images/2layer_bildneuneu.svg">
            </div>
            <div hidden="hidden" class="text" id="text3">
                <p>Die Neuronen nehmen Informationen auf, modifizieren sie
                    und geben sie an das nächste Neuron weiter.
                    <br>Die verschieden gewichteten Kanten die zu einem Neuron führen,
                    bestimmen den Wert des nächsten Neurons.
                    <br>Eine Aktivierungsfunktion entscheidet, ob bzw. mit welchem Wert Informationen an das nächste Neuron weitergegeben werden. </p>
            </div>
        <div class="pic" hidden="hidden" id="bild3">
            <img class="largeimg" src="media/images/3aktivierungsfunktionneuneu.svg">
        </div>
            <div hidden="hidden" class="text" id="text4">
                <p>Das Netzwerk wird anhand eines klassifizierten Datensatzes trainiert.
                    <br>Es lernt durch Feedback, ob der vermutete Output richtig oder falsch ist.
                    <br>Die Werte im Input-Layer sind zu Beginn zufällig gewählt und werden mit jedem Durchgang
                    durch das Neuronale Netzwerk angepasst,
                    bis im Output-Layer das richtige Ergebnis ausgegeben wird. </p>
            </div>
        <div hidden="hidden" id="bild4">
            <video class="largeimg" autoplay loop muted>
                <source type="video/webm" src="media/images/fcnn_animation_new_3.mp4">
            </video>
        </div>
    </div>
</div>
</body>
</html>
