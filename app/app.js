#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var util = require('util');

var config = require('./config');

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


function resetGame(){
	currentSequence = [];
	currentSequenceIndex = 0;
	currentPlayer = players[0];
	currentNumberOfInputs = 0;

}

function input(inp){
	//
	currentNumberOfInputs++;
	// validate input (new sequence or correctly matched sequence)

	// new
	if(isNewInput(inp)){

	}else if(isCorrectlyMatchedInput(inp)){

	}else{
		// FALSE INPUT
		// BUZZER
		console.log("Fail");
	}

}

function isNewInput(input){
	if(	currentNumberOfInputs = currentSequence.length +1)
			return true;
	return false;
}

function isCorrectlyMatchedInput(input){
	if(	input == currentSequence[currentSequenceIndex])
			return true;
	return false;
}

function nextPlayer(){

}

