var remoteVideo = document.getElementById("remote_videos");
var bigVid = document.getElementById("focus_feed");

$("#remote_videos").on("hover", function(event)
{
	console.log("HOVER FUNCTION CALLED");
	if (event.target != this)
	{
		console.log("HOVER DETECTED");
		bigVid.innerHTML = "";
		$(event.target).clone().appendTo(bigVid);
	}
});