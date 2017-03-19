// Script for handling the 'Lost at Sea' Game

var experiment_instructions = "SCENARIO: You and your group members have been shipwrecked and are stranded in a life boat. You have a box of matches and a number of items salvaged from the sinking ship. Now, you have to determine which items are the most important for your groups survival. On your own sort the items on the next screen based on how you feel they should be ranked (top being highest priority) and press 'submit'. Then the video call will begin, where you and your group will decide on the top three items.";

var current_ranking = null;

function submit_answers(selections)
{
	experiment_modal.style.display = "block";
	
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() 
	{
		if(request.readyState == 4 && request.status == 200) 
		{
			console.log(request.response);
			signaling_socket.emit("selections_submitted",DEFAULT_CHANNEL);
		}
	};
	
	current_ranking = selections;
	
	data_to_send = {'session_key':session_key, 
					'user':user_name,
					'experiment':"one",
					'selections': selections};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=experimentSubmit');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);
}