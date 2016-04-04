<?php
	$url = "http://lyrics.wikia.com/index.php?action=ajax&rs=getLinkSuggest&format=json&query=";
	if(isset($_GET['query'])) {
		$query = $_GET['query'];
		$query = urlencode($query);
		$url .= $query;
	}
	else {

	}
	$json = file_get_contents($url);
	echo $json;
?>