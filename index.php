<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
	<div id="optimizer_div" style="display:none"></div>

        <div id="main">
            <!-- Content will be loaded here via AJAX -->
        </div>

        <script>
		// Function to load page with AJAX using GET method and appending query params
		function load_page_with_params(url) {
			if(url != "index.php") {
				log("Loading url " + url);
				// Perform the AJAX request
				$.ajax({
				url: url,
					type: 'GET',
					success: function(response) {
						// Replace content in the main div
						$('#main').html(response);
						$("#nr_epochs").html(nr_epochs);
						update_translations();
					},
					error: function(xhr, status, error) {
						// Log error to console
						$('#main').html("There was an error load the requested page");
						update_translations();
						console.error('AJAX Error:', status, error);
						console.trace();
					}
				});
			} else {
				console.log("Will not recursively load index.php");
			}
		}
		load_page_with_params("start.php");
        </script>
</html>
