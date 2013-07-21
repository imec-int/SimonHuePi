#!/usr/bin/env node
var fs = require('fs');
var onoff, Gpio, led, blue, pink, orange;


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
		if (value == 0) buttonWasPressed('blue'); // 0 = pressed down
	});
	pink.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) buttonWasPressed('pink'); // 0 = pressed down
	});
	orange.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) buttonWasPressed('orange'); // 0 = pressed down
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

function buttonWasPressed(button){
	console.log(button);
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


