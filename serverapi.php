<?php
header('Access-Control-Allow-Origin: https://conference.eastus.cloudapp.azure.com:8081');
header('Access-Control-Allow-Headers: Content-type');

session_start();

try
{
	$connection = new MongoClient();
	$database = $connection->selectDB("rocconf");
}
catch(Exception $e)
{
	// Common issue with MongoClient fails the first request,
	// so retry a few times.
	$retries = 5;
	
	for($counter = 1; $counter <= $retries; $counter++)
	{
		try
		{
			$connection = new MongoClient();
			$database = $connection->selectDB("rocconf");
			break;
		}
		catch(Exception $e)
		{
			continue;
		}
	}
}

//===========================================================
// Test code to insert a collection into a test database
// and dump it to the browser.
//===========================================================
/*
$database = $connection->selectDB("RConfTest");

$collection = $database->selectCollection('test_collection');

$test_document = array("First Index" => "First Value",
                       "Second Index" => "Second Value");
					   
$collection->insert($test_document);

$collection2 = $database->selectCollection('test_collection');

echo var_dump($collection2) . "<br/><br/>";
echo $collection2->count() . " documents";
*/
//=============================================================

//=============================================================
// DANGER: The code below will wipe out the collections
// 		   should only need to use this bit for any
//         reset of the database for testing.
//=============================================================

/*
echo "Starting database cleanup..." . "<br/><br/>";

$collection = $database->selectCollection('participation');
$response = $collection->drop();

echo "Dropped participation" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('affdexmerge');
$response = $collection->drop();

echo "Dropped affdexmerge" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('affdexaverages');
$response = $collection->drop();

echo "Dropped affdexaverages" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('speechrawdata');
$response = $collection->drop();

echo "Dropped speechrawdata" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('transcript_bluemix');
$response = $collection->drop();

echo "Dropped transcript_bluemix" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('speechrawdata_bluemix');
$response = $collection->drop();

echo "Dropped speechrawdata_bluemix" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('toneanalysis_bluemix');
$response = $collection->drop();

echo "Dropped toneanalysis_bluemix" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('toneanalysis_google');
$response = $collection->drop();

echo "Dropped toneanalysis_google" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('affdexshared');
$response = $collection->drop();

echo "Dropped shared affdex data" . "<br/>";
echo print_r($response);
echo "<hr/>";

$collection = $database->selectCollection('affdexuserseat');
$response = $collection->drop();

echo "Dropped affdex user seat relationships" . "<br/>";
echo print_r($response);
echo "<hr/>";

echo "Database cleanup completed...";
*/

//=============================================================

//=============================================================
// DEBUG ACCESS POINT
// - Good place to put debug scripts for results.
//=============================================================
if($_GET['mode'] == 'debug')
{
	$collection = $_GET['collection'];
	
	$collection = $database->selectCollection($collection);
	$cursor = $collection->find();
	
	$print_document = null;
	
	foreach($cursor as $id => $document)
	{
		echo var_dump($document) . "<hr/>";
	}

	$connection->close();
}

//=============================================================
// Transcript Comparison
// - Looking at the different transcripts
//=============================================================
if($_GET['mode'] == 'transcript_checker')
{
	$key = 'bd3f7530-89b4-11e6-9414-799760e2546b';
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('speechrawdata');
	$query = array('session_key' => $key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo "<h2>Google Transcript</h2>";
	
	echo $document['transcript'];
	
	echo "<br/>";
	echo "<hr/>";
	echo "<br/>";
	
	echo "<h2>IBM Bluemix Transcript</h2>";
	
	$collection = $database->selectCollection('transcript_bluemix');
	$query = array('session_key' => $key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo $document['transcript'];
}

//=============================================================
// ACCESS POINTS FOR API GO BELOW THIS POINT
//=============================================================

// Access point for running the shell script.
if($_GET['mode'] == 'process')
{
	$key = $_GET['session_key'];
	
	$output = array();
	
	exec(dirname(__FILE__) . '/runscript.sh ' . $key, $output);
	
	foreach($output as $key => $value)
		echo $value . "<br/>";
}

// Access point for participation data for a session key.
if($_GET['mode'] == 'participation')
{
	$session_key = $_GET['session_key'];
	
	$collection = $database->selectCollection('participation');
	$query = array('session_key' => $session_key);
	
	$document = $collection->findOne($query);

	echo json_encode($document);	
	
	$connection->close();
}

// Access point for submitting Affdex data to the database.
if($_GET['mode'] == 'affdexupload')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string);
	
	//TODO -> Parse this submission and use the uploaded
	//seat:user information to fix the data points.
	
	$collection = $database->selectCollection('affdexmerge');
	$collection->insert($document);
	
	echo "affdexmerge submitted";
	
	$connection->close();
}

// Access Point for submitting User -> Seat number relationship
if($_GET['mode'] == 'seatupload')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string);
	
	$collection = $database->selectCollection('affdexuserseat');
	$collection->insert($document);
	
	echo "affdexuserseat submitted";
	
	$connection->close();
}

// Access point for merged focus and affdex data for a session key and user.
// This is for raw output from these scripts.
if($_GET['mode'] == 'affdexmerge')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('affdexmerge');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$cursor = $collection->find($query);
	
	foreach($cursor as $document)
	{
		echo json_encode($document);
	}
	
	$connection->close();
}

// Access point for merged focus and affdex data for a session key and user.
// This is for 'average' calculated data.
if($_GET['mode'] == 'affdexaverages')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('affdexaverages');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

// Access point for shared emotional state for a session
if($_GET['mode'] == 'affdexshared')
{
	$session_key = $_GET['session_key'];
	
	$collection = $database->selectCollection('affdexshared');
	$query = array('session_key' => $session_key);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

// Access point for submitting Google speech transcript data to the database.
if($_GET['mode'] == 'speechupload')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string);
	
	$collection = $database->selectCollection('speechrawdata');
	$collection->insert($document);
	
	echo "speechrawdata submitted";
	
	$connection->close();
}

// Access point for obtaining raw speech recognition detected by the 
// google web speech API.
if($_GET['mode'] == 'speechrawdata')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('speechrawdata');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

// Access point for obtaining raw speech recognition detected by the 
// IBM Bluemix web speech API (transcribed).
if($_GET['mode'] == 'speechrawdata_bluemix')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('transcript_bluemix');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

// Tone analysis results from the Google transcription
if($_GET['mode'] == 'tone_google')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('toneanalysis_google');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

// Tone analysis results from the IBM transcription
if($_GET['mode'] == 'tone_bluemix')
{
	$session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('toneanalysis_bluemix');
	$query = array('session_key' => $session_key,
				   'user' => $user);
				   
	$document = $collection->findOne($query);

	echo json_encode($document);
	
	$connection->close();
}

?>
