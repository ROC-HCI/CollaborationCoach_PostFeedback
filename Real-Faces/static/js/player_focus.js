
var focus_running = 0;

var timeLine = [];
var count = 0;

function focus_sample()
{
	if(focus_running == 1)
	{
		var info = document.getElementById("playerFocusHUDNotifitcation").innerHTML;

		var focusObject = {timeValue: count, focus: info};
		console.log(info + " : " + count);
			
		timeLine.push(focusObject);
		count++;
	}
}

function focus_end()
{
	focus_running = 0;
	var myJSONString = JSON.stringify(timeLine); 
	
	/*
	console.log(myJSONString);
	console.log("Session key: "+realFaces.sessionKey);
	console.log("Name: "+realFaces.userName);
	*/

	var JSONkey = realFaces.sessionKey + "_" + realFaces.userName;
	
	var JSONData = {
		JSONkey : JSONkey,
		myJSONString : myJSONString
	}

	realFaces.socket.socketio.emit("FOCUS_JSON", JSONData);
}

