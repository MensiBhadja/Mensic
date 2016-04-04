<?php
	$songArray = [];
	if(isset($_GET['song'])) {
		$song = $_GET['song'];
		$songArray = explode(":",$song);
	}
	else {

	}
	$url = "http://lyrics.wikia.com/api.php?action=lyrics&artist=" . urlencode($songArray[0]) . "&song=" . urlencode($songArray[1]) . "&fmt=realjson";
	$json = file_get_contents($url);
	echo $json;
?>