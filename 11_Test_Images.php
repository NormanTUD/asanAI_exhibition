<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
    <div class="groeße">
        <div class="general">
            <button class="box" id="box-wide" onclick="load_exhib_data_and_train();toggle_button(1)">Test-Bilder laden und Training beginnen</button>
            <div id="test_images"></div>
            <div hidden="hidden" id="plotly">
                <div id="plotly_history"></div>
            </div>
            <div hidden="hidden" id="visualization">
                <input hidden="hidden" id="visualize_images_in_grid" type="checkbox" checked/>
                <div id="canvas_grid_visualization"></div>
                <div id="text_training">Für jedes Obst werden kategorisierte Test-Bilder geladen.<br>
                    Das Neuronale Netz wählt für jedes Bild einen zufälligen Weg durch das Netzwerk.<br> Kommt es zu einem falschen Ergebnis, wird es korrigiert.<br>
                    Mithilfe dieses Feedbacks wird der Weg angepasst bis das Netz zu einem richtigen Output gelangt.<br>
                    Je mehr Durchgänge es gibt, desto effektiver ist das Training.<br> In diesem Beispiel sind es 100 Durchgänge.</div>
                <div id="progress-text"></div>
                <progress id="progress" value="0" max="100"></progress>
            </div>
            <div id="math_tab_code"></div>
            <button hidden="hidden" class="box" id="evaluation" onclick="toggle_button(2); matrix_texts()">Auswertung anzeigen</button>
            <div hidden="hidden" class="confusion_matrix" id="confusion_matrix"></div>
            <p hidden="hidden" class="matrix_text" id="matrix_text"></p>
            <p hidden="hidden" class="matrix_text" id="matrix_text_apfel"></p>
            <p hidden="hidden" class="matrix_text" id="matrix_text_orange"></p>
            <p hidden="hidden" class="matrix_text" id="matrix_text_banane"></p>
            <button hidden="hidden" class="box" id="yourself" onclick="toggle_button(3)">Probier es aus</button>
            <div hidden="hidden" id="status_3">
                <div id="fcnn_div"></div>
                <div hidden="hidden">
                    <div hidden="hidden" id="internal_states"></div>
                </div>
                <p id="cam_text" style="font-size: 5vh; text-align: left; position: absolute; left: 13vw; top: 3vh; line-height: 100%">Halte eine Frucht <br> in die Kamera:</p>
                <div id="webcam_prediction"></div>
                <p id="erklärung">Das Input-Bild wird zu einer 40x40-Pixel-Matrix, die Höhe und Breite sowie
                    in der 3. Dimension die Farbkanäle rot, grün und blau abbildet. </br>
                In den Layern werden verschieden Merkmale wie z.B. Kanten aus dem Bild gefiltert.</br>
                    In jedem Neuron wird das Bild abschnittsweise über Kernels abgetastet.</br>
                    Anhand der extrahierten Merkmale kann das Bild letztendlich klassifiziert werden. </p>
            </div>
        </div>
        <div class="navbar">
            <ul>
                <li><a class="icon" href="01_StartScreen.php"><img src="media/images/Home_icon.svg"></a></li>
                <li><a class="icon" onclick="history.back()"><img src="media/images/Back_icon.svg"></a></li>
            </ul>
        </div>
        <div id="optimizer_div" hidden="hidden"></div>
    </div>
</body>
</html>
<script>

</script>
