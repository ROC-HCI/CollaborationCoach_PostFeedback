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
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel = "stylesheet"/>
		<link href="graphs/public/css/style.css" rel = "stylesheet"/>
</head>
<body>
<div id ="Audio_Data" ></div>
<div id ="Video_Data"></div>
<div id ="Text_Data"></div>

</body>
<script>

	var xhttp = new XMLHttpRequest();
	//xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis", false);
	//xhttp.send();
	//document.getElementById("Audio_Data").innerHTML = xhttp.responseText;

	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=test-key-test", false);
	xhttp.send();
	var jscontent = JSON.parse(xhttp.responseText);

	//interruption
	var interruption = jscontent.interruption;
	var defaultuser = Object.keys(interruption)[0]; //Luis interruption['Luis']
	//console.log('interruption name { values }: ', Object.keys(interruption)[0], interruption[Object.keys(interruption)[0]]);
	var interrupted = interruption[defaultuser].interrupted;
	// console.log('interrupted: ', interrupted);

	var interrupting = interruption[defaultuser].interrupting;
	// console.log('interrupting: ', interrupting);

	//participation
	var totalp = jscontent.participation['total'];

	for (var key in jscontent.participation){
		if(key=='total')
			// console.log(key+'(sec) : ', jscontent.participation[key], 'percentage: ', 100*jscontent.participation[key]/total);
		// else 
			delete jscontent.participation[key]; 
	}	

	var data = {};

	data.totalinterruption = interrupted+interrupting;
	data.interruption = [interrupting,interrupted];
	data.totalparticipation = totalp;
	data.participation = jscontent.participation;
	data.turntaking = jscontent.turntaking;
	data.user = defaultuser;


	var interruption = data.interruption;
	var totalinterruption = data.totalinterruption;
	var participation = data.participation;
	var totalparticipation = data.totalparticipation;
	var turntaking = data.turntaking;

	document.getElementById("Video_Data").innerHTML = xhttp.responseText;
</script>

<div class="text-center container">
      <div class="inner-contain1">
        <h1>Interruption</h1>
        <div class="outer">
          <p><span class="chart-label" id="chart1"></span>
          </p>
          <p>By You</p>
        </div>
        <div class="outer">
          <p><span class="chart-label" id="chart2"></span>
          </p>
          <p>By Others</p>
        </div>
      </div>
      <div class="inner-contain2">
        <div class="outer2">
          <h1>Participation</h1>
          <canvas class="chart" id="chart3" data-value="0" data-speaker=""></canvas>
        </div>
      </div>
      <h1>Turn Taking</h1>
      <div class="inner-contain3" id="chart4" data-value="0" data-user=""></div>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>
    <script src="graphs/public/js/jquery.animateNumber.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js"></script>
    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    <script>
        var total = total
        var i1 = interruption[0];
        var i2 = interruption[1];
        var i3 = !{JSON.stringify(participation)};
        var i4 = !{JSON.stringify(turntaking)};
        var iuser = data.user;
        var i3data = []
        var i3speaker = []
        var colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD']
        var guests = {}
        var i = 0
        for (var key in i3){
            i3speaker.push(key);
            guests[key] = colorpalette[i];
            i3data.push(Math.round(i3[key]));
            i+=1;
        }
        $.getScript('graphs/public/main.js',function(data,textStatus){
            console.log("load was performed. ");
        });
    </script>
</html>