var data = require('./js/data');
var interruption = data.interruption;
var totalinterruption = data.totalinterruption;
var participation = data.participation;
var totalparticipation = data.totalparticipation;
var turntaking = data.turntaking;
// var window.a = 'bb';

console.log(JSON.stringify(participation));
var fs = require('fs');
var express = require('express');
var cheerio = require('cheerio');
var app = express();
var url = '/index.html';

app.get('/',function(req,res){
	var html = fs.readFileSync(__dirname + url, 'utf8');
	var $ = cheerio.load(html);
	var scriptNode = '$("#chart1").data("value", '+interruption[0]+'); \
						$("#chart1").data("total", '+totalinterruption+');'; //interrupting
	var scriptNode2 = '$("#chart2").data("value", '+interruption[1]+');'; //interrupted
	
	var scriptNode3 = '$("#chart3").data("value",'+JSON.stringify(participation)+');';

	var scriptUser = '$("#chart4").data("user","'+String(data.user)+'");'; //default speaker
	var scriptNode4 = '$("#chart4").data("value",'+JSON.stringify(turntaking)+');'; //turn taking data

	$('script').last().prepend(scriptNode);
	$('script').last().prepend(scriptNode2);
	$('script').last().prepend(scriptNode3);
	$('script').last().prepend(scriptUser);
	$('script').last().prepend(scriptNode4);

	res.send($.html());
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

app.use(express.static('public'));
// console.log(__dirname + '/public');
app.listen(8888);
console.log("Running at Port 8888");
