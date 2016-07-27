<?php
error_reporting(E_ALL);

session_start();

$connection = new MongoClient();

//===========================================================
// Test code to insert a collection into a test database
// and dump it.
//===========================================================
$database = $connection->selectDB("RConfTest");

$collection = $database->selectCollection('test_collection');

$test_document = array("First Index" => "First Value",
                       "Second Index" => "Second Value");
					   
$collection->insert($test_document);

$collection2 = $database->selectCollection('test_collection');

echo var_dump($collection2) . "<br/><br/>";
echo $collection2->count() . " documents";

//=============================================================



?>
