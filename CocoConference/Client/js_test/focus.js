var focus_running = 0;
var count = 0;

var affdex_emotions = 0;
var affdex_expressions = 0;

var timeLine = [];

function focus_sample()
{
	if(focus_running == 1)
	{
		var info = $("#focus_target").val();
		
		if(info == null)
		{
			info = "";
		}
		
		// If sentiment hasn't changed we haven't started affdex sampling yet.
		if(affdex_emotions != 0)
		{					
			var sample_element = {"timeValue":count,
			                      "focus":info,
			                      "emotions": affdex_emotions,
								  "expressions": affdex_expressions};
			timeLine.push(sample_element);
			count++;
			
			console.log(sample_element);
		}
	}
}

function focus_end()
{
	focus_running = 0;

	var request = new XMLHttpRequest();
	request.onreadystatechange = function() 
	{
		if(request.readyState == 4 && request.status == 200) 
		{
			console.log(request.response);
		}
	};
	
	data_to_send = {'session_key':session_key, 
					'user':user_name,
					'data':timeLine};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexupload');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);
}