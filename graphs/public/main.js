function make_Graph(type){
  switch(type)
  {
    case "interruption":
      //animate numbers - interruption
	  /*
	  setTimeout(function(){
		document.getElementById('svg_41').innerHTML = i1 + " Times";
		document.getElementById('svg_42').innerHTML = i2 + " Times";
	  },5000);
	  */
	  
	  /*
	  console.log("interrupt1" + i1);
	  console.log("interrupt2" + i2);
	  $('#svg_41').val(i1);
	  $('#svg_42').val(i2);
	  */
    myNumber('#chart1',i1);
    myNumber('#chart2',i2);
    //   var ss = Snap("#guest0");
    //  var g = ss.g();
    //   var image = g.image("./graphs/public/svg/overlap.svg",0,0,200,200);
    //  myNumber('#chart1',i1);
      break;
    case "participation":
      ChartJS('#chart3');
      break;
    case "turntaking":
      createSvg();

      //create Snap canvas for user
      var s = Snap('#guest0');
      Snap.load('./graphs/public/svg/Turn_taking_bllue.svg', function(fragment){

        //border
        fragment.select('circle[stroke="#53C6D4"]').attr({
          stroke: '#53C6D4',
          strokeOpacity: .3,
          strokeWidth: 5
        });
       
        s.append(fragment);

        var text = s.text(0,-30, 'You talked after');
        text.attr({
          'font-size': '30',
          'fill': '#A7A9AC'
        });

        var currentUser = s.text(60,300, iuser+'');
        currentUser.attr({
          'visibility':'hidden',
          '#text': iuser
        });

        //fake for display
        // loado();
        //get guest1's text and create the rest for guests
        guests = getKey(currentUser.attr('#text'));
        console.log("initial guest assignment", guests);
        loadTheRest(currentUser.attr('#text'));
      });
      // loadArrow
      break;
  case "smilesharing":    
	console.log(JSON.stringify(smile_graph_data));
    for(var i = 0; i < smile_graph_data.length; i++)
    {
      var smile_emote = "";
	  var e = smile_graph_data[i];
	  var value = parseInt(e["value"],10);
	  
	  if(value == 0)
		  smile_emote = "smile_emote-00.svg";
	  else if(value > 0 && value <= 4)
		  smile_emote = "smile_emote-01.svg";
	  else if(value > 4 && value <= 6)
		  smile_emote = "smile_emote-02.svg";
	  else
		  smile_emote = "smile_emote-03.svg";
	
	  var image_source = "/RocConf/graphs/public/svg/" + smile_emote;	  
	  document.getElementById('smile_chart').innerHTML += "<div class = 'individualSmiles'><img height='70px' width='70px' src='" + image_source + "'/>&nbsp;&nbsp;" + e["user"] + " - " + e["value"] + " smiles.</div>";
    }
    break;

    case "valence":{
     var ccChart = new FusionCharts({
        type: 'hlineargauge',
        renderAt: 'chart6',
        id: 'cs-linear-gauge',
        width: '400',
        height: '140',
        dataFormat: 'json',
        dataSource: {
            "chart": {
               // "caption": "Mood",
                "captionFontColor": "#000000",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": "%",                    
                //"valueAbovePointer": "0",                    
                "showShadow": "0",
                "gaugeFillMix": "{light}",
                //"valueBgColor": "#ffffff",  
                //"valueBgAlpha":"60",
                //"valueFontColor":"#000000",
                "pointerBgColor": "#ffffff",
                "pointerBgAlpha": "50",
                "baseFontColor": "#ffffff"
            },
            "annotations": {
            "origw": "400",
            "origh": "190",
            "autoscale": "1",
            "groups": [{
                "id": "range",
                "items": [{
                    "id": "rangeText",
                    "type": "Text",
                    "fontSize": "11",
                    "fillcolor": "#000000",
                    "text": "negative<----------- neutral ----------->positive",
                    "x": "$chartCenterX",
                    "y": "$chartEndY-25"
                }]
            }]
            }, 
            "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": "16",
                        //"label": "Low",
                        "code": "#ff6347"
                    }, 
                    {
                        "minValue": "16",
                        "maxValue": "32",
                        //"label": "Almost Low",
                        "code": "#ffb6c1"
                    },
                    {
                        "minValue": "32",
                        "maxValue": "48",
                        //"label": "Neutral",
                        "code": "#fff0f5"
                    }, 
                     {
                        "minValue": "48",
                        "maxValue": "52",
                        //"label": "Neutral",
                        "code": "#ffffff"
                    }, 
                    {
                        "minValue": "52",
                        "maxValue": "68",
                        //"label": "Neutral",
                        "code": "#f5fffa"
                    }, 
                    {
                        "minValue": "68",
                        "maxValue": "84",
                        //"label": "Almost High",
                        "code": "#7fffd4"
                    },
                    {
                        "minValue": "84",
                        "maxValue": "100",
                        //"label": "High",
                        "code": "#00fa9a"
                    },
                ]
            },
            "pointers": {
                "pointer": [
                    {
                        //refer to overall average for now
                        "value": (session_data["ALL"].valence+100)/2
                    }
                ]
            }
        },
        "events": {
            "rendered" : function (evtObj, argObj){
                var intervalVar = setInterval(function () {
                    var prcnt = 65 + parseInt( Math.floor(Math.random() * 10), 10);
                }, 5000);
            }
        }
    })
    .render();
    }
    break;
    case "attitude":
      setupChart(0);
    break;

  }
}

