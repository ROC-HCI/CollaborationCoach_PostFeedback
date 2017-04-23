<?php
header('Access-Control-Allow-Origin: https://conference.eastus.cloudapp.azure.com:8081');
header('Access-Control-Allow-Origin: https://conference.eastus.cloudapp.azure.com');
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
// MIGRATE AFFDEX RAW DATA TO NEW KEY
//=============================================================
/*
if($_GET['mode'] == 'stupid_thing')
{
	$key_old = 'e39a2d00-2546-11e7-abd1-2d1926002e99';
	$key_new = '999888777';
	
	$collection = $database->selectCollection('affdexmerge');
	$query = array('session_key' => $key_old);
				   
	$documents = $collection->find($query);
	
	foreach($documents as $doc)
	{
		$document_clean = array();
		$data_clean = array();
		$data = $doc["data"];
		
		foreach($data as $d)
		{
			$new_d = $d;
			if($new_d["focus"] == "B1\\")
			{
				$new_d["focus"] = "B1";
			}
			
			if($new_d["focus"] == "c1")
			{
				$new_d["focus"] = "c1LENOVO";
			}

			$data_clean[] = $new_d;
		}
		
		if($doc["user"] == "B1\\")
		{
			$document_clean["user"] = "B1";
		}
		else if($doc["user"] == "c1")
		{
			$document_clean["user"] = "c1LENOVO";
		}
		else
		{
			$document_clean["user"] = $doc["user"];
		}
		
		$document_clean["session_key"] = $key_new;
		$document_clean["data"] = $data_clean;
		
		$collection = $database->selectCollection('affdexmerge');
		$collection->insert($document_clean);
		
		echo "submitted: " . $document_clean["user"] . " with key " . $document_clean["session_key"];
	}
}
*/
//=============================================================
// Transcript Comparison
// - Looking at the different transcripts
//=============================================================
/*
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
*/

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

// Access point for getting chart data from the database
if($_GET['mode'] == 'graph_data_load')
{
	
}

