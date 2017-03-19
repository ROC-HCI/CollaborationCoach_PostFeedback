/**********************************************************************************/
/* Original Source: https://github.com/anoek/webrtc-group-chat-example            */
/*                                                                                */
/* Modifications - CoCo Team, University of Rochester                             */
/*                                                                                */
/**********************************************************************************/

/************************************/
/* Signaling Server Setup           */
/************************************/
var PORT = 9000;

var fs = require('fs');
var uuid = require('node-uuid');

var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var pkey = fs.readFileSync('/etc/apache2/ssl/apache.key');
var pcert = fs.readFileSync('/etc/apache2/ssl/apache.crt');

var options = {
    key: pkey,
    cert: pcert
};

var main = express()
var server = https.createServer(options, main)
var io  = require('socket.io').listen(server);

server.listen(PORT, null, function() 
{
    console.log("Listening on port " + PORT);
});

main.use(bodyParser.urlencoded({ extended: false }));
main.use(bodyParser.json());


/*************************/
/* Session Specific Data */
/*************************/
var channels = {};
var sockets = {};

var sessionKey = uuid.v1();

var connectedUsers = 0;
var requiredUserCount = 2;

var sessionStarted = false;
var uploadsFinishedCount = 0;
var submittedAnswersCount = 0;

/**
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be streaming audio/video between eachother.
 */
io.sockets.on('connection', function (socket) 
{
    socket.channels = {};
    sockets[socket.id] = socket;

    console.log("["+ socket.id + "] connection accepted");
	
    socket.on('disconnect', function () 
	{
        for (var channel in socket.channels) 
		{
            part(channel);
        }
		
        console.log("["+ socket.id + "] disconnected");
        delete sockets[socket.id];
		
		connectedUsers = connectedUsers - 1;
    });


    socket.on('join', function (config) 
	{
        console.log("["+ socket.id + "] join ", config);
        var channel = config.channel;
        var userdata = config.userdata;

        if (channel in socket.channels) 
		{
            console.log("["+ socket.id + "] ERROR: already joined ", channel);
            return;
        }

        if (!(channel in channels)) 
		{
            channels[channel] = {};
        }

        for (id in channels[channel]) 
		{
            channels[channel][id].emit('addPeer', {'peer_id': socket.id, 'should_create_offer': false});
            socket.emit('addPeer', {'peer_id': id, 'should_create_offer': true});
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
		
		//=================================================================================================
		// CoCo Join Scripting
		//=================================================================================================
		
		//tells this client the current session ID
		socket.emit('session_key', sessionKey);			
		connectedUsers = connectedUsers + 1;

    });

    function part(channel) 
	{
        console.log("["+ socket.id + "] part ");

        if (!(channel in socket.channels)) 
		{
            console.log("["+ socket.id + "] ERROR: not in ", channel);
            return;
        }

        delete socket.channels[channel];
        delete channels[channel][socket.id];

        for (id in channels[channel]) 
		{
            channels[channel][id].emit('removePeer', {'peer_id': socket.id});
            socket.emit('removePeer', {'peer_id': id});
        }
    }
    socket.on('part', part);

    socket.on('relayICECandidate', function(config) 
	{
        var peer_id = config.peer_id;
        var ice_candidate = config.ice_candidate;
        console.log("["+ socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        }
    });

    socket.on('relaySessionDescription', function(config) 
	{
        var peer_id = config.peer_id;
        var session_description = config.session_description;
        console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

        if (peer_id in sockets) {
            sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
    });
	
	//=====================================================================================================================
	// CoCo Experiment Socket Handlers
	//=====================================================================================================================
	
	// One client has hit the 'End Call' button, let everybody in this channel know
	socket.on('propose_stop', function(channel)
	{
		if(sessionStarted)
		{
			for(id in channels[channel])
				channels[channel][id].emit('session_end','end');				
			
			sessionStarted = false;
		}
	});
	
	// Each client will tell the server when it has uploaded it's experimental selections
	socket.on('selections_submitted', function(channel)
	{
		submittedAnswersCount = submittedAnswersCount + 1;
		
		// If we've got our users we're all set to start recording data
		if((submittedAnswersCount == requiredUserCount) && !sessionStarted)
		{
			// Slight delay prior to running this.
			setTimeout(function ()
			{
				for(id in channels[channel])
					channels[channel][id].emit('session_start','start');
				sessionStarted = true;
			},
			3000);
		}
	});
	
	// Each client will tell the server when it has finished uploading video
	socket.on('upload_finished', function(peer_id)
	{
		uploadsFinishedCount = uploadsFinishedCount + 1;
		
		if(uploadsFinishedCount == requiredUserCount)
		{
			// This client is the last to finish uploading,
			// so we'll delegate them to make the shell API call.
			sockets[peer_id].emit('shell_delegate','tell the API to do the thing!');
		}
	});
	
	// Delegated client has finished with analysis, let everybody else know the 
	// data page should be available.
	socket.on('analysis_complete', function(data)
	{
		for(id in channels[data])
			channels[data][id].emit('data_available','done!');	
	});
	
});
