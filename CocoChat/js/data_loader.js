var session_time = null;
var participation_me = null;
var participation_me_prev = null;
var overlap_me = null;
var overlap_me_prev = null;
var overlap_other = null;
var overlap_other_prev = null;
var turntaking_least = null;
var turntaking_least_name = null;
var turntaking_most_name = null;
var turntaking_most_name_prev = null;
var valence_group = null;
var sharedsmile_most_name = null;

var chat_json = null;

function setup_chat_data(session_key, user)
{
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=chat_data_load&session_key=" + session_key + "&user=" + user, true);
	      	
	xhttp.onload = function(e)
	{
		if(xhttp.readState === 4)
		{
			if(xhttp.status === 200)
			{
				var data = JSON.parse(xhttp.responseText);
				
				session_time = data['session_time'];
				participation_me = data['participation_me'];
				participation_me_prev = data['participation_me_prev'];
				overlap_me = data['overlap_me'];
				overlap_me_prev = data['overlap_me_prev'];
				overlap_other = data['overlap_other'];
				overlap_other_prev = data['overlap_other_prev'];
				turntaking_least = data['turntaking_least'];
				turntaking_least_name = data['turntaking_least_name'];
				turntaking_most_name = data['turntaking_most_name'];
				turntaking_most_name_prev = data['turntaking_most_name_prev'];
				valence_group = data['valence_group'];
				sharedsmile_most_name = data['sharedsmile_most_name'];
				
				
				setup_chat_json();
			}
		}
	};
			
	xhttp.send();
}

function setup_chat_json()
{
	chat_json = [];
	
	console.log(session_time);
	console.log(participation_me);
	console.log(participation_me_prev);
	console.log(overlap_me);
	console.log(overlap_me_prev);
	console.log(overlap_other);
	console.log(overlap_other_prev);
	console.log(turntaking_least);
	console.log(turntaking_least_name);
	console.log(turntaking_most_name);
	console.log(turntaking_most_name_prev);
}