function setupChart(user)
{
  /*var overall_stats = session_data["ALL"];    
  var overall_data = [];    
  overall_data.engagement = overall_stats.engagement;
  overall_data.attention = overall_stats.attention;
  //overall_data.joy = overall_stats.joy;
  overall_data.surprise = overall_stats.surprise;
  overall_data.anger = overall_stats.anger;*/
  

  var barData = {};
  
  //barDataSet = [user_data];
  /*if(user == "0")
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
  {*/

    var dataset = [];
    var palettecount = 0;
    var overall_data = []; 

    var overall_stats = session_data["ALL"];    
    overall_data = [overall_stats.engagement, overall_stats.attention, overall_stats.surprise, overall_stats.anger];

    dataSection = {
      label: "Everyone",
      backgroundColor: guests[iuser],
      borderColor: guests[iuser],
      pointBackgroundColor : guests[iuser],
      data: overall_data
    }
    palettecount++;
    console.log(dataSection);
    dataset.push(dataSection);

    for(var key in session_data)
    {
      if(session_data.hasOwnProperty(key))
      {
        if(key != "_id" && key != "session_key" && key != "user" && key != "ALL")
        {
          var overall_data = []; 
          var overall_stats = session_data[key];    
          /*(overall_data.engagement = overall_stats.engagement;
          overall_data.attention = overall_stats.attention;
          overall_data.surprise = overall_stats.surprise;
          overall_data.anger = overall_stats.anger;*/
          overall_data = [overall_stats.engagement, overall_stats.attention, overall_stats.surprise, overall_stats.anger];

          dataSection = {
            label: key,
            backgroundColor: guests[key],
            borderColor: guests[key],
            pointBackgroundColor : guests[key],
            data: overall_data
          }

          console.log(dataSection);
          dataset.push(dataSection);
          palettecount++;

        }
      }
    }

    /*user_stats = session_data["2"];
    
    var user_data = [];   
    user_data.engagement = user_stats.engagement;
    user_data.surprise = user_stats.surprise;
    user_data.contempt = user_stats.contempt;
    user_data.joy = user_stats.joy;
    user_data.anger = user_stats.anger;

    user_stats = session_data["3"];
    
    var user_data2 = [];   
    user_data2.engagement = user_stats.engagement;
    user_data2.surprise = user_stats.surprise;
    user_data2.contempt = user_stats.contempt;
    user_data2.joy = user_stats.joy;
    user_data2.anger = user_stats.anger;*/
    
  
    barData = 
    {
      labels : ["Engagement","Attention","Surprise","Anger"],
      datasets : dataset
      /*[
        {
          label: "Everyone",
          backgroundColor: "#90D0D5",
          borderColor: "#90D0D5",
          pointBackgroundColor : "#90D0D5",
          data : [overall_data.engagement,overall_data.surprise,overall_data.contempt,overall_data.joy,overall_data.anger]
        },
        {
          label: "Ru",
          backgroundColor: "#FBF172",
          borderColor: "#FBF172",
          pointBackgroundColor : "#FBF172",
          pointStrokeColor : "#fff",
          data : [user_data.engagement,user_data.surprise,user_data.contempt,user_data.joy,user_data.anger]
        },
        {
          label: "vivian",
          backgroundColor: "#B0D357",
          borderColor: "#B0D357",
          pointBackgroundColor : "#B0D357",
          pointStrokeColor : "#fff",
          data : [user_data2.engagement,user_data2.surprise,user_data2.contempt,user_data2.joy,user_data2.anger]
        }
      ]*/
    }
  //}
  
  var ctx = document.getElementById("barChart").getContext("2d");
  var myBarChart = new Chart(ctx, {type: 'horizontalBar', data: barData, options:{ global: {
      responsive: true,
      maintainAspectRatio: false},
      scales: {
          yAxes: [{
              ticks: {
                  max: 100,
              }
          }]
      }
    }});
}

