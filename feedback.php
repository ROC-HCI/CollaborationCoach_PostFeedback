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
	<link href="graphs/public/css/style.css" rel = "stylesheet"/>
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel = "stylesheet"/>
</head>
<body>
<div id ="Audio_Data" ></div>
<div id ="Video_Data"></div>
<div id ="Text_Data"></div>

</body>
<script>

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexmerge&session_key=test-key-test&user=Luis", false);
	xhttp.send();
	document.getElementById("Audio_Data").innerHTML = xhttp.responseText;

	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=test-key-test", false);
	xhttp.send();
	document.getElementById("Video_Data").innerHTML = xhttp.responseText;
</script>

	<h1>Interruption</h1>
	
	<div class="outer">
		<span id="id" class="chart-label" data-value="value">
		<p label="chart1" value=>

		</p>

		<p>
			By You
		</p>
	</div>

	<div class="outer">
		<p>

		</p>

		<p>
			By Others
		</p>
	</div>

	<div class="outer">
		<h1>Participation</h1>
		<canvas id='chart3' class='chart' data-value='0' data-speaker='' />

	</div>

	<h1>Turn Taking<h1>
	   <div class ="inner-contain3" id = "chart4" data-value='0' data-user=''></div>


    <script src='https://code.jquery.com/jquery-3.1.0.min.js' />
    <script src='graphs/public/js/jquery.animateNumber.min.js' />
    <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js' />
    <script src='https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js' />
    <script>
        var total = total
        var i1 = #{value1};
        var i2 = #{value2};
        var i3 = !{JSON.stringify(value3)};
        var i4 = !{JSON.stringify(value4)};
        var iuser = '#{overalluser}';
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
        $.getScript('#{path}main.js',function(data,textStatus){
            console.log("load was performed. ");
        });
    </script>
</html>

html
    head
        meta(charset='utf-8')
        meta(name='viewport', content='width=device-width, initial-scale=1')
        mixin style(url)
            link(rel='stylesheet', href=url type='text/css')
        +style('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css')
        link(href='/css/style.css', rel='stylesheet')
    body
        .text-center.container
            .inner-contain1
                h1 Interruption
                .outer
                    mixin label(id,value)
                        span(id=id,class='chart-label',data-value=value)
                    p
                        +label('chart1', value1)
                    p By You
                .outer
                    p
                        +label('chart2', value2)
                    p By Others
            .inner-contain2
                .outer2
                    h1 Participation
                    canvas(id='chart3', class='chart', data-value='0' data-speaker='')
            h1 Turn Taking
            .inner-contain3#chart4(data-value='0' data-user='')
        script(src='https://code.jquery.com/jquery-3.1.0.min.js')
        script(src='/js/jquery.animateNumber.min.js')
        script(src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js')
        script(src='https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js')
        //script(src='../../Real-Faces/static/js/main.js')
        script.
            var total = total
            var i1 = #{value1};
            var i2 = #{value2};
            var i3 = !{JSON.stringify(value3)};
            var i4 = !{JSON.stringify(value4)};
            var iuser = '#{overalluser}';
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
            $.getScript('#{path}main.js',function(data,textStatus){
                console.log("load was performed. ");
            });
