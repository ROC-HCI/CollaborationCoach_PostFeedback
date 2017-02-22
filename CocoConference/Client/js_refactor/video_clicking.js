var switch_video = false;

$("#remote_videos").on("hover", function(event)
{
	if (event.target != this)
	{
		/*
		$("#focus_target").val(event.target.id);
		
		var video = $("#focus_video");		
		video.src = event.target.src;
		video.load();
		video.get(0).play();

		/*		
		switch_video = true;
		
		var video = event.target;
		var canvas = document.getElementById("focus_video");
		var context = canvas.getContext('2d');
		
		switch_video = false;
		draw(video, context, 200, 200);
		*/
		
		var bigVid = document.getElementById("focus_feed");
		bigVid.innerHTML = "";
		
		
		$(event.target).clone(true, true).appendTo(bigVid);
	}
});


function draw(video, context, width, height)
{
	if(video.paused || video.ended || switch_video) 
	{
		console.log("killed draw function on switch");
		return false;
	}
	
	context.drawImage(video, 0, 0, width, height);
	setTimeout(draw, 20, video, context, width, height);
}