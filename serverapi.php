<?php
session_start();

$connection = new MongoClient();

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