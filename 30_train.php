<?php
	$GLOBALS["use_navigation"] = 1;
	include("header.php");
?>
		<div class="general">
			<div style="clear: both;"></div>
				<div class="flex_box">
					<div id="webcam_prediction"></div>
				</div>
			</div>
		</div>

		<div class="navbar">
			<ul>
				<li><a class="icon" href="01_start_screen.php"><img src="media/images/Home_icon.svg"></a></li>
				<li><a class="icon" onclick="history.back()"><img src="media/images/Back_icon.svg"></a></li>
			</ul>
		</div>

		<div id="optimizer_div" style="display:none"></div>

		<table>
			<tr>
				<td><div id="webcam_preview"><video id="webcam_preview_video"></video></div></td>
				<td>ASDF</td>
			</tr>
		</table>

		<script>
			$(document).ready(async function() {
				while (!done_loading) {
					await sleep(50);
				}

				if(asanai) {
					asanai.tf_data_webcam($("#webcam_preview").find("video")[0])
				} else {
					log("asanai is undefined");
				}
			});
		</script>
	</body>
</html>