// chart1,2 stuff
function myNumber(id, data) {
/*$(id).animateNumber({
  number: data,
  color: 'white',
  'font-size': '13px',

  easing: 'easeInQuad'

},'normal');*/
  $(id).append(data+" times");
}

//chart3 stuff
function ChartJS(id) {
var i3speakernew = i3speaker;

for(var i=0;i<i3speakernew.length;i++) {
  console.log(i3speakernew[i], 'user: ',iuser);
  if(i3speakernew[i]==iuser) 
    i3speakernew[i] = 'You';
}
var chart = new Chart($(id),{
    type: 'pie',
    data: {
        labels: i3speakernew,
        datasets: [{
            data: i3data,
            backgroundColor: colorpalette
        }]
    },
    options: {
        
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            responsive: true,
        }
    },
    animation:{
        animateScale:true
    }
});

}

//chart4 stuff
function createSvg() {

  var margin = getInitialMargin(i3speaker.length);
  //add arrows
  $('#chart4').append(createGuest(-1));
  console.log('initial margin', margin);
  //iterate all users
  for(var i=0; i<i3speaker.length;i++){
    //create svg node
    var svg = createGuest(i);

    //other than the default user
    if(i>0){
      console.log('current margin ',margin);
      svg.setAttributeNS(null,'style','margin-top:'+margin+'%; left: 55%;');

      //5 users
      if(i3speaker.length===5) { 
        svg.setAttributeNS(null,'style', 'margin-top:'+margin+'%;left: 65%;');
        if(i===1){
          margin+=getMarginStep(5);//next -15
        }
        else if(i===2){
          margin*=-1; //next 15
          margin+=7;
        }else{
          console.log('whats i',i);
          margin+=36;
        }

      }else {
        margin += getMarginStep(i3speaker.length);
      }

      console.log('now margin ',margin);

    }

    //draw svg
    $('#chart4').append(svg);

  }

}

function getInitialMargin(count) {
  var margin = 0;
  switch(count) {
    case 2: 
      margin = 1;
      break;
    case 3:
      margin = -20;
      break;
    case 4:
      margin = -30;
      break;
    case 5:
      margin = -40;
      break;
  }
  return margin;
}

function getMarginStep(count) {
  var step = 0;
  switch(count) {
    case 2: 
      break;
    case 3:
      step = 44;
      break;
    case 4:
      step = 31;
      break;
    case 5:
      step = 29;
      break;
  }
  return step;
}

function createGuest(index) {

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "id", "guest"+(index));
  if(index===0)
      svg.setAttributeNS(null,"viewBox", "0 -100 451 451");
  else if(index===-1)
      svg.setAttributeNS(null, "viewBox", "0 0 451 551");
  else
      svg.setAttributeNS(null, "viewBox", "0 0 451 451");
  

  return svg;
}

function getKey(currentUser) {
  //currentUser = currentUser.replace(/Data\/test-key-test_/g, "");

  guests.current = currentUser;
  guests.to = []; //eg Viv-Ru means Ru talked after Viv
  guests.total = 0;
  console.log("before loop", guests);
  for(var key in i4) {
    //key = key.replace(/Data\/test-key-test_/g, "");
    console.log("all the keys", key);

    if(key.toString().split('-')[1]===currentUser) {
        guests.current = currentUser;
        var node = {};
        node.guest = key.toString().split('-')[0];
        node.times = i4[key];

        guests.to.push(node);
        guests.total+= i4[key];
    }
  }
  
  console.log("after loop", guests);
  return guests;
}

