<?php
  $feedbackID = $_GET['key'];
  $userID = $_GET['user'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Chat</title>
	<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/daneden/animate.css/master/animate.min.css">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="chat/public/css/style.css">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
	
	<!--link rel="stylesheet" type="text/css" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"-->
	<!--link rel="stylesheet" type="text/css" href="jquery/jquery-ui.theme.css"-->
	<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
	<script src="fusioncharts/fusioncharts.js"></script>
	<script src="fusioncharts/fusioncharts.charts.js"></script>
	<script src="fusioncharts/fusioncharts.widgets.js"></script>

	<!--script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script-->

</head>

<body>
	<header>
		<nav class="navbar navbar-dark">
      		<div class="container-fluid">
        		<a class="navbar-brand" href="#">
    				<img src="https://files.slack.com/files-pri/T1FSQC4CB-F2VMXLQ5D/rlogo.png" class="img-fluid" alt="">
        		</a> 
        		<div class="header-title"><h1>Feedback Assistant</h1></div>
     		</div>
  		</nav>
	</header>
	<div class="main">
			<div class="contain-body">
		  		<div class="inner-contain-body">
		     		<ul id="messages">
		  			</ul>
		    		<div class="clr"></div>
		  		</div>
		  		<div id="message-option" class="message-option">
		  		</div>
			</div>
			<div class="contain-graph">
				<div class="container-layer">
					<!-- actual feedback diagram -->
					<div id="graphContainer" class="inner-contain-graph">
						<!-- some kind of navigation instruction -->
 
			 		<div id="accordion">
						<!--h3>Interruption</h3>
				 		<div class="graph-container">
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
						<h3>Participation</h3>
						<div class="graph-container">
						<div class="outer2">
							<canvas class="chart" id="chart3" data-value="0" data-speaker=""></canvas>
						</div>
						</div>
						<h3>Turn Taking</h3>
						<div class="graph-container">
							<div class="inner-contain3" id="chart4" data-value="0" data-user=""></div>
						</div-->
			      	</div>
					</div>
				</div>
			</div>
	</div>

	<!-- link href="graphs/public/css/style.css" rel = "stylesheet"/-->

	<script src="graphs/public/js/jquery.animateNumber.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.js"></script>
    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    <script src="graphs/public/main.js"></script>
	
	<script src="chat/public/talktimeDialogue.js"></script>
	<script>
		var participation = parse(json);
		console.log(participation);

		var thinking = $('#messages li:last');
		var thinkingflag = 0;
		var graphappeared = 1;

		$(document).ready(function(){
			gotoObject(participation[Object.keys(participation)[0]]); //start from the initial item on the list
			gatherData();
		});
	
		var countType = 0;
		var graphType = ["participation", "interruption", "turntaking", "valence", "attitude", "smilesharing"];
	
        function gotoObject(object){
        	document.getElementById('message-option').innerHTML="";
        	// console.log(participation, object.title);
        	//error occur
        	if(typeof object.body == undefined || typeof object.title == undefined){
        		(function(str){
        			setTimeout(function(){
        				$('#messages').append(new item("Server", str).create());	
        			},1500);
        		})('server crashed, please email us at xxx@xxx.edu to let us know what is causing the crash so we can fix it');
        	}else{
	        	console.log('what', object.body.length); //already trimmed
	        	console.log('buttons', object.buttons); //buttons
	        	fixNewline(object);
	        	if(participation[object.title].tags=='1') 
        		{
        			graphappeared = 0;
       				$('#messages').append(new item("Roboto","Roboto is thinking...").create());
       				thinking= $('#messages li:last');			
    				
					setTimeout(function(){
						createGraph(graphType[countType]);
    					countType++;
    				},2000);
    				graphappeared = 1;
        		}
        	}
        }


        function fixNewline(obj){
        	var count = 1;
        
        	for(var str of participation[obj.title].body.split(/\\n/)){
        		console.log('whats my string ',str.length);
        		if(!/\S/.test(str)) continue;
        		(function(str){
        			if(thinkingflag == 1){
        				setTimeout(function(){
	        				thinking.remove();        			
	        				$('#messages').append(new item("Roboto", str).create());	
	        				$('.inner-contain-body').animate({ 
	        					scrollTop: $('#messages').height()
							});
        				},count*1000);
           				thinkingflag = 0;
        			}
        			else
        			{
	        			setTimeout(function(){

							thinking.remove();        			
	        				$('#messages').append(new item("Roboto", str).create());	
	        				$('.inner-contain-body').animate({ 
	        					scrollTop: $('#messages').height()
	        				});
	        			},count*2000);
	        		}
	        	})(str);
	        	count++;
	        }
        	console.log('whats the count ', count);
        	if(obj.buttons){
        		var waitvalue = (count - 1) * 2000 + 1000;
        		(function(str){
        		
        			setTimeout(function(){
						for(var b of obj.buttons){
							console.log(b);
							$('#message-option').append(new option(/\[\[(.*?)\]\]/g.exec(b.trim())[1]).create());
						}	
        			},waitvalue);
        		})(str);
        	}
        }

		//button 
		function option(o){
			this.text = o.split("|")[0];
			this.next = o.split("|")[1];
			this.button = document.createElement('button');
		}

		var test = function(e){

			$('#messages').append(new item("user", this.textContent).create());
			thinkingflag = 1;
			$('.inner-contain-body').animate({ 
			      scrollTop: $('#messages').height()
			});
			gotoObject(participation[this.getAttribute('data-next')]);
			// e.stopPropagation();
			//add a additional text
		}
		
		option.prototype.create = function() {
			this.button.textContent = this.text;
			this.button.setAttribute('data-next', this.next);
			// console.log(this.next);
			if (this.button.addEventListener) 
			    this.button.addEventListener('click',test,false); //everything else    
			else if (this.button.attachEvent)
			    this.button.attachEvent('onclick',test);  //IE only
			// console.log(this);
			return this.button;
		}

		//chat message
		function item(user, text) {
			this.user = user;
			this.text = text;
			this.li = document.createElement('li');
		}

		item.prototype.create = function() {
			var div = document.createElement('div');
			div.className = 'message-content';
			var image = document.createElement('img');
			image.className = 'profile';
			// image.className = 'img-rounded';

			
			var right = document.createElement('div');
			right.className = 'right';
			// var name = document.createElement('span');
			// name.className = 'name';
			// name.innerHTML = this.user;
			var content = document.createElement('span');
			content.className = 'content';
			content.innerHTML = this.text;

			if(this.user=='Roboto'){
				// console.log(this.user);
				image.src='https://files.slack.com/files-pri/T1FSQC4CB-F2VN90X19/chatbot.png';
				var left = document.createElement('div');
				left.className = 'left';
				left.appendChild(image);
			}else{
				//its a user
				// image.src='http://placehold.it/50x50';
				//bug add additional class
				this.li.className="text-xs-right";
				right.className+=" user-right";
				// this.li.className = "text-xs-center";
				// this.li.className += " text-xs-right";
			}


			// right.appendChild(name);
			right.appendChild(content);

		    if(left) div.appendChild(left);
		    div.appendChild(right);
		    this.li.appendChild(div);

		    return this.li;
			// $('.right').append(content);
		}

		function parse(json){
			var result = [];
			for (var element of json){
				result[element.title.trim()] = element; //assuming titles are unique

				//empty node
				if(element.tags){
					result[element.title.trim()].tags = element.tags;
					// result[element.title.trim()].body = "empty node detected!";
				} 
				if(element.body.length==0){
					console.log('element.body fixed');
					result[element.title.trim()].body = "empty node detected!";
				}else{
				//nonempty node
					var bracket = element.body.match(/\[\[(.*?)\]\]/g);
					if(bracket==null){
							result[element.title.trim()].body = element.body.trim();
					}
					else{
						result[element.title.trim()].buttons = element.body.match(/\[\[(.*?)\]\]/g);
						result[element.title.trim()].body = element.body.split(/\[\[/)[0];
				
					}
				}
			}
			return result;
		}

		function createGraph(type)
		{
			var graphDiv;

			switch (type) {

				case "participation":
					graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Participation</span></h5><div id='"+type+"' class='graph-container'><div style='height:230px;'><canvas class='chart' id='chart3' data-value='0' data-speaker=''></canvas></div></div></div></div>");
					break;
				case "turntaking":
					graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Turn Taking</span></h5><div id='"+type+"' class='graph-container'><div class='inner-contain3' id='chart4' data-value='0' data-user=''></div></div></div>");
					break;
				case "smilesharing":
					graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Shared Smile</span></h5><div id='"+type+"' class='graph-container'><div style='height:230px;'><canvas class='chart' id='joychart' data-value='0' data-speaker=''></canvas></div></div></div></div>");
					break;
				case "valence":
					graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Emotion</span></h5><div id='"+type+"' class='graph-container'><div style='margin-left:.5em;' id='chart6' data-value='0' data-user=''></div></div></div>");
					break;
				//needs fixing
				case "interruption": 
					graphDiv = $("<div style='display:none;color:black;' class='wrapper' id='wrapper-"+type+"'><h5><span>Speech Overlap</span></h5><div id='"+type+"' class='graph-container'><div class='outer'><p><span class='chart-label' id='chart1'></span></p><p>By You</p></div><div class='outer'><p><span class='chart-label' id='chart2'></span></p><p>By Others</p></div></div></div>");
					break;
				case "attitude":
					graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Attitude Towards</span></h5><div id='"+type+"' class='graph-container'><div align='center'><div style='max-width:455px; max-height:250px'><canvas style='width:455px;height:230px' id='barChart' width='455' height='250'></canvas></div></div></div></div>");
					break;
					//graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Attitude</span></h5><div id='"+type+"' class='graph-container'>
					//graphDiv = $("<div style='display:none;' class='wrapper' id='wrapper-"+type+"'><h5><span>Attitude</span></h5><div id='"+type+"' class='graph-container'><div align='center'><h6> your attitude towards </h6><p align='center'><button onclick='setupChart(0);'>Everyone</button><button onclick='setupChart(1);'>You</button><button onclick='setupChart(2);'>Ru</button><button onclick='setupChart(3);'>vivian</button></p><div style='max-width:455px; max-height:250px'><canvas id='barChart' width='250px' height='250px'></canvas></div></div></div></div>");
					
			}


			$("#accordion").append(graphDiv);
			console.log(graphDiv);	
			//$('#accordion').accordion("refresh");        
		
			//$('#accordion').append(createGraph);	
    		$('.inner-contain-graph').animate({ 
			      scrollTop: $('.wrapper:last').height()
			}, function() {
				$('#wrapper-' + type).show("slide", { direction: "up" }, 2000);
			});
			make_Graph(type);
			$('.inner-contain-graph').animate({ 
			      scrollTop: $('.wrapper:last').height()+$('#accordion').height()
			});

		}


	    var i1, i2, i3, i4, i3speaker, i3data, iuser, guests, count, colorpalette;
		var smile_graph_data = [];
		var session_data = [];		
		var single_smile_data = [];
		
		function gatherData(){

			// Gather participation data.
			var xhttp = new XMLHttpRequest();

			xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=<?php echo $feedbackID ?>", false);
			xhttp.send();
			var jscontent = JSON.parse(xhttp.responseText);
		    //document.getElementById("Audio_Data").innerHTML = xhttp.responseText;


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

			var total = total
	        i1 = interruption[0];
	        i2 = interruption[1];
	        i3 = participation;
	        //console.log('a tag ', JSON.stringify(participation,null, 2));
	        i4 = turntaking;
	        iuser = data.user;
	        console.log("what is iuser", iuser);
	        i3data = [];
	        i3speaker = [];
	        colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD'];
	        guests = {};
	        count = 0;


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

			/*$.getScript('graphs/public/main.js',function(data,textStatus){
	            console.log("load was performed. ");
	        });*/

			//maketheGraphs();

			 $( "#accordion" ).accordion({ header: '> div.wrapper > h5' });

			// SINGLE AND SHARED JOY DATA.
			var xhttp = new XMLHttpRequest();
			var userid = "<?php echo $userID; ?>";

			xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexshared&session_key=<?php echo $feedbackID ?>", false);
			xhttp.send();
			var jscontent = JSON.parse(xhttp.responseText);
			
			var single = jscontent["single_joy_data"];
			single_joy_data = {user: userid, data: single[userid]};
			
			var smile_data = jscontent["joy_data"];
			var smile_index = 0;
			for(var key in smile_data)
			{
				if(smile_data.hasOwnProperty(key))
				{
					var res = key.split(" - ");
					if(res[0] == userid || res[1] == userid)
					{
						var smile_user = "";
						
						if(res[0] != userid)
							smile_user = res[0];
						else
							smile_user = res[1];
						
						var data_point = smile_data[key];
						var element = {user: smile_user, value: data_point["Count"]};
						smile_graph_data[smile_index] = element;
						smile_index = smile_index + 1;
					}
				}
			}
			


			//Affdex Data
			var xhttp = new XMLHttpRequest();
	     	xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=affdexaverages&session_key=<?php echo $feedbackID ?>&user=<?php echo $userID ?>", false);
	      	xhttp.send();
	     	session_data = JSON.parse(xhttp.responseText);

	      	//setupChart("0");
			 
		}

	</script>
</body>
</html> 
