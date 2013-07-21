App = {
	sounds:{
		blue: {
			audioEl: null,
			src: '/sounds/blue.mp3'
		},
		orange: {
			audioEl: null,
			src: '/sounds/orange.mp3'
		},
		pink: {
			audioEl: null,
			src: '/sounds/pink.mp3'
		},
		start: {
			audioEl: null,
			src: '/sounds/start.m4a'
		},
		fail: {
			audioEl: null,
			src: '/sounds/fail.mp3'
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

		setTimeout(function(){
			App.playsound('start');
		},3000);


	},

	playsound: function(button){
		console.log("playing sound: "+  button);
		console.log(App.sounds[button]);
		App.sounds[button].audioEl.currentTime = 0;
		App.sounds[button].audioEl.play();
	}
};

$(App.pageloaded);