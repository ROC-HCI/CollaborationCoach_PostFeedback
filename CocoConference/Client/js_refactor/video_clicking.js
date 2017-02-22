var switch_video = false;

$("#remote_videos").on("hover", function(event)
{
	if (event.target != this)
	{
		//$("#focus_video").src = event.target.src;
		$("#focus_target").val(event.target.id);
		//$("#focus_video").play();
		
		switch_video = true;
		
		var video = event.target;
		var canvas = document.getElementById("focus_video");
		var context = canvas.getContext('2d');
		
		switch_video = false;
		draw(video, context, 200, 200);
		
		//bigVid.innerHTML = "";
		//$(event.target).clone().appendTo(bigVid);
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