var util = require('util');

var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState;

var hostname = "10.0.1.2";
var username = "robbywauters"; // username

var api = new HueApi(hostname, username);


function turnOnLight(lightid){
	api.setLightState(lightid, {
		on: true,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);
	});
}

function burstLight(lightid, state, callback){
	// 2 helper functions:
	function bright(cb){
		api.setLightState(lightid, {
			hue: state.hue,
			bri: state.bri,
			sat: state.sat,
			transitiontime: 0
		}, function (err, lights) {
			if (err) console.log(err);
			if(cb) cb();
		});
	}

	function dark(cb){
		api.setLightState(lightid, {
			hue: 0,
			bri: 0,
			sat: 0,
			transitiontime: 1
		}, function (err, lights) {
			if (err) console.log(err);
		});
	}

	bright( function (){
		dark();
	});
}

exports.turnOnLight = turnOnLight;
exports.burstLight = burstLight;
