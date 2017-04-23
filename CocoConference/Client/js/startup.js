/** CONFIG **/
var SIGNALING_SERVER = "https://conference.eastus.cloudapp.azure.com:9000";
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = 'coco-conference';
var MUTE_AUDIO_BY_DEFAULT = false;

var ICE_SERVERS =
[
	{
		url: 'turn:webrtcweb.com:7788',
		credential: 'muazkh',
		username: 'muazkh'
	},
	//{url:"stun:stun.l.google.com:19302"},
];


var signaling_socket = null;   /* our socket.io connection to our webserver */
var local_media_stream = null; /* our own microphone / webcam */

var peers = {};                /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
var peer_media_elements = {};  /* keep track of our <video>/<audio> tags, indexed by peer_id */
var peer_media_streams = {};   /* keep track of media streams indexed by peer_id, utilized in the 'big' display */

// Coco experiment identifiers
var session_key = null;
var user_name = null;

var modal = null;

function proposeStop()
{
	signaling_socket.emit("propose_stop",DEFAULT_CHANNEL);
}

function onUserIDModalClick(){
  var UserIDInfoModal = document.getElementById('UserIDInfoModal');
  UserIDInfoModal.style.display = "none";
  var userIDSelectionDropDown = document.getElementById('DropDownChoice');
  var userIDSelectionValue = userIDSelectionDropDown.options[userIDSelectionDropDown.selectedIndex].value;
  var radioBoxesChoice = document.querySelector('input[name="Session"]:checked').value;
    var lenovoRadioBoxesChoice = document.querySelector('input[name="Lenovo"]:checked').value;

  user_name = userIDSelectionValue + radioBoxesChoice + lenovoRadioBoxesChoice;

  console.log(user_name);
}

