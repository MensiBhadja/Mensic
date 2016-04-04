<?php
	// require '../parseElementsFromDom/simple_html_dom.php';
	// if(isset($_GET['url'])) {
	// 	$url = $_GET['url'];
	// 	$html = file_get_html($url);

	// 	foreach($html->find('div[class=lyricbox]') as $element) 
	// 		$arr = array('lyrics' => strip_tags($element->innertext, "<br><script>"));
	// 		echo $element->innertext;
	// }
	// else {
	// 	$arr = array('lyrics' => "Geen songtekst gevonden.");
	// }
	// echo json_encode($arr);




		// require '../parseElementsFromDom/simple_html_dom.php';
		// if(isset($_GET['url'])) {
		// 	$url = $_GET['url'];
		// 	$html = file_get_html($url);

		// 	foreach($html->find('div[class=lyricbox]') as $element) {
		// 		$html = $element->innertext;
		// 	}

		// 	$dom = new DOMDocument();
		// 	$dom->loadHTML($html);

		// 	$script = $dom->getElementsByTagName('script');

		// 	$remove = [];
		// 	foreach($script as $item)
		// 	{
		// 	  $remove[] = $item;
		// 	}

		// 	foreach ($remove as $item)
		// 	{
		// 	  $item->parentNode->removeChild($item); 
		// 	}

		// 	$html = $dom->saveHTML();
		// 	$arr = array('lyrics' => $html);
		// }
		// else {
		// 	$arr = array('lyrics' => "Geen songtekst gevonden.");
		// }
		// echo json_encode($arr);

		
		if(isset($_GET['url'])) {
			$url = $_GET['url'];
			$html = file_get_contents($url);

			echo $html;
		}
?>
