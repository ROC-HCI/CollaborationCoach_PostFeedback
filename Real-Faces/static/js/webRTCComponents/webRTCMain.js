var RealWebRTC =  function (clientID) {
  //create webRTC obj from library
  this.webrtc = new SimpleWebRTC({
    // the signalmaster URL to implement handshakes
    url: '/signalmaster',
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remotesVideos',
    // immediately ask for camera access
    autoRequestMedia: true
  });

  //store clientID
  this.yourID = clientID;


  ////////////////////////////
  //create webRTC listeners//
  ///////////////////////////

  //listen for other clients joining webRTC room, render their video
  this.webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type === 'setClientID') 
	{
      peer.socketID = data.payload;

	  console.log("****** ADD CLIENT ID TO VIDEO DOM NODE *********");
	  console.log(JSON.strinfigy(data));
	  console.log("*****************************");
	  console.log("CHANNEL MESSAGE: " + data.payload);
	  console.log("FROM: " + peer.id);
	  
      //add clientID to DOM video node
      document.getElementById(peer.id + '_video_incoming').setAttribute("id", data.payload);
    } 
	else if (data.type === 'chatMessage')
	{
      playerEvents.emit('addChatMessage', peer.id, data.payload.message, data.payload.username);
    }
  });

  this.webrtc.on('videoAdded', function(video,peer){
	console.log("***** STARTING CHANNEL TO PEER: " peer.id);
    videoAdd(video, peer, realFaces.webrtc.yourID);
  });

  this.webrtc.on('readyToCall', function () {
    //ask for username
    this.username = prompt("Please enter your name", "Anonymous");
	
	realFaces.userName = this.username;
	
	// FOR 2D SUBMISSION
	doUserNameSubmission(realFaces.socket.yourID);
	
    //variable that allows pointer lock
    this.webcam = true;
    // you can name it anything
    this.joinRoom(realFaces.roomName);

    playerEvents.emit('joined_room');
  });

  // //OVERWRITES VANILLA LIBRARY METHOD
  // // set volume on video tag for all peers takse a value between 0 and 1
  // SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
  //   this.webrtc.peers.forEach(function (peer) {
  //     if (peer.videoEl) {
  //       peer.videoEl.volume = volume;
  //     }
  //   });
  // };

  //set volume for all peers to 0

  window.webRTCMain = this;
  setInterval(function(){
    window.webRTCMain.webrtc.setVolumeForAll(null, true);
  },500);

  this.speaking = false;

  this.webrtc.setVolumeForAll = function (harkVolume, dontChangeHarkVolume) {
      // var volume;
      // //console.log('setting volume', harkVolume, dontChangeHarkVolume);

      // // Strange semantics due to SimpleWebRTC workaround
      // // SimpleWebRTC lowers volume of others when user is talking
      // if (!dontChangeHarkVolume){
      //   if (harkVolume === 1){
      //     this.speaking = false;
      //     volume = 1;
      //   }else if(harkVolume === 0.25){
      //     this.speaking = true;
      //     volume = 0.25;
      //   }
      // }else if (this.speaking === false){
      //   volume = 1;
      // }else if (this.speaking === true){
      //   volume = 0.25;
      // }

      var peers = realFaces.webrtc.webrtc.webrtc.peers;

      peers.forEach(function (peer) {
          if (peer.socketID){
            var vdm = volumeDistanceModifier(peer.socketID);
            //console.log('vdm', vdm, volume)
            if (vdm === 'does not exist'){
              delete peers[peer];
            }else{
              var harkVolume = harkVolume || 1;
              peer.videoEl.volume = harkVolume * vdm * vdm;
            }
         }
      });
  };
};

var updateCubeWithVideo = function (divID, clientID) {
  var video = document.getElementById(divID);

  var videoTexture = new THREE.VideoTexture( video );
  videoTexture.generateMipmaps = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var materialArray = [];
  realFaces.THREE.scene = realFaces.THREE.scene || window.scene;
  var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);

  var cube = realFaces.THREE.scene.getObjectByName('player-'+clientID);
  cube.material = MovingCubeMat;
  cube.material.needsUpdate = true;
};


var videoAdd = function (video, peer, clientID) {
  // Now, open the dataChannel
  var dc = peer.getDataChannel('realTalkClient');
  // Now send my name to all the peers
  // Add a small timeout so dataChannel has time to be ready
  setTimeout(function(){
	console.log("******* SENDING setClientID to ALL Connections ********");
	console.log("Data Channel is Currently:");
	console.log(dc);
    realFaces.webrtc.webrtc.webrtc.sendDirectlyToAll('realTalkClient','setClientID', realFaces.socket.yourID);
  }, 3000);
};
