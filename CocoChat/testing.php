<?php
  $session_key = $_GET['key'];
  $user = $_GET['user'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
<script src="js/data_loader.js"></script>

<script>
	setup_chat_data(<?php echo $session_key; ?>, <?php echo $user; ?>);
</script>

</head>

<body>
</body>

</html>