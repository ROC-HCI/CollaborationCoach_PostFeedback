// $(document).ready(function(e){
	var remoteVideo = document.getElementById("remotesVideos");
	var bigVid = document.getElementById("bigFeed");

$("#remotesVideos").on("click", function(event){
		if (event.target != this){
			bigVid.innerHTML = "";
			$(event.target).clone().appendTo(bigVid);
		}
		else{
			window.alert("parent");
		}
	});
// });

// function enlargeVideoFeed(){
// 	var remoteVideo = document.getElementById("remotesVideos");
// 	var bigVid = document.getElementById("bigFeed");


// 	bigVid.innerHTML = "";
// 	bigVid.innerHTML = remoteVideo.innerHTML;
// }