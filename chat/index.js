var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
})

//listening on io events
io.on('connection', function(socket){

	var user = function(){
	    var d = new Date().getTime()
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0
	        d = Math.floor(d/16)
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16)
	    })
	    return uuid
	}

	//getting the session id for the current user, which can be later imported using our server json
	var currentUser = user()

	console.log('a user connected '+currentUser)
	io.emit('welcome', currentUser)

	//listen on the event 'chat message'
	socket.on('chat message', function(msg,fn){
		console.log('message: ', msg + ' FROM '+currentUser)
		fn(msg, currentUser)
		//roboto gets it!
		var str = currentUser +', I heard ya '+ msg 
		io.emit('message success', str)
		//broadcasting to html
		// io.emit('broadcast', currentUser, msg)

	})

	socket.on('roboto', function(msg){
		console.log('messge from roboto read: ', msg)
	})

	socket.on('disconnect', function(){
	console.log('user disconnected')
	})
})

http.listen(8000, function(){
	console.log('listen at port 8000')
})
