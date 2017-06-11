// Script for handling the 'Lost on the Moon' Game

var experiment_instructions = "SCENARIO: You are a member of a space crew originally scheduled to rendezvous with a mother ship on the lighted surface of the moon. However, due to mechanical difficulties, your ship was forced to land at a spot some 200 miles from the rendezvous point. During reentry and landing, much of the equipment aboard was damaged and, since survival depends on reaching the mother ship, the most critical items available must be chosen for the 200-mile trip. On your own sort the items on the next screen based on how you feel they should be ranked (top being highest priority) and press 'Submit Results'. Then the video call will begin, where you and your group will decide on the top three items.";
var experiment_instructions_trimmed = "You are a member of a space crew originally scheduled to rendezvous with a mother ship on the lighted surface of the moon. However, due to mechanical difficulties, your ship was forced to land at a spot some 200 miles from the rendezvous point. During reentry and landing, much of the equipment aboard was damaged and, since survival depends on reaching the mother ship, the most critical items available must be chosen for the 200-mile trip.";

var current_ranking = null;

var scenarioDisplay = $("#users_scenario_display");
scenarioDisplay.html("<p align='center'><b>Scenario</b></p><p>" + experiment_instructions_trimmed + "</p>");

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
					'experiment':"two",
					'selections': selections};

	string_data = JSON.stringify(data_to_send);

	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=experimentSubmit');
	request.setRequestHeader("Content-type", "application/json");
	request.send(string_data);
}

function submit_final_answers()
{
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() 
	{
		if(request.readyState == 4 && request.status == 200) 
		{
			console.log(request.response);
			signaling_socket.emit("final_selections_submitted",DEFAULT_CHANNEL);
		}
	};
	
	current_ranking = {"First": optionOne.val(), "Second": optionTwo.val(), "Third": optionThree.val(), "Fourth": optionFour.val(), "Fifth": optionFive.val()};
	
	data_to_send = {'session_key':session_key, 
					'user':user_name,
					'experiment':"one",
					'selections': current_ranking};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=experimentSubmitFinal');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);
}
