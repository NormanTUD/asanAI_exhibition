		<div id="optimizer_div" style="display: none;"></div>
		<div class="general">
		<div class="asanai_logo"><img class="asanai_img" src="media/images/logo_small_dark.png" /></div>
		<h2 style="margin: 200px;"><span class="TRANSLATEME_choose_an_existing_dataset_or_create_your_own"></span></h2>
		<div class="container">
			<button id="box1" class="box" onclick="load_page_with_params('11_test_images.php')">
				<span class="TRANSLATEME_fruit"></span>
			</button>
			<button id="box2" class="box" onclick="load_page_with_params('12_option2.php')">
				<span class="TRANSLATEME_everyday_objects"></span>
			</button>
			<button id="box3" class="box" onclick="load_page_with_params('30_train.php')">
				<span class="TRANSLATEME_own_dataset"></span>
			</button>
		</div>
		<div class="button shadow b_topRight hidden" id="b_de" onclick="switch_language()">
			<div class="language_de"></div>
		</div>
		<div class="button shadow b_topRight2" onclick="closeInfopanel()">
			<a class="close" href="01_start_screen.php"></a>
		</div>
	</body>
	<script>
		update_translations();
	</script>
</html>
