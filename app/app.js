#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var util = require('util');

var config = require('./config');
var lights = require('./lights');

// *************************
// *** In Game Variables ***
// *************************

var colorMap = {blue:0, orange:1, pink:2};
var currentSequence = [];
var currentSequenceIndex = 0;
var currentNumberOfInputs = 0;
var timerInterval = 0;
var players = [0,1,2];
var currentPlayer = 0;
var currentPlayerIndex = 0;
var timeToPush = 5000; // 2.5sec

// ******************
// *** WEB SERVER ***
// ******************

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('123456789987654321'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function (req, res){
	res.render('index', { title: 'Hello World' });
});

app.post('/simon', function (req, res){
	// responsd immediatly:
	res.json('thx');
	console.log(req.body);
	input(req.body.input);
});

resetGame();


function resetGame(){
	console.log("reset game");
	currentSequence = [];
	currentSequenceIndex = 0;
	currentPlayerIndex = 0;
	currentPlayer = players[currentPlayerIndex];
	currentNumberOfInputs = 0;
	clearTimeout(timerInterval);
	initLights();
}

function initLights(){
	// set lights to right color
	lights.setLight(config.colors.blue.lightid, config.colors.blue.hue, config.colors.blue.sat, null);
	lights.setLight(config.colors.orange.lightid, config.colors.orange.hue, config.colors.orange.sat, null);
	lights.setLight(config.colors.pink.lightid, config.colors.pink.hue, config.colors.pink.sat, null);
}

function input(inp){
	// inp is [blue, orange or pink]
	currentNumberOfInputs++;
	clearTimeout(timerInterval);

	console.log("Input: "+inp+"  | inputNr: "+ currentNumberOfInputs + " | "+currentSequence.length);

	// PLAY SOUND

	// COLOR HUE
	lights.burstLight(config.colors[inp].lightid);

	// validate input (new sequence or correctly matched sequence)
	if(isNewInput(inp)){
		console.log("new input");
		// add new input to current sequence
		currentSequence.push(inp);
		console.log(currentSequence);
		//Go to next player
		nextPlayer();
	}else if(isCorrectlyMatchedInput(inp)){
		console.log("correct match");
		currentSequenceIndex++;
		timerInterval = setTimeout(timerStopped, timeToPush);
	}else{
		// FALSE INPUT
		// BUZZER
		console.log("Fail");
	}

}

function isNewInput(input){
	if(	currentNumberOfInputs == currentSequence.length +1)
			return true;
	return false;
}

function isCorrectlyMatchedInput(input){
	if(	input == currentSequence[currentSequenceIndex])
			return true;
	return false;
}

function nextPlayer(){
	// reset timer
	timerInterval = setTimeout(timerStopped, timeToPush);
	currentSequenceIndex = 0;
	currentNumberOfInputs = 0;
}

function timerStopped(){
	// FALSE INPUT
	// BUZZER


	resetGame();
}
