var data = require('./js/data');
var interruption = data.interruption;
var totalinterruption = data.totalinterruption;
var participation = data.participation;
var totalparticipation = data.totalparticipation;
var turntaking = data.turntaking;

var express = require('express');
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/',function(req,res){
	res.render('index', {
		value1: interruption[0], 
		value2: interruption[1], //interrupted
		total: totalinterruption,
		value3: participation,
		value4: turntaking,
		overalluser: data.user,
	});
});

var path = require('path');
app.use(express.static('public'));
console.log(__dirname + '/public');
app.listen(8888);
console.log("Running at Port 8888");
