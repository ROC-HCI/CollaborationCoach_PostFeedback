	var remoteVideo = document.getElementById("remotesVideos");
	var bigVid = document.getElementById("bigFeed");

	$("#remotesVideos").on("hover", function(event){
		if (event.target != this){
			bigVid.innerHTML = "";
			$(event.target).clone().appendTo(bigVid);
		}
		//else{
			//window.alert("parent");
		//}
	});