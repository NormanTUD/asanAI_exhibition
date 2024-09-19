<?php
	$GLOBALS["dont_load_asanai"] = 1;
	include("header.php");
?>
        <div id="main">
            <!-- Content will be loaded here via AJAX -->
        </div>

        <script>
		// Function to load page with AJAX using GET method and appending query params
		var current_url = null;

		function load_page_with_params(url) {
			if(url != "index.php") {
				$(".button-header").show();
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

						if(
							url.startsWith("01_start_screen")
						) {
							$("#close_button").hide();
						} else {
							$("#close_button").show();
						}

						current_url = url;
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

		$(document).ready(async function() {
			$(document).on('click', function(event) {
				// Check if the current URL is 'start.php'
				if (current_url && current_url.endsWith('start.php')) {
					load_page_with_params('01_start_screen.php');
					// Prevent the default action of the click (optional)
					event.preventDefault();
				}
			});
		});
        </script>
	</body>
</html>
