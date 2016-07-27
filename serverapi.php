<?php
error_reporting(E_ALL);

session_start();

echo "Yep you're on this page...";

echo phpinfo();

//$connection = new MongoClient();

echo var_dump($connection);

echo "Tried to echo connection...";
//===========================================================
// Test code to insert a collection into a test database
// and dump it.
//===========================================================
$database = $connection->selectDB("RConfTest");

$collection = $database['test_collection'];

$test_document = array("First Index" => "First Value",
                       "Second Index" => "Second Value");
					   
$collection->insert($test_document);

$collection2 = $database['test_collection'];

echo var_dump($collection2);

//=============================================================



?>
