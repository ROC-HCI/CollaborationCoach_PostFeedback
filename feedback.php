<?php
	/*$url = 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis';
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($ch);
	curl_close($ch);
	echo $data;*/
?>

<html>
<head>
<script>
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis", false);
	xhttp.send();
	document.getElementById("Audio_Data").innerHTML = xhttp.responseText;

	//console.log(xhttp.responseText);

	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=test-key-test", false);
	xhttp.send();
	document.getElementById("Video_Data").innerHTML = xhttp.responseText;
</script>
</head>

<div id ="Audio_Data" ></div>
<div id ="Video_Data"></div>
<div id ="Text_Data"></div>

</html>