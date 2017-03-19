// Script for handling the 'Lost on the Moon' Game

var selection_options = ["Box of matches","Food concentrate","Fifty feet of nylon rope",
                         "Parachute silk","Solar-powered portable heating unit","Two .45 caliber pistols",
						 "One case of Pet milk","Two 100-pound tanks of oxygen","Stellar map (of the moon's constellations)",
						 "Self-inflating life raft","Magnetic compass","5 gallons of water","Signal flares",
						 "First-aid kit injection needles","Solar-powered FM receiver-transmitter"];


function submit_answers()
{
	experiment_modal.style.display = "block";
	
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
					'experiment':"two"
					'selections': "TO DO HERE"};
							
	string_data = JSON.stringify(data_to_send);				
					
	request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=experimentSubmit');				
	request.setRequestHeader("Content-type", "application/json");			
	request.send(string_data);
}