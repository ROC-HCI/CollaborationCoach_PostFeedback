<?php
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
$collection = $database->selectCollection('participation');
$response = $collection->drop();

echo print_r($response);

$collection = $database->selectCollection('affdexmerge');
$response = $collection->drop();

echo print_r($response);
*/
//=============================================================

//=============================================================
// DEBUG ACCESS POINT
// - Good place to put debug scripts for results.
//=============================================================
if($_GET['mode'] == 'debug')
{
	$collection = $database->selectCollection('speechrawdata');
	
	foreach($collection as $document)
	{
		echo var_dump($document);
	}
}


//=============================================================
// ACCESS POINTS FOR API GO BELOW THIS POINTS
//=============================================================

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
// This is for raw output from these scripts.
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
	$document = array();
	
	foreach($_POST as $key => $value)
	{
		$document[$key] = $value;
	}
	
	$collection = $database->selectCollection('speechrawdata');
	$collection->insert($document);
}

?>
