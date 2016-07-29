var client = require('./basic')
var userrequest = 'whats the weather in New York?';
console.log('user said: ', userrequest);
client.runActions(userrequest).then(function (res) {
	// reply
	console.log('roboto said: ', res.forecast) //only getting the response tagged 'forecast'
})