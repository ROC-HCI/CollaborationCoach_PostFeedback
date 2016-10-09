<?php
	/*$url = 'https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis';
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($ch);
	curl_close($ch);
	echo $data;*/
  $feedbackID = $_GET['key'];
  $userID = $_GET['user'];


?>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel = "stylesheet"/>
		<link href="graphs/public/css/style.css" rel = "stylesheet"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <style>

    .axis {
      font: 10px sans-serif;
    }

    .axis path,
    .axis line {
      fill: none;
      stroke: #000;
      shape-rendering: crispEdges;
    }

    </style>
</head>
<body>
<div id ="Audio_Data" ></div>
<div id ="Video_Data"></div>
<div id ="Text_Data"></div>
<script>

	var xhttp = new XMLHttpRequest();
	//xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis", false);
	//xhttp.send();
	//document.getElementById("Audio_Data").innerHTML = xhttp.responseText;

	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=<?php echo $feedbackID ?>", false);
	xhttp.send();
	var jscontent = JSON.parse(xhttp.responseText);
  document.getElementById("Audio_Data").innerHTML = xhttp.responseText;


	//interruption
	var interruption = jscontent.interruption;
	var defaultuser = Object.keys(interruption)[0]; //Luis interruption['Luis']
	console.log('interruption name { values }: ', Object.keys(interruption)[0], interruption[Object.keys(interruption)[0]]);
	var interrupted = interruption[defaultuser].interrupted;
	console.log('interrupted: ', interrupted);

	var interrupting = interruption[defaultuser].interrupting;
	console.log('interrupting: ', interrupting);

	//participation
	var totalp = jscontent.participation['total'];
	var count = 0;
	for (var key in jscontent.participation){
		console.log('lala', count, key);
		if(key=='total')
			// console.log(key+'(sec) : ', jscontent.participation[key], 'percentage: ', 100*jscontent.participation[key]/total);
		// else 
			delete jscontent.participation[key]; 
		count+=1;
	}	

	var data = {};

	data.totalinterruption = interrupted+interrupting;
	data.interruption = [interrupting,interrupted];
	data.totalparticipation = totalp;
	data.participation = jscontent.participation;
	data.turntaking = jscontent.turntaking;
	data.user = defaultuser;

	console.log(data);


	var interruption = data.interruption;
	var totalinterruption = data.totalinterruption;
	var participation = data.participation;
	var totalparticipation = data.totalparticipation;
	var turntaking = data.turntaking;

	//document.getElementById("Video_Data").innerHTML = xhttp.responseText;
</script>

