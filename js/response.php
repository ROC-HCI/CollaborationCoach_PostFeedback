<?php 
session_start();
//====================================================
// Uploading a recorded video or audio file to server
//----------------------------------------------------
if ($_GET['action'] == 'upload') {
  if (!is_dir("uploads/")) mkdir("uploads/");
  if (!is_dir("data/")) mkdir("data/");
  if (isset($_FILES["blob"])) {
    $tempName = $_FILES["blob"]["tmp_name"];
    $destination = "uploads/".$_FILES["blob"]["name"];
    file_put_contents($destination, file_get_contents($tempName,'r'),FILE_APPEND);
  }

  /*if (isset($_FILES["${type}-bloab"])) {
    $tempName = $_FILES["${type}-blob"]["tmp_name"];
    $destination = "uploads/".$_FILES["${type}-blob"]["filename"];
    file_put_contents($destination, file_get_contents($tempName,'r'),FILE_APPEND);
    echo $filename;
  }*/
  /*echo $type;
  foreach(array('video', 'audio') as $type) {
  if (isset($_FILES["${type}-blob"])) {
    
        echo 'uploads/';
        
        $fileName = $_POST["${type}-filename"];
        $uploadDirectory = 'uploads/'.$fileName;
        echo($_FILES["${type}-blob"]["tmp_name"]);

        if (!move_uploaded_file($_FILES["${type}-blob"]["tmp_name"], $uploadDirectory)) {
            echo("problem moving uploaded file");
        }  
        $tempName = $_FILES["${type}-blob"]["tmp_name"];
        //file_put_contents($fileName, file_get_contents($tempName,'r'),FILE_APPEND);
        echo($fileName);
   }
 }*/
 echo "success";
}
//====================================================
// Checking if formatted data files exist
//----------------------------------------------------
else if ($_GET['action'] == 'checkformatteddata') {
  $dataKey = $_GET["dataKey"];
  $mergedFile = "uploads/$dataKey-merge.webm";
  if (file_exists($mergedFile)) {
    echo "true";
  } else {
    echo "Continuing to process data...";
  }
}
?>