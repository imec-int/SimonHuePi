App = {
	sounds:{
		blue: {
			audioEl: null,
			src: '/sounds/breakfree.mp3',
			colorcode: '#1535d7'
		},
		orange: {
			audioEl: null,
			src: '/sounds/proudmary.mp3',
			colorcode: '#98c83e'
		},
		pink: {
			audioEl: null,
			src: '/sounds/bumbalu.mp3',
			colorcode: '#ffa500'
		}
	},

	initSounds: function(){
		for(var b in App.sounds){
			App.sounds[b].audioEl = document.createElement("audio");
			App.sounds[b].audioEl.setAttribute("src", App.sounds[b].src);
		}

		App.socket.on('playsound', App.playsound);
	},

	initSocket: function(){
		//socket IO:
		if(!App.socket){
			// socket.io initialiseren
			App.socket = io.connect(window.location.hostname);
			// some debugging statements concerning socket.io
			App.socket.on('reconnecting', function(seconds){
				console.log('reconnecting in ' + seconds + ' seconds');
			});
			App.socket.on('reconnect', function(){
				console.log('reconnected');
			});
			App.socket.on('reconnect_failed', function(){
				console.log('failed to reconnect');
			});
		}
	},

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

		App.initSocket();
		App.initSounds();

	},

	playsound: function(button){
		console.log(button);
		App.sounds[button].audioEl.currentTime = 0;
		App.sounds[button].audioEl.play();
	}
};

$(App.pageloaded);