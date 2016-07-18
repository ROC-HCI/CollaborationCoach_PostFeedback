var fs = require('fs');
console.log('** start **');
var contents = fs.readFileSync('result.json');

'use strict';
var jscontent = JSON.parse(contents);

//interruption
var interrupted = jscontent.interrupted;
// console.log('interrupted: ', interrupted);

var interrupting = jscontent.interrupting;
// console.log('interrupting: ', interrupting);

//participation
var totalp = jscontent.participation['total'];

for (var key in jscontent.participation){
	if(key=='total')
		// console.log(key+'(sec) : ', jscontent.participation[key], 'percentage: ', 100*jscontent.participation[key]/total);
	// else 
		delete jscontent.participation[key]; 
}	


//turntaking
// for (var i in jscontent.turntaking){
	// console.log(i+': ', jscontent.turntaking[i]);
// }
module.exports.totalinterruption = interrupted+interrupting;
module.exports.interruption = [interrupting,interrupted];
module.exports.totalparticipation = totalp;
module.exports.participation = jscontent.participation;
module.exports.turntaking = jscontent.turntaking;
module.exports.user = jscontent.user;
