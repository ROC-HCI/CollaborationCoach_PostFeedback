module.exports = function(io,uuid){
  //create socket.io client movement namespacing
  var translations = io.of('/translations');

  var clientTranslations = {};
  var currentSeats = ["E","E","E","E"];
  var sessionKey = uuid.v1();

  translations.on('connection', function(client){

    client.on('uploader', function(data) {
        console.log('writing to disk', data);
        //writeToDisk(data.audio.dataURL, data.audio.name);
        //writeToDisk(data.video.dataURL, data.video.name);

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
