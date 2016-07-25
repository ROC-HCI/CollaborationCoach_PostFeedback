//var Stopwatch = function(){
//https://www.youtube.com/watch?v=kDnfrlK2CLg
	var time = 0;
	var running = 0;
	var timeLine = [];

	function startPause(){
		if(running == 0){
			captureVideo(commonConfig);
			startRecordingAfterActive();
			running = 1;
			increment();
			document.getElementById("Start").innerHTML = "Pause";
	}else{
		running = 0;
		var myJSONString = JSON.stringify(timeLine); 
		console.log(myJSONString);

		console.log("Session key: "+realFaces.sessionKey);
		console.log("Name: "+realFaces.userName);

		var JSONkey = realFaces.sessionKey + "_" + realFaces.userName;
		
		var JSONData = {
			JSONkey : JSONkey,
			myJSONString : myJSONString
		}
		stopRecordingOnHangup();

		realFaces.socket.socketio.emit("FOCUS_JSON", JSONData);
		document.getElementById("Start").innerHTML = "Resume";
		
		}
	}

	function reset(){
		running = 0;
		time = 0;
		document.getElementById("Start").innerHTML = "Start";
		document.getElementById("Output").innerHTML = "00:00:00";

	}

	function increment(){
		if(running == 1){
		setTimeout(function(){
			time++;
			var mins = Math.floor(time/10/60);
			var secs = Math.floor(time/10);
			var tenths = time % 10;

			if(mins<10)
			{
				mins = "0" + mins;
			}

			if(secs<10)
			{
				secs = "0" + secs;
			}

			if(time%10===0){
				var info = document.getElementById("playerFocusHUDNotifitcation").innerHTML;
			  	console.log(info);
			  	timeLine.push(info);
			}


			document.getElementById("Output").innerHTML = mins + ":" + secs + ":" + "0" + tenths;
			increment();
		}, 100);
	}
}