function init()
{
	//user_name = prompt("Please enter your User Name:", "Coco-User");

	var UserIDInfoModal = document.getElementById('UserIDInfoModal');
  UserIDInfoModal.style.display = "block";

	modal = document.getElementById('uploadingModal');

	console.log("Connecting to signaling server");
	signaling_socket = io.connect(SIGNALING_SERVER);

	signaling_socket.on('connect', function()
	{
		console.log("Connected to signaling server");
		setup_local_media(function()
		{
			/* once the user has given us access to their
			 * microphone/camcorder, join the channel and start peering up */
			join_chat_channel(DEFAULT_CHANNEL, {'whatever-you-want-here': 'stuff'});
		});
	});

	signaling_socket.on('disconnect', function()
	{
		console.log("Disconnected from signaling server");
		/* Tear down all of our peer connections and remove all the
		 * media divs when we disconnect */
		for (peer_id in peer_media_elements)
		{
			peer_media_elements[peer_id].remove();
		}
		for (peer_id in peers)
		{
			peers[peer_id].close();
		}

		peers = {};
		peer_media_elements = {};
		peer_media_streams = {};
	});

	// Getting the session key from the signaling-server
	// and then submit the user-name/session-key pair to the
	// database for later use.
	signaling_socket.on('session_key', function(data)
	{
		session_key = data;

		var request = new XMLHttpRequest();
		request.onreadystatechange = function()
		{
			if(request.readyState == 4 && request.status == 200)
			{
				console.log('Stored my user name to the Database. ' + signaling_socket.io.engine.id);
				console.log(request.response);
			}
		};

		data_to_send = {'session_key':session_key,
						'user':user_name,
						'seat':signaling_socket.io.engine.id};

		string_data = JSON.stringify(data_to_send);

		request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=seatupload');
		request.setRequestHeader("Content-type", "application/json");
		request.send(string_data);
	});

	// signaling-server has delegated us to trigger the analysis script, so do so.
	signaling_socket.on('shell_delegate', function(message)
	{
		var request = new XMLHttpRequest();
		request.onreadystatechange = function()
		{
			if(request.readyState == 4 && request.status == 200)
			{
				console.log('processing finished, output below.');
				console.log(request.response);
				signaling_socket.emit('analysis_complete', DEFAULT_CHANNEL);
			}
			else
			{
				console.log('Shell API Call Has state: ' + request.readyState + ' and status: ' + request.status);
				console.log('debug', request.response);
			}
		};

		request.open('POST', 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=process&session_key=' + session_key,true);
		request.setRequestHeader("Content-type", "application/json");
		request.send();
	});

	signaling_socket.on('data_available', function()
	{
		modal.style.display = "none";

		var win = window.open('https://conference.eastus.cloudapp.azure.com/RocConf/chatbot.php?key=' + session_key + '&user=' + user_name, '_blank');
		if (win)
		{
			win.focus();
		}
		else
		{
			alert('Please allow popups for this website');
		}
	});

	// Experiment Startup
	signaling_socket.on('session_start', function()
	{
		console.log("Received Session Start!");

		// Video Recording Startup
		captureVideo(commonConfig);
		setTimeout(startRecordingAfterActive,1000);

		// Start Affdex and begin sampling statistics
		onStart();
		focus_running = 1;
		setInterval(focus_sample,250);
	});

	// Experiment Teardown
	signaling_socket.on('session_end', function()
	{
		modal.style.display = "block";
		console.log("Received Session End!");

		// Stop Video Recording
	    stopRecordingOnHangup();

		// Stop Affdex and submit statistics to the database
		onStop();
		focus_end();

		// Upload the video recording to the server, let the signaling-server know
		// when completed.
		function recording_check()
		{
			if(!recording_upload_status)
			{
				modal.style.display = "block";
				console.log("Upload not done, waiting...");
				setTimeout(recording_check,100);
				return;
			}
			console.log("Upload done! Told the server...");

			signaling_socket.emit('upload_finished', signaling_socket.io.engine.id);
		}

		recording_check();
	});

	function join_chat_channel(channel, userdata)
	{
		signaling_socket.emit('join', {"channel": channel, "userdata": userdata});
	}

	function part_chat_channel(channel)
	{
		signaling_socket.emit('part', channel);
	}


	/**
	* When we join a group, our signaling server will send out 'addPeer' events to each pair
	* of users in the group (creating a fully-connected graph of users, ie if there are 6 people
	* in the channel you will connect directly to the other 5, so there will be a total of 15
	* connections in the network).
	*/
	signaling_socket.on('addPeer', function(config)
	{
		console.log('Signaling server said to add peer:', config);
		var peer_id = config.peer_id;
		if (peer_id in peers)
		{
			/* This could happen if the user joins multiple channels where the other peer is also in. */
			console.log("Already connected to peer ", peer_id);
			return;
		}

		var peer_connection = new RTCPeerConnection(
			{"iceServers": ICE_SERVERS},
			{"optional": [{"DtlsSrtpKeyAgreement": true}]} /* this will no longer be needed by chrome
															* eventually (supposedly), but is necessary
															* for now to get firefox to talk to chrome */
		);

		peers[peer_id] = peer_connection;

		peer_connection.onicecandidate = function(event)
		{
			if (event.candidate) {
				signaling_socket.emit('relayICECandidate',
				{
					'peer_id': peer_id,
					'ice_candidate': {
						'sdpMLineIndex': event.candidate.sdpMLineIndex,
						'candidate': event.candidate.candidate
					}
				});
			}
		}

		peer_connection.onaddstream = function(event)
		{
			console.log("onAddStream", event);

			var remote_media = USE_VIDEO ? $("<video>") : $("<audio>");
			remote_media.attr("autoplay", "autoplay");
			remote_media.attr("id", peer_id);

			if (MUTE_AUDIO_BY_DEFAULT)
			{
				remote_media.attr("muted", "true");
			}

			// Mouseover handler for the 'big' display
			remote_media.mouseenter(function(){
				$('#focus_feed').empty();

				var target = peer_id;

				var remote_media_big = USE_VIDEO ? $("<video>") : $("<audio>");
				remote_media_big.attr("autoplay", "autoplay");
				remote_media_big.attr("id", target + "_big");
				remote_media_big.attr("muted", "true");

				$('#focus_target').val(target);
				$('#focus_feed').append(remote_media_big);
				attachMediaStream(remote_media_big[0], peer_media_streams[target]);

			});

			peer_media_elements[peer_id] = remote_media;
			peer_media_streams[peer_id] = event.stream;

			$('#remote_videos').append(remote_media);
			attachMediaStream(remote_media[0], event.stream);
		}

		/* Add our local stream */
		peer_connection.addStream(local_media_stream);

		/* Only one side of the peer connection should create the
		 * offer, the signaling server picks one to be the offerer.
		 * The other user will get a 'sessionDescription' event and will
		 * create an offer, then send back an answer 'sessionDescription' to us
		 */
		if (config.should_create_offer)
		{
			console.log("Creating RTC offer to ", peer_id);
			peer_connection.createOffer(
				function (local_description)
				{
					console.log("Local offer description is: ", local_description);
					peer_connection.setLocalDescription(local_description,
						function()
						{
							signaling_socket.emit('relaySessionDescription',
								{'peer_id': peer_id, 'session_description': local_description});
							console.log("Offer setLocalDescription succeeded");
						},
						function() { Alert("Offer setLocalDescription failed!"); }
					);
				},
				function (error)
				{
					console.log("Error sending offer: ", error);
				});
		}
	});


	/**
	 * Peers exchange session descriptions which contains information
	 * about their audio / video settings and that sort of stuff. First
	 * the 'offerer' sends a description to the 'answerer' (with type
	 * "offer"), then the answerer sends one back (with type "answer").
	 */
	signaling_socket.on('sessionDescription', function(config)
	{
		console.log('Remote description received: ', config);
		var peer_id = config.peer_id;
		var peer = peers[peer_id];
		var remote_description = config.session_description;
		console.log(config.session_description);

		var desc = new RTCSessionDescription(remote_description);
		var stuff = peer.setRemoteDescription(desc,
			function()
			{
				console.log("setRemoteDescription succeeded");
				if (remote_description.type == "offer") {
					console.log("Creating answer");
					peer.createAnswer(
						function(local_description) {
							console.log("Answer description is: ", local_description);
							peer.setLocalDescription(local_description,
								function() {
									signaling_socket.emit('relaySessionDescription',
										{'peer_id': peer_id, 'session_description': local_description});
									console.log("Answer setLocalDescription succeeded");
								},
								function() { Alert("Answer setLocalDescription failed!"); }
							);
						},
						function(error) {
							console.log("Error creating answer: ", error);
							console.log(peer);
						});
				}
			},
			function(error) {
				console.log("setRemoteDescription error: ", error);
			}
		);
		console.log("Description Object: ", desc);

	});

	/**
	 * The offerer will send a number of ICE Candidate blobs to the answerer so they
	 * can begin trying to find the best path to one another on the net.
	 */
	signaling_socket.on('iceCandidate', function(config)
	{
		var peer = peers[config.peer_id];
		var ice_candidate = config.ice_candidate;
		peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
	});


	/**
	 * When a user leaves a channel (or is disconnected from the
	 * signaling server) everyone will recieve a 'removePeer' message
	 * telling them to trash the media channels they have open for those
	 * that peer. If it was this client that left a channel, they'll also
	 * receive the removePeers. If this client was disconnected, they
	 * wont receive removePeers, but rather the
	 * signaling_socket.on('disconnect') code will kick in and tear down
	 * all the peer sessions.
	 */
	signaling_socket.on('removePeer', function(config)
	{
		console.log('Signaling server said to remove peer:', config);
		var peer_id = config.peer_id;

		if (peer_id in peer_media_elements)
		{
			peer_media_elements[peer_id].remove();
		}

		if (peer_id in peers)
		{
			peers[peer_id].close();
		}

		delete peers[peer_id];
		delete peer_media_elements[config.peer_id];
	});
}




/***********************/
/** Local media stuff **/
/***********************/
function setup_local_media(callback, errorback)
{
	if (local_media_stream != null)
	{  /* ie, if we've already been initialized */
		if (callback) callback();
		return;
	}

	/* Ask user for permission to use the computers microphone and/or camera,
	 * attach it to an <audio> or <video> tag if they give us access. */
	console.log("Requesting access to local audio / video inputs");
	getUserMedia({"audio":USE_AUDIO, "video":USE_VIDEO},
		function(stream)
		{ /* user accepted access to a/v */
			console.log("Access granted to audio/video");
			local_media_stream = stream;
			var local_media = USE_VIDEO ? $("<video>") : $("<audio>");
			local_media.attr("autoplay", "autoplay");
			local_media.attr("muted", "true"); /* always mute ourselves by default */
			local_media.attr("id", "local_video");
			$('body').append(local_media);
			attachMediaStream(local_media[0], stream);

			if (callback) callback();
		},
		function()
		{ /* user denied access to a/v */
			console.log("Access denied for audio/video");
			alert("You chose not to provide access to the camera/microphone, demo will not work.");
			if (errorback) errorback();
		});
}