// Access point for getting chatbot variable text for a session
if($_GET['mode'] == 'chat_data_load')
{
	$data_to_return = array();
	
	$key = $_GET['session_key'];
	$user = $_GET['user'];
	
	//---------------------------------------------------
	// Get the previous session key for this user
	//---------------------------------------------------
	$previous_key = null;
	
	$collection = $database->selectCollection('affdexusersocket');
	$query = array('user' => $user,
				   'session_key' => $key);
	
	// Get the submission date/time for this session
	$cursor = $collection->findOne($query);	
	$cur_time = $cursor['submitted'];
	$cur_timestamp = strtotime($cur_time);
	
	// Get all session timestamps for this user
	$query = array('user' => $user);
	$cursor = $collection->find($query);
	
	$cur_previous = 0;
	$cur_previous_key = "";
	
	// Find the maxium timestamp below the current timestamp
	foreach($cursor as $document)
	{		
		$timestamp = strtotime($document['submitted']);
		
		if(($timestamp < $cur_timestamp) && ($timestamp > $cur_previous))
		{
			$cur_previous = $timestamp;
			$cur_previous_key = $document['session_key'];
		}
	}

	$previous_key = $cur_previous_key;
	if($previous_key == null)
	{
		//------------------------------------------------------------
		// Ideally here setup the 'first' session dialog variable text
		//------------------------------------------------------------
		echo "NO_PREVIOUS_KEY";
		exit();
	}
	else
	{	
		//---------------------------------------------------
		// Participation Analysis
		//---------------------------------------------------
		$current_participation_data = null;
		$previous_participation_data = null;
		
		$collection = $database->selectCollection('participation');
		$query = array('session_key' => $key);
		$current_participation_data = $collection->findOne($query);
		
		$collection = $database->selectCollection('participation');
		$query = array('session_key' => $previous_key);
		$previous_participation_data = $collection->findOne($query);
		
		$data_to_return['session_time'] = $current_participation_data['participation']['total'];
		$previous_total = $previous_participation_data['participation']['total'];
		
		$data_to_return['participation_me'] = round(($current_participation_data['participation'][$user] / $data_to_return['session_time']) * 100, 2);
		$data_to_return['participation_me_prev'] = round(($previous_participation_data['participation'][$user] / $previous_total) * 100, 2);
		$data_to_return['overlap_me'] = $current_participation_data['interruption'][$user]['interrupting'];
		$data_to_return['overlap_me_prev'] = $previous_participation_data['interruption'][$user]['interrupting'];
		$data_to_return['overlap_other'] = $current_participation_data['interruption'][$user]['interrupted'];
		$data_to_return['overlap_other_prev'] = $previous_participation_data['interruption'][$user]['interrupted'];
		
		$turn_taking = $current_participation_data['turntaking'];
		
		$cur_min = 99999;
		$cur_min_name = "";		
		foreach($turn_taking as $key => $value)
		{
			$speaking_order = explode('-', $key);
			if($speaking_order[1] == $user)
			{
				if($value < $cur_min)
				{
					$cur_min = $value;
					$cur_min_name = $key;
				}
			}
		}
		
		$data_to_return['turntaking_least'] = $cur_min;
		$data_to_return['turntaking_least'] = $cur_min;
		
		$data_to_return['turntaking_most_name'] = 'TEST';
		$data_to_return['turntaking_most_name_prev'] = 'TEST';
		
		//---------------------------------------------------
		// Affdex Data Analysis
		//---------------------------------------------------
		$collection = $database->selectCollection('affdexaverages');
		$query = array('session_key' => $key);
					   
		$documents = $collection->find($query);
		
		$user_count = 0;
		$valence_total = 0;
		foreach($documents as $document)
		{
			$user_count = $user_count + 1;
			$valence_total = $valence_total + $document['ALL']['valence'];
		}
		
		$data_to_return['valence_group'] = $valence_total / $user_count;
				
		
		//---------------------------------------------------
		// Shared Features Analysis
		//---------------------------------------------------
		$collection = $database->selectCollection('affdexshared');
		$query = array('session_key' => $key);
				   
		$document = $collection->findOne($query);
		
		$cur_max = 0;
		$cur_max_name = "";
		
		$smile_data = $document['smile_data'];
		foreach($smile_data as $key => $value)
		{
			if($key != $user)
			{
				if($value['Count'] > $cur_max)
				{
					$cur_max = $value['Count'];
					$cur_max_name = $key;
				}
			}
		}
		
		$data_to_return['sharedsmile_most_name'] = $cur_max_name;
	}

	echo json_encode($data_to_return);	
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
	$submitted_data = json_decode($json_string,true);
	
	// Get the submitted seat to user relationship
	$relation = array();
	
	$session_key = $submitted_data["session_key"];
	$collection = $database->selectCollection('affdexusersocket');
	$query = array('session_key' => $session_key);				   
	$cursor = $collection->find($query);
	
	foreach($cursor as $location)
	{
		$relation[$location["socket"]] = $location["user"];
	}
	
	// Parse the submitted data to put in the actual user
	$data_to_parse = $submitted_data["data"];
	$final_data = array();
	
	foreach($data_to_parse as $element)
	{
		$new_element = array();
		$new_element["timeValue"] = $element["timeValue"];
		$new_element["focus"] = (!empty($element["focus"]) ? $relation[$element["focus"]] : $element["focus"]);
		$new_element["emotions"] = $element["emotions"];
		$new_element["expressions"] = $element["expressions"];
		
		$final_data[] = $new_element;
	}

	// Form up the new document for submission
	$document = array();
	$document['session_key'] = $session_key;
	$document['user'] = $submitted_data['user'];
	$document['data'] = $final_data;
	
	$collection = $database->selectCollection('affdexmerge');
	$collection->insert($document);
	
	echo "affdexmerge submitted";
	
	$connection->close();
}

// Access Point for submitting User -> SocketID relationship for a session
if($_GET['mode'] == 'socketupload')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string,true);
	$document["submitted"] = date("Y-m-d h:i:sa",time());
	
	$collection = $database->selectCollection('affdexusersocket');
	$collection->insert($document);
	
	echo "affdexusersocket submitted";
	
	$connection->close();
}

// Access Point for submitting Experiment ranking answers
if($_GET['mode'] == 'experimentSubmit')
{
	$json_string = file_get_contents('php://input');
	
	$document = json_decode($json_string,true);
	$document["submitted"] = date("Y-m-d h:i:sa",time());
	
	$collection = $database->selectCollection('experimentselections');
	$collection->insert($document);
	
	echo "selections submitted";
	
	$connection->close();
}

// Access Point for Obtaining the previous sessionID
if($_GET['mode'] == 'sessionprev')
{
	$cur_session_key = $_GET['session_key'];
	$user = $_GET['user'];
	
	$collection = $database->selectCollection('affdexuserseat');
	$query = array('user' => $user,
				   'session_key' => $cur_session_key);
	
	// Get the submission date/time for this session
	$cursor = $collection->findOne($query);	
	$cur_time = $cursor['submitted'];
	$cur_timestamp = strtotime($cur_time);
	
	// Get all session timestamps for this user
	$query = array('user' => $user);
	$cursor = $collection->find($query);
	
	$cur_previous = 0;
	$cur_previous_key = "";
	
	// Find the maxium timestamp below the current timestamp
	foreach($cursor as $document)
	{
		$timestamp = strtotime($document['submitted']);
		
		if(($timestamp < $cur_timestamp) && ($timestamp > $cur_previous))
		{
			$cur_previous = $timestamp;
			$cur_previous_key = $document['session_key'];
		}
	}

	$result = array();
	$result["prev_session_key"] = $cur_previous_key;
	
	echo json_encode($result);
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
