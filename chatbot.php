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
	

</head>
<body>
	<header>
	  <nav class="navbar navbar-dark" style="background-color: cornflowerblue;">
	    <a href="#" class="navbar-brand">
	      <!-- <img src="http://placehold.it/60x60" alt="" /> --> RocConf  
	    </a>
	    <!-- <form class="form-inline float-xs-left"> -->
	      <a href="#" class="my-nav-link"><button class="active btn btn-link" type="button">My Calls</button></a>
	      <a href="https://conference.eastus.cloudapp.azure.com:8081/" class="my-nav-link"><button class="btn btn-link" type="button">New Call</button></a>
	      <a href="#" class="my-nav-link"><button class="btn btn-link" type="button">About</button></a>
	  	<!-- </form> -->
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

				 		<!--div class="graph-container">
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
				        </div-->
						<h3>Participation</h3>
						<div class="graph-container">
						<!--div class="outer2"-->
							<canvas class="chart" id="chart3" data-value="0" data-speaker=""></canvas>
						<!--/div-->
						</div>
						<h3>Turn Taking</h3>
						<div class="graph-container">
							<div class="inner-contain3" id="chart4" data-value="0" data-user=""></div>
						</div>
			      	</div>

					</div>
				</div>
			</div>
	</div>

	<!-- link href="graphs/public/css/style.css" rel = "stylesheet"/-->
	<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script src="//code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
	<script src="graphs/public/js/jquery.animateNumber.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.js"></script>
    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    <script src="graphs/public/main.js"></script>

	<!-- <script src="dialogue.js"></script> -->
	
	<script src="chat/public/talktimeDialogue.js"></script>
	<script>
		var participation = parse(json);
		console.log(participation);

		$(document).ready(function(){
			gotoObject(participation[Object.keys(participation)[0]]); //start from the initial item on the list
		});

        function gotoObject(object){
        	console.log(participation, object.title);
        	//error occur
        	if(typeof object.body == "undefined"){
        		(function(str){
        			setTimeout(function(){
        				$('#messages').append(new item("Server", str).create());	
        			},600);
        		})('server crashed, please email us at xxx@xxx.edu to let us know what is causing the crash so we can fix it');
        	}else{
	        	console.log('what', object.body.length); //already trimmed
	        	console.log('buttons', object.buttons); //buttons
	        	fixNewline(object);
        	}
        }

        function fixNewline(obj){
        	var count = 1;
        
        	for(var str of participation[obj.title].body.split(/\\n/)){
        		// console.log('whats my string ',str);
        		if(str=='') continue;
        		(function(str){
        			setTimeout(function(){
        				$('#messages').append(new item("Roboto", str).create());	
        			},count*600);
        		})(str);
        		count++;
        	}
        	if(obj.buttons){
        		for(var b of obj.buttons){
        			console.log(b);
        			$('#message-option').append(new option(/\[\[(.*?)\]\]/g.exec(b.trim())[1]).create());
        		}
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
			gotoObject(participation[this.getAttribute('data-next')]);
			// gotoObject(this.getAttribute('data-next'));
			document.getElementById('message-option').innerHTML="";
			e.stopPropagation();
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
			var left = document.createElement('div');
			left.className = 'left';
			var image = document.createElement('img');
			image.className = 'img-rounded';

			if(this.user=='roboto'){
				// console.log(this.user);
				image.src='http://placehold.it/50x50';
			}else{
				image.src='http://placehold.it/50x50';
			}
			left.appendChild(image);
			var right = document.createElement('div');
			right.className = 'right';
			var name = document.createElement('span');
			name.className = 'name';
			name.innerHTML = this.user;
			var content = document.createElement('span');
			content.className = 'content';
			content.innerHTML = this.text;
			right.appendChild(name);
			right.appendChild(content);

		    div.appendChild(left);
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
						result[element.title.trim()].body = /\b(.*)\b\s*(\[\[)/g.exec(element.body.trim())[1];
					}
				}
			}
			return result;
		}

		function createGraph()
		{
			var participationDiv = $("<div style='display:none;' id='participation' class='graph-container'><h3>Participation</h3><canvas class='chart' id='chart3' data-value='0' data-speaker=''></canvas></div>");

			$("#graphContainer").append(participationDiv);
			gatherData();
			console.log(participationDiv);			
			$('#participation').show("slide", { direction: "up" }, 1000);

		}


	    var i1, i2, i3, i4, i3speaker, i3data, iuser, guests, count, colorpalette;
		function gatherData(){

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

			maketheGraphs();

			$( "#accordion" ).accordion();

		}

	</script>
</body>
</html> 
