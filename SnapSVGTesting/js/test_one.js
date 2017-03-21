var session_key = '07894240-0dbf-11e7-9ae9-6d413ab416f0'; // TEST SESSION KEY - this sould end up dynamic at some point.
var iuser = 'Yiyun';

var colorpalette = ['#90D0D5','#FBF172', '#B0D357', '#C88ABC', '#4B79BD'];

// Gather participation data.
var xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://conference.eastus.cloudapp.azure.com/RocConf/serverapi.php?mode=participation&session_key=" + session_key, false);
xhttp.send();
			
var jscontent = JSON.parse(xhttp.responseText);

var total_participation = jscontent.participation['total'];

// Count up users on the call and clear out the total data.
var user_count = 0;			
for (var key in jscontent.participation)
{
	if(key == 'total')
		delete jscontent.participation[key]; 
	else
		user_count += 1;
}	

var participation_data = jscontent.participation;

console.log(participation_data);

// Create the raw graph data
var segments = [];

for (var key in participation_data)
{
	segments.push({percentage: participation_data[key] / total_participation, label: key})
}

var graph_data = {size: 400, sectors: segments}

var sectors = calculateSectors(graph_data);

// Filled in test
var svg_element = document.getElementById("chart_svg1");
svg_element.setAttributeNS(null, 'style', "width: " + graph_data.size + "px; height: " + graph_data.size + "px");

sectors.map( function(sector) {

    var newSector = document.createElementNS( "http://www.w3.org/2000/svg","path" );
    newSector.setAttributeNS(null, 'fill', sector.color);
    newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 1 0,1 ' + sector.X + ', ' + sector.Y + ' z');
    newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', '+ sector.L+', '+ sector.L+')');

    svg_element.appendChild(newSector);
});

new Vivus('chart_svg1', {duration: 200});

//==========================================================
// https://danielpataki.com/svg-pie-chart-javascript/
//==========================================================
function calculateSectors( data ) {
    var sectors = [];
    var colors = [
        '#90D0D5','#FBF172', '#B0D357', '#C88ABC'
    ];

    var l = data.size / 2
    var a = 0 // Angle
    var aRad = 0 // Angle in Rad
    var z = 0 // Size z
    var x = 0 // Side x
    var y = 0 // Side y
    var X = 0 // SVG X coordinate
    var Y = 0 // SVG Y coordinate
    var R = 0 // Rotation

    data.sectors.map( function(item, key ) 
	{
        a = 360 * item.percentage;
        aCalc = ( a > 180 ) ? 360 - a : a;
        aRad = aCalc * Math.PI / 180;
        z = Math.sqrt( 2*l*l - ( 2*l*l*Math.cos(aRad) ) );
		
        if( aCalc <= 90 ) 
		{
            x = l*Math.sin(aRad);
        }
        else 
		{
            x = l*Math.sin((180 - aCalc) * Math.PI/180 );
        }
        
        y = Math.sqrt( z*z - x*x );
        Y = y;

        if( a <= 180 ) 
		{
            X = l + x;
            arcSweep = 0;
        }
        else 
		{
            X = l - x;
            arcSweep = 1;
        }

        sectors.push({
            percentage: item.percentage,
            label: item.label,
            color: colors[key],
            arcSweep: arcSweep,
            L: l,
            X: X,
            Y: Y,
            R: R
        });

        R = R + a;
    })

    return sectors
}


