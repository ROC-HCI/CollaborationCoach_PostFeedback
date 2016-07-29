<?php
session_start();

$connection = new MongoClient();
$database = $connection->selectDB("rocconf");

//===========================================================
// Test code to insert a collection into a test database
// and dump it.
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


if($_GET['mode'] == 'participation')
{
	$session_key = $_GET['session_key'];
	
	$collection = $database->selectCollection('participation');
	$query = array('session_key' => $session_key);
	
	$cursor = $collection->find($query);
	
	foreach($cursor as $document)
	{
		echo $document;
	}	
}


?>
