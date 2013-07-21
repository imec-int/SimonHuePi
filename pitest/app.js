#!/usr/bin/env node
var fs = require('fs');
var lights = require('./lights');
var onoff, Gpio, led, blue, pink, orange;

var lightids = [1,2,3];
var buttons2lights = {
	blue  : {id: 1, hue: 37683, sat: 252, bri: 173},
	pink  : {id: 2, hue: 56615, sat: 204, bri: 168},
	orange: {id: 3, hue: 5825 , sat: 224, bri: 247}
}


function watchGpio(){
	var debounceTimeout = 240;

	onoff = require('onoff');
	Gpio = require('onoff').Gpio;
	led = new Gpio(17, 'out');

	blue = new Gpio(23, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});

	pink = new Gpio(25, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});

	orange = new Gpio(22, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});


	blue.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) input('blue'); // 0 = pressed down
	});
	pink.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) input('pink'); // 0 = pressed down
	});
	orange.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) input('orange'); // 0 = pressed down
	});

	blink();
	printStatus();
}

function blink(){
	led.writeSync( 1 );
	setTimeout(function(){
		led.writeSync( 0 );
	},300);
}

function input(button){
	console.log(button);

	var light = buttons2lights[button];

	lights.burstLight(light.id, {
		hue: light.hue,
		sat: light.sat,
		bri: light.bri
	});
}

function printStatus(){
	console.log("Current State:");
	console.log("- blue: " + blue.readSync() );
	console.log("- pink: " + pink.readSync() );
	console.log("- orange: " + orange.readSync() );
	console.log("==============");
}

// check if we're on the Raspberry Pi:
fs.exists('/sys/class/gpio/', function (exists){
	if(exists){
		console.log("We're on the Raspberry Pi.. watching GPIOs");
		watchGpio();
	}else{
		console.log("Looks like we're not on the Raspberry Pi.");
	}
});

// turn on all lights
for (i in lightids){
	lights.turnOnLight(lightids[i]);
}


