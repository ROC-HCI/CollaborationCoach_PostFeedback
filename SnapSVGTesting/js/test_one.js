var session_key = '5049a2a0-a518-11e6-af2c-5b246b9c300d'; // TEST SESSION KEY - this sould end up dynamic at some point.

var colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD'];

// Gather participation data.
var xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=" + session_key, false);
xhttp.send();
			
var jscontent = JSON.parse(xhttp.responseText);

var total_participation = jscontent.participation['total'];

// Count up users on the call and clear out the total data.
var user_count = 0;			
for (var key in jscontent.participation)
{
	if(key == 'total')
		delete jscontent.participation[key]; 
	else
		user_count += 1;
}	

var participation_data = jscontent.participation;

var snp = Snap('#main_svg');

var main_disc = snp.circle(150, 150, 100);
main_disc.attr('fill': '#90D0D5');