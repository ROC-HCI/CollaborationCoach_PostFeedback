module.exports = function(io,uuid){
  //create socket.io client movement namespacing

  var fs = require('fs');

  var translations = io.of('/translations');

  var clientTranslations = {};
  var currentSeats = ["E","E","E","E"];
  var sessionKey = uuid.v1();
  var requiredUsercount = 1;
  var sessionStarted = false;
  var uploads_finished = 0;

  translations.on('connection', function(client){
	  
	client.on('propose_stop', function(data){
		if(sessionStarted)
		{
			sessionStarted = false;
			client.broadcast.to(client.roomName).emit('session_end','end');
			client.emit('session_end','end');
		}
	});	
	
	client.on('upload_finished', function(data){
		uploads_finished = uploads_finished + 1;
		
		if(uploads_finished == requiredUsercount)
		{
			client.emit('debug','uploads completed');
			
			//Execute the shell script for server side processing
			exec("../runscript.sh " + sessionKey, 
				function(error, stdout, stderr){				
					if(error != null)
					{
						console.log(error);
					}
					client.emit('debug','running session script');
					console.log('stdout: ' + stdout);
			});
		}
	});

    client.on('FOCUS_JSON', function(data){
       fs.writeFile("../Data/" + data.JSONkey + "_1.json", data.myJSONString);
    });

    client.on('select_room', function(roomName){
      client.join(roomName);
      client.roomName = roomName;
    });

    client.on('player_join', function(){

      console.log('Client Connected', client.id);

      if (!clientTranslations[client.roomName]){
        clientTranslations[client.roomName] = {};
      }

      clientTranslations[client.roomName][client.id] = {
        position: {x:0, y:15, z:0},
        rotation: {x:0, y:0}
      };
	  
	  // Calculate where this user should sit.
	  var seatLocation = 0;	  
	  for(var i = 0; i < currentSeats.length; i++)
	  {
		  // Find the first empty seat
		  if(currentSeats[i] == "E")
		  {
			  currentSeats[i] = client.id;
			  seatLocation = i;
			  break;
		  }
	  }

	  //tells this client where it should be sitting
	  client.emit('seat_location', seatLocation);
	  
	  //tells this client the current session ID
	  client.emit('session_key', sessionKey);

      //tells new clients about pre-existing clients
      client.emit('preexisting_clients', clientTranslations[client.roomName], client.id);

      //tells all pre-existing clients about new client
      client.broadcast.to(client.roomName).emit('new_client', client.id);
	  
	  // If we've filled up all the seats and haven't started
	  // the session, start the session.
	  if(seatLocation == (requiredUsercount - 1) && !sessionStarted)
	  {
		  client.broadcast.to(client.roomName).emit('session_start','start');
		  client.emit('session_start','start');
		  sessionStarted = true;
	  }

      //sets event listener for new client
      client.on('translate', function(translation){
        client.broadcast.to(client.roomName).emit('move_other_player', {clientID:client.id, translation:translation});
        clientTranslations[client.roomName][client.id] = translation;
      });

      //sets disconnect listener for new client
      client.on('disconnect', function(){
        console.log('Client Disconnected.', client.id);

        delete clientTranslations[client.roomName][client.id];
		
		//Free up this clients seat
		for(var i = 0; i < currentSeats.length; i++)
		{
			if(currentSeats[i] == client.id)
			{
				currentSeats[i] = "E";
			}
		}

        client.broadcast.to(client.roomName).emit('client_disconnected', client.id);
      });
    });
  });
};
