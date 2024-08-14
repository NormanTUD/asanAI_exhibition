<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
<div class="general">
    <p>Choose a use-case or train <br> your own dataset</p>
    <div class="container">
        <button id="box1" class="box" onclick="location.href='11_Test_Images.php'">Obst</button>

        <button id="box2" class="box" onclick="location.href='12_Option2.php'">option2</button>

        <button id="box3" class="box" onclick="location.href='30_Train.php'">create dataset</button>

    </div>
</div>
<div class="navbar" id="only_1">
    <ul>
        <li><a class="icon" href="index.php"><img src="media/images/Home_icon.svg"></a></li>
    </ul>
</div>
</body>
</html>