<div class="text-center container">
      <div align="center">
        <h1> Your Attitude towards </h1>
        <p align="center">
          <button onclick="setupChart('0');">Overall</button>
          <button onclick="setupChart('1');">User 1</button>
          <button onclick="setupChart('2');">User 2</button>
          <button onclick="setupChart('3');">User 3</button>
          <button onclick="setupChart('4');">User 4</button>
          <!--script>
            var userlist = Object.keys(jscontent.interruption);
            console.log("object keys", userlist);
            for (var i = 0; i < userlist.length; i++) {
              document.write("<button onclick='setupChart("+(i+1)+");'>"+userlist[i]+"</button>");
            }
          </script-->
        </p>
        <div style="max-width:400px; max-height:400px">
          <canvas id="barChart" width="400" height="400"></canvas>
        </div>


        <div style="max-width:400px; max-height:400px">
          <canvas id="barChart2" width="400" height="400"></canvas>
        </div>


        <div style="max-width:400px; max-height:400px">
          <canvas id="barChart3" width="400" height="400"></canvas>
        </div>
      </div>

      <div id="userSelection">
      </div>

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
    
    <!--script src="https://code.jquery.com/jquery-3.1.0.min.js"></script-->
    <script src="graphs/public/js/jquery.animateNumber.min.js"></script>
    <!--script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js"></script-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.js"></script>

    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    
    <script>
        var total = total
        var i1 = interruption[0];
        var i2 = interruption[1];
        var i3 = participation;
        //console.log('a tag ', JSON.stringify(participation,null, 2));
        var i4 = turntaking;
        var iuser = data.user;
        console.log("what is iuser", iuser);
        var i3data = [];
        var i3speaker = [];
        var colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD'];
        var guests = {};
        var count = 0;
        //i3 = JSON.parse(i3);


        var i5 = {};

        for(var key in i4) {
          keymod = key.replace(/Data\/test-key-test_/g, "");
          i5[keymod] = i4[key];

        }

        i4 = i5;

        console.log("i4 assignment", i4);

        for (var key in i3){
        	  //console.log("LALALA ", count, i3[key]);
            i3speaker.push(key);
            //keymod = key.replace(/Data\/test-key-test_/g, "");
            guests[key] = colorpalette[count];
            //console.log("logging guests", guests);
            i3data.push(Math.round(i3[key]));
            count+=1;
        }

        console.log('is my speakers right ', i3speaker);
        $.getScript('graphs/public/main.js',function(data,textStatus){
            console.log("load was performed. ");
        });



    //Affdex Data
    // JSON Data for this session, loaded via AJAX call
    var session_data = []

    function setupChart(user)
    {
      var overall_stats = session_data["0"];    
      var overall_data = [];    
      overall_data.engagement = overall_stats.engagement;
      overall_data.surprise = overall_stats.surprise;
      overall_data.contempt = overall_stats.contempt;
      overall_data.joy = overall_stats.joy;
      overall_data.anger = overall_stats.anger;
      
      var barData = {};
      
      if(user == "0")
      {
        barData = 
        {
          labels : ["Engagement","Surprise","Contempt","Joy","Anger"],
          datasets : 
          [
            {
              label: "Overall",
              backgroundColor: "rgba(58,87,214,.1)",
              borderColor: "rgba(58,87,214,.2)",
              pointBackgroundColor : "rgba(255,255,255,1)",
              data : [overall_data.engagement,overall_data.surprise,overall_data.contempt,overall_data.joy,overall_data.anger]
            }
          ]
        }
      }
      else
      {
        user_stats = session_data[user];
        
        var user_data = [];   
        user_data.engagement = user_stats.engagement;
        user_data.surprise = user_stats.surprise;
        user_data.contempt = user_stats.contempt;
        user_data.joy = user_stats.joy;
        user_data.anger = user_stats.anger;
        
        //alert(JSON.stringify(user_data));
      
        barData = 
        {
          labels : ["Engagement",,"Surprise","Contempt","Joy","Anger"],
          datasets : 
          [
            {
              label: "Overall",
              backgroundColor: "rgba(58,87,214,.1)",
              borderColor: "rgba(58,87,214,.2)",
              pointBackgroundColor : "rgba(255,255,255,1)",
              data : [overall_data.engagement,overall_data.surprise,overall_data.contempt,overall_data.joy,overall_data.anger]
            },
            {
              label: "User " + user,
              backgroundColor: "rgba(144,212,153,.1)",
              borderColor: "rgba(144,212,153,1)",
              pointBackgroundColor : "rgba(144,212,153,1)",
              pointStrokeColor : "#fff",
              data : [user_data.engagement,user_data.surprise,user_data.contempt,user_data.joy,user_data.anger]
            }
          ]
        }
      }
      
      //Create Radar chart
      var ctx = document.getElementById("barChart").getContext("2d");
      //var myNewChart = new Chart(ctx,{type:'radar', data: radarData, options:""});

      var myBarChart = new Chart(ctx, {type: 'horizontalBar', data: barData, options:{ global: {
          responsive: true,
          maintainAspectRatio: false}}});
    }

    var tone_data = [];
    function setuptoneChart()
    {

      languagetone_Data = tone_data.data.document_tone.tone_categories[1].tones;
      var barData = {};

      barData = 
      {
        labels : ["Analytical","Confident","Tentative"],
        datasets : 
        [
          {
            label: "Language Tones",
            backgroundColor: "rgba(58,87,214,.1)",
            borderColor: "rgba(58,87,214,.2)",
            pointBackgroundColor : "rgba(255,255,255,1)",
            data : [languagetone_Data[0].score, languagetone_Data[1].score,languagetone_Data[2].score]
          }
        ]
      }

      var ctx = document.getElementById("barChart2").getContext("2d");

      var myBarChart = new Chart(ctx, {type: 'horizontalBar', data: barData, options:{ global: {
          responsive: true,
          maintainAspectRatio: false}}});



      socialtone_Data = tone_data.data.document_tone.tone_categories[2].tones;
      var barData = {};

      barData = 
      {
        labels : ["Openness","Conscientiousness","Extraversion","Agreeableness","Emotional Range"],
        datasets : 
        [
          {
            label: "Social Tones",
            backgroundColor: "rgba(58,87,214,.1)",
            borderColor: "rgba(58,87,214,.2)",
            pointBackgroundColor : "rgba(255,255,255,1)",
            data : [socialtone_Data[0].score, socialtone_Data[1].score, socialtone_Data[2].score, socialtone_Data[3].score, socialtone_Data[4].score]
          }
        ]
      }

      var ctx = document.getElementById("barChart3").getContext("2d");

      var myBarChart = new Chart(ctx, {type: 'horizontalBar', data: barData, options:{ global: {
          responsive: true,
          maintainAspectRatio: false}}});




    }

    // Document ready function 
    $( document ).ready(function()
    {
      // Snag chart data from the database via the API
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexaverages&session_key=<?php echo $feedbackID ?>&user=<?php echo $userID ?>", false);
      xhttp.send();
      session_data = JSON.parse(xhttp.responseText);

      setupChart("0");

      xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=tone_google&session_key=<?php echo $feedbackID ?>&user=<?php echo $userID ?>", false);
      xhttp.send();
      tone_data = JSON.parse(xhttp.responseText);

      setuptoneChart();


    })
</script>
</body>
</html>