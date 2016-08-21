//Google Speak API: Web speech demo 
var final_transcript = '';
var recognizing = false;	// is speech recognition on or not
var ignore_onend;
var start_timestamp;
var recognition; // var for webkit
var start_time, end_time;

if (!('webkitSpeechRecognition' in window)) {
	console.log("didn't initialize");
}
else{
	console.log("Initializing webkit");
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = "en-US";

	recognition.onstart = function(){
		console.log("started recognition");
		if(!recognizing){
			start_time = new Date().getTime();
		}
		recognizing = true;
	};

	recognition.onerror = function(event){
		console.log("onerror", event);

		if(recognizing){
			recognition.start();
			console.log("restarting recognition after error");
		}
		if(event.error == 'audio-capture'){
			console.log("no microphone");
			recognizing = false;
		}
		if(event.error == 'not-allowed'){
			console.log("permission denied");
			recognizing = false;
		}
	};

	recognition.onend = function(){
		if(recognizing)
		{
			recognition.start();
			console.log("restarting recognition");
		}
		else
		{
			end_time = new Date().getTime();
			var total_time= (end_time - start_time)/1000;
			var total_words = get_word_count(final_transcript);

			//total_time.innerHTML = "total speaking time is "+ (end_time - start_time)/100 +"seconds";
			//total_words.innerHTML = "total word count is "+ get_word_count(final_transcript);
			//wpm.innerHTML = "WPM = "+ total_words/ (total_time/60);
			
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() 
			{
				if(request.readyState == 4 && request.status == 200) 
				{
					console.log(JSON.stringify(request.response));
				}
			};
			
			data_to_send = {'session_key':realFaces.sessionKey, 
							'user':realFaces.userName,
							'time':total_time, 
							'words':total_words, 
							'wpm':total_words/(total_time/60), 
							'transcript':final_transcript};
							
			request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=speechupload');				
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");			
			request.send(data_to_send);
	
			console.log("ended recognition");
		}
	}

	recognition.onresult = function(event){
		console.log("speech recognition output: event.results", event.results);
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		final_transcript = capitalize(final_transcript);
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);

		//console.log("final_transcript",final_transcript,"interim_transcript",interim_transcript);
	}
}

function get_word_count(str) {
  if (str.length == 0) {
	return 0;
  } 
  else {
	return str.match(/\S+/g).length;
  }
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}
function startButton(event){
	if(recognizing){
		return;
	}
	final_transcript = '';
	recognition.start();
	start_timestamp = event.timeStamp;
}
function endButton(event){
	if(recognizing){
		recognizing = false;
		recognition.stop();
		return;
	}
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}