function drawArrows(count){
  //testing
  // count = 4;
  var s = Snap('#guest-1');
  if(count===1){
    Snap.load('graphs/public/svg/straight-arrow.svg',function(f){
      // var g = f.select('g:nth-of-type(1)').clear();
      s.append(f);
    });
  }
  else if(count===2){
    Snap.load('graphs/public/svg/3_ppl_arrows.svg',function(f){
      s.append(f).attr({
        'y': 60
      });
    });
  }else if(count===3){
    Snap.load('graphs/public/svg/4_ppl_arrows.svg',function(f){
      s.append(f).attr({
        'y': 60
      });
    });
  }else{
    //4 guests
    Snap.load('graphs/public/svg/5_ppl_arrows.svg',function(f){
      s.append(f).attr({
        'y': 60
      });
    });
  }
}

//fake test
function loado(){
  $('svg[id^="guest"]:not("#guest0")').each(function(){
    console.log('lala');
    var id = this.id.toString().match(/\d+/)[0];
    var s = Snap('#guest'+id);
    // s.clear();
    Snap.load('.graphs/public/svg/Turn_taking_yellow.svg',function(fragment){
      s.append(fragment);
    });
  });

  console.log(i3speaker.length-1);
  drawArrows(i3speaker.length-1);
}

function loadTheRest(user) {
  console.log('now load the guest',user);
  var guests = getKey(user);
  var count = 0;

  //iterate guests who talked after user
  $('svg[id^="guest"]:not("#guest0, #guest-1")').each(function(){
    //fixhere
    var id = this.id.toString().match(/\d+/)[0];
    var s = Snap('#guest'+id);

    s.clear();
    var outercircle = s.circle(100,100,70,70).attr({
      fill: "none",
      stroke: "#aaa",
      strokeWidth: 3
    });

    var mask = s.rect(0,50,200,200).attr({
      fill: "white",
      transform:'t0,100'
    });

    console.log("guests-right before",  guests);
    var indivicolor = guests[guests.to[count].guest];
    var innercircle = s.circle(100,100, 68, 68).attr({
      fill: indivicolor,
      mask: mask,
      id: 'innercircle'
    });

    //grouped guest speaker svg
    var bubble = s.group(innercircle,outercircle).attr({id: (count+1)});

    var text = s.text(200,150,'0%').attr({
      'font-size': '30',
      'fill':'#A7A9AC'
    });

    var label = s.text(200,100,guests.to[count].guest).attr({
      'font-size': '30',
      '#text': guests.to[count].guest,
      'id': 'label',
      'fill':'#A7A9AC'
    });

    if(label.attr('#text')==iuser){
      //rename the attribute
      label.attr({'#text': 'You'});
    }

    //calculate the percentage to fill
    var percent = Math.round(guests.to[count].times/guests.total*100);

    //filling effect 
    var endpoint = percent/100; //max y 1.0
    //text
    Snap.animate(0, endpoint, function (val) {
      // console.log('val is ',Math.round(val*100));
      text.attr({ text: Math.round(val*100)+"%" });
    },2000, mina.easeinout);

    //filling effect, max absolute transform 0
    mask.animate({
      transform:"t0,"+(100-percent)+""},1000,mina.easeOut);

    // s.select('text').attr({'fill':'#A7A9AC'});
    
    //click function
    var clickCB = function(){

      //get the cliked speaker's data
      var s = Snap('#guest'+bubble.attr('id'));
      var color = s.select('#innercircle').attr('fill');
      var guestName = s.select('#label').attr('#text');

      //if the guest speaker is the default user, replace text with name
      if(guestName==='You'){
        console.log('I got luis');
        guestName = iuser;
      }

      //calling exchanging current speaker
      swipe(guestName, color);
    }
    
    bubble.click(clickCB,1000,mina.easein);

    count+=1; 
  });
  console.log(i3speaker.length-1);
  drawArrows(i3speaker.length-1);
}

//exchanging current speaker
function swipe(name,color){

  //change the name of the current user
  var s = Snap('#guest0');
  var text = s.select('text:nth-of-type(1)');
  text.attr({
    '#text': name+' talked after'
  });

  //always have default user displayed as You
  if(name===iuser){
    text.attr({'#text': 'You talked after'});
  }

  //animating transition for both circle and border
  s.select('circle:nth-child(1)').animate({fill: color},1000,mina.easeOut);
  s.select('circle:nth-of-type(2)').animate({
    stroke: color,
    strokeOpacity: .3,
    strokeWidth: 5
  },1000,mina.easeOut);

  //load the corresponding guest speakers
  loadTheRest(name);

}