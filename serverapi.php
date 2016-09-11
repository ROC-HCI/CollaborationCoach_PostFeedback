<?php
header('Access-Control-Allow-Origin: https://conference.eastus.cloudapp.azure.com:8081');
header('Access-Control-Allow-Headers: Content-type');

session_start();

$connection = new MongoClient();
$database = $connection->selectDB("rocconf");

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

echo "Database cleanup completed...";

*/
//=============================================================

//=============================================================
// DEBUG ACCESS POINT
// - Good place to put debug scripts for results.
//=============================================================
if($_GET['mode'] == 'debug')
{
	$collection = $database->selectCollection('speechrawdata');
	$cursor = $collection->find();
	
	foreach($cursor as $id => $document)
	{
		echo var_dump($document) . "<hr/>";
	}
	
	$connection->close();
}


//=============================================================
// ACCESS POINTS FOR API GO BELOW THIS POINTS
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
	
	$cursor = $collection->find($query);
	
	foreach($cursor as $document)
	{
		echo json_encode($document);
	}	
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
				   
	$cursor = $collection->find($query);
	
	foreach($cursor as $document)
	{
		echo json_encode($document);
	}
}

// Access point for submitting Google speech transcript data to the database.
if($_GET['mode'] == 'speechupload')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string);
	
	$collection = $database->selectCollection('speechrawdata');
	$collection->insert($document);
	
	echo "speechrawdata submitted";
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
				   
	$cursor = $collection->find($query);
	
	foreach($cursor as $document)
	{
		echo json_encode($document);
	}
}

?>
