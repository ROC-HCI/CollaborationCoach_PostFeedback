function proposeStop()
{
	realFaces.socket.socketio.emit("propose_stop","stop");
}

var RealSocket = function (app) {
  console.log(location, location.pathname, location.search);
  this.socketInterval = 100;
  this.yourPlayerTranslation;
  this.lastRecordedPlayerTranslations = {};
  
  var context = this;
 
  //YOUR PLAYER UPDATES TO SERVER
  this.yourPlayerTranslation = {
    position: {x:0, y:10, z:0},
    rotation: {x:0, y:0}
  }; 

  this.translated = false;

  //connect to server namespace
  this.socketio = io.connect('/translations');

  this.socketio.emit('select_room', app.roomName);

  //set up event listeners from socket
  //OTHER PLAYER UPDATES FROM SERVER
  this.socketio.on('preexisting_clients', function(clientTranslations, yourID, thisRef){
    //save your socketio ID
    context.yourID = yourID;
    //draw pre-existing clients when you login
    for (var id in clientTranslations){
      if (clientTranslations.hasOwnProperty(id) && clientTranslations[id] && id !== yourID)
	    {
        context.lastRecordedPlayerTranslations[id] = clientTranslations[id];
        playerEvents.emit('new_player', id, clientTranslations[id]);
        playerEvents.emit('teleport_other_player', id, clientTranslations[id]);
      }
    }
	
	
    //initialize webRTC connection after drawing other clients
    playerEvents.emit('start_webRTC', yourID, app);
  });  
  
  this.socketio.on('seat_location', function(seatID){
	  app.THREE.setSpawn(seatID);
  });
  
  this.socketio.on('debug', function(message){
      console.log('debug_message: ' + message);
  });
  
  this.socketio.on('session_key', function(session_key){
	  app.sessionKey = session_key;
  });

  // ALL CLIENT FUNCTIONS THAT NEED TO START NEED TO START HERE - JW
  this.socketio.on('session_start', function(data){
	  
    captureVideo(commonConfig);
	setTimeout(startRecordingAfterActive,1000);
	

  //testing affdex realtime
  onStart();
  
	recognition.start();
	
	//focus_running = 1;
	//setInterval(focus_sample,1000);
  });
  
  // ALL CLIENT FUNCTIONS THAT NEED TO STOP NEED TO STOP HERE - JW
  this.socketio.on('session_end', function(data){
    stopRecordingOnHangup();
	
	recognizing = false;
	recognition.stop();
	
	//focus_end();
	
	function recording_check()
	{
		if(!recording_upload_status)
		{
			console.log("Upload not done, waiting...");
			setTimeout(recording_check,100);
			return;
		}
		console.log("Upload done! Told the server...");
		realFaces.socket.socketio.emit('upload_finished','done');
	}
	
	recording_check();
  });
  
  this.socketio.on('new_client', function(clientID){
    console.log('new player socket', clientID)
    context.lastRecordedPlayerTranslations[clientID] = {position:{x:0, y:10, z:10}, rotation:{x:0,y:0}};
    //otherPlayerUpdates will hear this and create a new player
    playerEvents.emit('new_player', [clientID]);
  });

  this.socketio.on('client_disconnected', function(clientID){
    delete context.lastRecordedPlayerTranslations[clientID];
    playerEvents.emit('remove_player', [clientID]);
  });

  this.socketio.on('move_other_player', function(data){
    context.lastRecordedPlayerTranslations[data.clientID] = data.translation;
    //otherPlayerUpdates will hear this and move the respective player
    playerEvents.emit('move_other_player', data.clientID, data.translation);
  });

  //check for movement to broadcast to server at regular intervals
  var thisPointer = this;
  setInterval(function(){
    if (thisPointer.translated){
      thisPointer.socketio.emit('translate', thisPointer.yourPlayerTranslation);
      // console.log('translation');
      thisPointer.translated = false;
    }
  }, thisPointer.socketInterval);
};

RealSocket.prototype.storePlayerTranslation = function(translation){
  realFaces.socket.yourPlayerTranslation = translation;
  realFaces.socket.translated = true;
};

