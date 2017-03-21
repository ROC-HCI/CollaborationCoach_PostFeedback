var session_key = '07894240-0dbf-11e7-9ae9-6d413ab416f0'; // TEST SESSION KEY - this sould end up dynamic at some point.
var iuser = 'Yiyun';

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

console.log(participation_data);



