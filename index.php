<?php header('Access-Control-Allow-Origin: *'); ?>
<!DOCTYPE html>
<html>
	<head>
		<script src="js/jquery-2.1.4.min.js"></script>

		<link rel="stylesheet" href="material design lite/material.min.css">
		<script src="material design lite/material.min.js"></script>
		<link rel="stylesheet" href="material design lite/material-icons/material-icons.css">
		
		<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">

		<link rel="shortcut icon" type="image/png" href="favicon.png"/>
		<meta charset="UTF-8">
		<title>Mensic</title>

		<link rel="stylesheet" href="css/style.css">
		
		<script src="js/index.js"></script>
	</head>

	<body>

		<!-- Always shows a header, even in smaller screens. -->
		<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
								mdl-layout--fixed-header mdl-layout--fixed-tabs">
			<header class="mdl-layout__header">
				<div class="mdl-layout__header-row">
					<img src="img/logo-white.png" class="menubar-logo" title="Mensic"/>
					<div class="mdl-layout-spacer"></div>
					<div id="searchBarDiv" class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
						<label class="mdl-button mdl-js-button mdl-button--icon"
									 for="fixed-header-drawer-exp">
							<i class="material-icons">search</i>
						</label>
						<div class="mdl-textfield__expandable-holder">
							<input class="mdl-textfield__input" type="text" name="q"
										 id="fixed-header-drawer-exp" autocomplete="off">
						</div>
					</div>
				</div>
				<div class="mdl-layout__tab-bar mdl-js-ripple-effect">
					<a href="#fixed-tab-1" class="mdl-layout__tab is-active" id="tab-button-1">Start</a>
					<a href="#fixed-tab-2" class="mdl-layout__tab" id="tab-button-2">Meer</a>
				</div>
			</header>

			<main class="mdl-layout__content">
				<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" id="search-results-list">
					<th>Zoekresultaten<th><tr><td id='search-results-list-item-0' class='search-results-list-item mdl-data-table__cell--non-numeric'>Geen zoekresultaten gevonden</td></tr>
				</table>

				<section class="mdl-layout__tab-panel is-active" id="fixed-tab-1">
					<div class="page-content">
						<div class="content" id="songInfoContainer">
							<h1 id="songtitle" class="songtitle">Welkom bij Mensic!</h1>
							<div id="songtext" class"songinfo">Gebruik de zoekknop in de rechter bovenhoek om een nummer te zoeken.</div>
						</div>
					</div>
				</section>

				<section class="mdl-layout__tab-panel" id="fixed-tab-2">
					<div class="page-content">
						<div class="content" id="moreInfoContainer">
							<h1 class="songtitle">Wat is Mensic?</h1>
							<div id="songinfo" class"songinfo">
								<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id="related-songs-list">
									 <th class="mdl-data-table__cell--non-numeric">Populairste tracks van artiest</th>
								</table>
								<div id="aboutMensic">
									Mensic is een muziekapplicatie die je gratis de beste muziek laat ontdekken.
									<h1 class="songtitle">Hoe werkt Mensic?</h1>
									Mensic combineert de gegevens van Spotify en YouTube, om jou van de ultieme muziekervaring te laten genieten.
									<br/><br/>
									Mensic bevat dus alle nummers van Spotify, en speelt deze nummers met YouTube af. Daarnaast kunt u de songteksten van LyricWikia lezen.
									Voor jou ziet dit er uit alsof je een normale muziekspeler gebruikt.
									<br/><br/>
									Doordat wij gebruik maken van externe bronnen, is Mensic niet verantwoordelijk voor de data die wij aan u laten zien. 
									<br/><br/>
									<img class="apiImage" src="img/LyricWikia.png">
									<img class="apiImage" src="img/Spotify.png">
									<img class="apiImage" src="img/Youtube.png">
								</div>
							</div>
						</div>
					</div>
				</section>

				<img id="albumart" src="img/wallpaper.svg" />
				<div id="youtubePlayer"></div>

				<div id="music-controls">
					<div id="songBufferingBar" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
					<span id="currentTime" class="playTime">00:00</span>
					<div id="songProgressBarContainer">
						<input id="songProgressBar" class="mdl-slider mdl-js-slider" type="range" min="0" max="100" value="0" tabindex="0">
					</div>
					<span id="durationTime" class="playTime">00:00</span>
					<div id="music-controls-buttons">
						<label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect" for="soundButton" title="Volume on/off">
							<input type="checkbox" id="soundButton" class="mdl-icon-toggle__input" checked>
							<i id="soundButtonIcon" class="mdl-icon-toggle__label material-icons">volume_up</i>
						</label>
						<button id="rewindButton" class="mdl-button mdl-js-button mdl-button--icon" title="Rewind 10 seconds">
							<i class="material-icons">fast_rewind</i>
						</button>
						<button id="playPauseButton" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" title="Play/pause">
							<i id="playPauseButtonIcon" class="material-icons">play_arrow</i>
						</button>
						<button id="forwardButton" class="mdl-button mdl-js-button mdl-button--icon" title="Forward 10 seconds">
							<i class="material-icons">fast_forward</i>
						</button>
						<label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect" for="replayButton" title="Loop">
							<input type="checkbox" id="replayButton" class="mdl-icon-toggle__input">
							<i id="replayButtonIcon" class="mdl-icon-toggle__label material-icons">repeat</i>
						</label>
					</div>
				</div>

				<div id="errorMessage" class="demo-card-wide mdl-card mdl-shadow--2dp">
					<div class="mdl-card__title">
						<h2 id="errorMessageTitle" class="mdl-card__title-text">Error</h2>
					</div>
					<div id="errorMessageText" class="mdl-card__supporting-text">
						Er is iets fout gegaan.
					</div>
					<div class="mdl-card__actions mdl-card--border">
						<a id="errorMessageButton" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
							Oké
						</a>
					</div>
				</div>
			</main>
		</div>
	</body>
</html>
