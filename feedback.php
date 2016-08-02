<?php
	$url = 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis';
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($ch);
	curl_close($ch);
	echo $data;
?>

<html>


</html>