App = {
	pageloaded: function() {
		console.log("page loaded");
		$(window).keydown(function(e){
			console.log(e.keyCode);
			var color = "";
			if (e.keyCode == 71) { // g
				color = "blue";
			}else if(e.keyCode == 72){ // h
				color = "orange";
			}else if(e.keyCode == 74){ // j
				color = "pink";
			}else if(e.keyCode == 8){ // space

			}
			if(color.length > 0){
				var jqxhr = $.post("./simon", {"input": color},
				function(data) {
					console.log(color);
				})
				.fail(function() { alert("error"); });
			}

		});
	}
};

$(App.pageloaded);