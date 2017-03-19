// Script for handling the 'Lost at Sea' Game

var selection_options = ["A Mosquito Net","A can of Petrol","A water container",
                         "A shaving mirror","A sextant (measures angle between objects)",
						 "Emergency rations","A sea chart","A floating seat or cushion",
						 "A rope","Some chocolate bars","A waterproof sheet","A fishing rod",
						 "Shark repellent","A bottle of rum","A VHF radio"];


function submit_answers()
{
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
					'experiment':"one"
					'selections': "TO DO HERE"};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=experimentSubmit');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);
}