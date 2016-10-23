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
	<link rel="stylesheet" type="text/css" href="css/style.css">
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
				</div>
			</div>
	</div>
	<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script src="//code.jquery.com/ui/1.12.0/jquery-ui.js"></script>

	<link href="../../graphs/public/css/style.css" rel = "stylesheet"/>
	<script src="../../graphs/public/js/jquery.animateNumber.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.js"></script>
    <script src="https://cdn.rawgit.com/adobe-webplatform/Snap.svg/master/dist/snap.svg-min.js"></script>
    
	<!-- <script src="dialogue.js"></script> -->
	
	<script>
		$(document).ready(function(){
			goto('start');
			createGraph();
		})
		var dialog = {
            'start': ['Hi from me? [cleader:leading effective meeting],[cteamrole:my role in team], [cteam:overall team dynamics],[callfeedback:all]'],
            'cleader': ['ok, Got it! Now viewing participation [cgoon: cparticipation]'],
            'cteamrole': ['ok, Got it! Now viewing participation'],
            'cteam': ['ok, Got it! Now viewing participation'],
            'callfeedback': ['ok, Got it! Now viewing participation'],
            'cparticipation': ['Your participation is blabla. Any thoughts? [cturntaking: I can see that], [cturntaking: no], [cparticipation2: explain more]'],
            'cparticipation2': ['more participation'],
            'cturntaking': ['end here to see if worked' ]
        };
        var track = 'start';

        function goto(line){
        	var message = $('#messages');
        	console.log('what', line, dialog[line.trim()]);

	        setTimeout(function(){
	        	message.append(
	        		new item("Roboto", ButtonFix(dialog[line.trim()]+"")
	        		).create()
	        	);
	        }, 500);
        }

        function ButtonFix(str){
        	return str+"".search(/[(.+):(.+)]/)!=-1? str.replace(/\[(.*?)\],?/g,function(match,$1){
        		if($1.split(":")[0]=='cgoon'){
        			console.log($1.split(":")[1]);
        			goto($1.split(":")[1]+"");
        		}else{
        			$('#message-option').append(new option($1).create());
        		}
        		return '';
        	}) : str;
        }
        
	// for(let i=0; i< dialogue.length; i++){
	// 	line = dialogue[i];
	// 	if(line.m){ //if line contains a message
	// 		$('#messages').append(new item("Roboto", "Hi"+user+". "+line.m).create());
	// 	}
	// 	else if(line.question){ //if line contains a question
	// 		$('#messages').append(new item("Roboto", line.question).create());
	// 		for(i in line.options){
	// 			//add buttons
	// 			$('#message-option').append(new option(line.options[i]).create());
	// 		}

	// 		/*problem code*/
	// 		var newindex = 0;
	// 		$('#message-option button').click(function(){
	// 				label = $(this).attr('data-next');
	// 				newindex = jump(label);
	// 				console.log('new index ', dialogue[newindex]);
	// 		});
	// 	}
	// }

		// function jump(label){
		// 	for(i in dialogue){
		// 		if(dialogue[i].label && dialogue[i].label == label){
		// 			return i;
		// 		}
		// 	}
		// 	return -1;
		// }

		//button 
		function option(o){
			this.next = o.split(":")[0];
			this.text = o.split(":")[1];
			this.button = document.createElement('button');
		}

		var test = function(e){
			$('#messages').append(new item("user", this.textContent).create());
			goto(this.getAttribute('data-next'));
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

		function createGraph()
		{
			var participationDiv = $("<div style='width:80%;height:40%;display:none' id='participation' class='outer2'><h3>Participation</h3><canvas class='chart' id='chart3' data-value='0' data-speaker=''></canvas></div>");

			$("#graphContainer").append(participationDiv);

			gatherData();


			console.log(participationDiv);
			
			$('#participation').show("slide", { direction: "up" }, 1000);


	        $.getScript('../../graphs/public/main.js',function(data,textStatus){
	            console.log("load was performed. ");
	        });

		}

    	/*function runEffect() {
	     // get effect type from
	      var selectedEffect = $( "#effectTypes" ).val();
	 
	      // Most effect types need no options passed by default
	      var options = {};
	      // some effects have required parameters
	      if ( selectedEffect === "scale" ) {
	        options = { percent: 50 };
	      } else if ( selectedEffect === "size" ) {
	        options = { to: { width: 280, height: 185 } };
	      }
	 
	      // Run the effect
	      $( "#effect" ).show( selectedEffect, options, 500, callback );
	    };*/

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
		}

	</script>
</body>
</html> 
