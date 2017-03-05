
/*
$("#remote_videos").mouseenter(function(event)
{
	// Handler for the mouse entering this div
	if (event.target != this)
	{
		$('#focus_feed').empty();
		var target = event.target.id;
			
		var remote_media_big = USE_VIDEO ? $("<video>") : $("<audio>");
		remote_media_big.attr("autoplay", "autoplay");
		remote_media_big.attr("id", target + "_big");
		remote_media_big.attr("muted", "true");
		
		$('#focus_target').val(target);
		$('#focus_feed').append(remote_media_big);
		attachMediaStream(remote_media_big[0], peer_media_streams[target]);
	}
});
*/