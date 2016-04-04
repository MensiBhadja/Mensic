$( document ).ready(function() {
	init();
});

//initialize Youtube
var youtubeAPIKey = "AIzaSyDnoR6Om03zkgXuPHxmL099LHx3gfuuQ8Y";
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

var trackId = "";
var artistId = "";
var videoId = "";
var currentTime = 0;
var videoDuration = 0;
var loop = 0;


function init() {

	readGetUrlVars();
	//input search bar
	$('#fixed-header-drawer-exp').bind('input paste copy cut',function(e){
		var delay = setTimeout(detectSongSearchInput, 50); //small delay to give pc time to process the paste
	});

	$(".menubar-logo").on('click', function() {
		window.location.href = location.protocol + '//' + location.host + location.pathname;
	});

	$("#errorMessageButton").on("click", function() {
		hideErrorMessage();
	});

	$("#songProgressBar").on("input", function(event) {
		var time = $("#songProgressBar").val();
		player.seekTo(time, true);
		$("#currentTime").text(displayTime(time));
		updateProgressBar();
	});

	$("#songProgressBar").on("change", function(event) {
		var time = $("#songProgressBar").val();
		player.seekTo(time, true);
		$("#currentTime").text(displayTime(time));
		updateProgressBar();
	});

	$("#soundButton").change(function () {
		switchVolume();
	});

	$("#replayButton").change(function () {
		switchLoop();
	});
};

function readGetUrlVars() {
	var getvar = getUrlVars()["song"];
	if(typeof getvar != 'undefined' && getvar != '') {
		getvar = decodeURIComponent(getvar);
		$.ajax({
			dataType: "json",
			url: "https://api.spotify.com/v1/search",
			data: {
				q: getvar,
				type: "track",
				limit: 1
			},
			success: function(data)
			{	
				console.log(data.tracks.items);
				if (data.tracks.items.length > 0) {
					var item = data.tracks.items[0];
					var song = item.artists[0].name + " - " + item.name;
					var image = item.album.images[0].url;
					if (song == getvar) {
						artistId = item.artists[0].id;
						trackId = item.id;
						loadSong(song, image);
					}
					else {
						$("#errorMessageText").text("Dit nummer kon niet worden gevonden.");
						showErrorMessage();
					}
				}
				else {
					$("#errorMessageText").text("Dit nummer kon niet worden gevonden.");
					showErrorMessage();
				}
			},
			error: function(e)
			{
				$("#errorMessageText").text("Dit nummer kon niet worden gevonden.");
				showErrorMessage();
			}
		});
	}
	
}

function detectSongSearchInput() {
	if ($('#fixed-header-drawer-exp').val() != "") {
		searchSongsOnSpotify();
	}
	else {
		$("#search-results-list").empty();
	}
}

function searchSongsOnSpotify() {
	$.ajax({
		dataType: "json",
		url: "https://api.spotify.com/v1/search",
		data: {
			q: $('#fixed-header-drawer-exp').val(),
			type: "track",
			limit: 5
		},
		success: function(data)
		{	
			$("#search-results-list").empty();
			// $("#search-results-list").append('<th class="mdl-data-table__cell--non-numeric">Zoekresultaten<th>');
			$.each(data.tracks.items, function(i, item) {
				var html = "<tr><td id='search-results-list-item-" + i + "' class='search-results-list-item mdl-data-table__cell--non-numeric'>" + item.artists[0].name + " - " + item.name + "</td></tr>";
				$("#search-results-list").append(html);
				$("#search-results-list-item-" + i).on("click", function() {
					var song = item.artists[0].name + " - " + item.name;
					var image = item.album.images[0].url;
					artistId = item.artists[0].id;
					trackId = item.id;
					loadSong(song, image);
				});
			})
			$("#search-results-list").show();

			if (data.tracks.items == 0) {
				var html = "<tr><td id='search-results-list-item-" + 0 + "' class='search-results-list-item mdl-data-table__cell--non-numeric'>Geen zoekresultaten gevonden</td></tr>";
				$("#search-results-list").append(html);
				$("#search-results-list").hide();
			}
		},
		error: function(e)
		{
			$("#search-results-list").empty();
		}
	});
}

function loadSong(song, image) {
	history.pushState('', song + ' - Mensic', "?song=" + encodeURIComponent(song));
	$("#searchBarDiv").removeClass("is-focused is-dirty"); //collapse search bar
	$("#searchArrow").fadeOut(250);
	hideErrorMessage();
	$("#music-controls").slideUp(250, function() {
		currentTime = 0;
		videoDuration = 0;
		$("#currentTime").text(displayTime(currentTime));
		$("#durationTime").text(displayTime(videoDuration));
		$("#songProgressBar").prop({
			"max": videoDuration,
			"value": currentTime
		})
		searchSongOnYoutube(song);
	});
	$("#search-results-list").empty();
	$('#fixed-header-drawer-exp').val("");
	$(".songtitle").fadeOut(250, function() {
		$(".songtitle").text(song);
		$(".songtitle").fadeIn(250);
	});
	$("#songtext").fadeOut(250, function() {
		findLyrics(song);
	});
	$("#songinfo").fadeOut(250, function() {
		$("#aboutMensic").remove();
		$("#related-songs-list").find("tr:gt(0)").remove();
		getSongInfo();
		$("#related-songs-list").show();
		$("#related-songs-list").css("display", "inline-block", "important");
		$("#songinfo").fadeIn(250);
	});
	$("#albumart").fadeOut(250, function() {
		$('#albumart').attr("src", image).fadeIn(250);
	});
}

function searchSongOnYoutube(song) {
	$.ajax({
		dataType: "json",
		url: "https://www.googleapis.com/youtube/v3/search",
		data: {
			q: song,
			playlist: song,
			part: "snippet",
			type: "video",
			videoEmbeddable: "true",
			key: youtubeAPIKey
		},
		complete: function() {
			console.log("youtube zoeken op "+this.url);
		},
		success: function(data)
		{
			console.log(data.items);
			if (typeof player !=="undefined") {
				player.destroy();
			}

			if (data.items.length > 0) {
				videoId = data.items[0].id.videoId;
				onYouTubeIframeAPIReady();
				$("#playPauseButtonIcon").text("pause");
			}
			else {
				$("#errorMessageText").text("Dit nummer kan helaas niet worden afgespeeld.");
				showErrorMessage();
			}
		},
		error: function(e)
		{
			
		}
	});
}

function onYouTubeIframeAPIReady() {

	$("#playPauseButton").prop('disabled', true);
	if (videoId != "") {
		
		player = new YT.Player('youtubePlayer', {
			height: '50',
			width: '10',
			videoId: videoId,
			events: {
				'onReady': onPlayerReady
			},
			loop: 0
		});
	}
}

function playPause() {
	if (player.getPlayerState() == 1) {
		stopVideo();
	}
	else {
		playVideo();
	}
}

function onPlayerReady(event) {
	event.target.setPlaybackQuality("small");
	event.target.setVolume(100);
	event.target.playVideo();

	$("#playPauseButton").on("click", function() {
		playPause();
	});

	$(window).keypress(function (e) {
		if (e.keyCode === 0 || e.keyCode === 32) {
			if (!$("#fixed-header-drawer-exp").is(":focus")) {
				e.preventDefault();
				playPause();
			}
		}
	})

	videoDuration = player.getDuration();
	$("#durationTime").text(displayTime(videoDuration));

	$("#songProgressBar").prop({
		"max": videoDuration
	})

	$("#rewindButton").on("click", function() {
		var time = player.getCurrentTime();
		time = time-10;
		player.seekTo(time, true);
	});
	$("#forwardButton").on("click", function() {
		var time = player.getCurrentTime();
		time = time+10;
		player.seekTo(time, true);
	});

	player.addEventListener('onStateChange', function(e) {
		playerStateChanged();
	});

	player.addEventListener('onError', function(e) {
		playerErrorHandler(e);
	});
}

function getSongInfo() {
	$.ajax({
		dataType: "json",
		url: "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=NL&limit=10",
		success: function(data)
		{
			//$("#songinfo").append('<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" id="related-songs-list"></table>');
			var count = 0;
			$.each(data.tracks, function(i, item) {
				var html = "<tr><td id='related-songs-list-item-" + i + "' class='related-songs-list-item mdl-data-table__cell--non-numeric'>" + item.artists[0].name + " - " + item.name + "</td></tr>";
				$("#related-songs-list").append(html);
				$("#related-songs-list-item-" + i).on("click", function() {
					var song = item.artists[0].name + " - " + item.name;
					var image = item.album.images[0].url;
					artistId = item.artists[0].id;
					trackId = item.id;
					loadSong(song, image);
				});
			})
			if (data.tracks == 0) {
				var html = "<tr><td id='related-songs-list-item-" + i + "' class='related-songs-list-item mdl-data-table__cell--non-numeric'>Niet gevonden</td></tr>";
				$("#related-songs-list").append(html);
			}
		},
		error: function(e)
		{
			var html = "<tr><td id='related-songs-list-item-" + i + "' class='related-songs-list-item mdl-data-table__cell--non-numeric'>Niet gevonden</td></tr>";
			$("#related-songs-list").append(html);
		}
	});
}

function playerErrorHandler(e) {
	$("#playPauseButton").prop('disabled', true);
	var errorNumber = parseInt(e.data);
	var errorText = "Er is iets fout gegaan.";
	if (errorNumber == 2) { //The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
		errorText = "Het nummer kan niet worden afgespeeld.";
	}
	else if (errorNumber == 5) { //The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
		errorText = "De muziekspeler kan het geluid niet afspelen.";
	}
	else if (errorNumber == 100) { //The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
		errorText = "Het nummer kan niet worden afgespeeld omdat het niet is gevonden.";
	}
	else if (errorNumber == 101 || errorNumber == 150) { //The owner of the requested video does not allow it to be played in embedded players.
		errorText = "Het nummer kan niet worden afgespeeld omdat dit is geblokkeerd op uw apparaat, in uw land, of omdat er copyright op zit.";
	}
	else {
		errorText = errorText + " Foutcode " + errorNumber;
	}
	$("#errorMessageText").text(errorText);
	showErrorMessage();
}

function playerStateChanged() {
	// alert(player.getPlayerState());
	$("#songBufferingBar").hide();
	setTimeout(function(){ 
		if (player.getPlayerState() == -1) { //unstarted
			$("#playPauseButtonIcon").text("play_arrow");
		}
		else if (player.getPlayerState() == 0) { //ended
			$("#playPauseButtonIcon").text("play_arrow");
			if (loop) {
				playVideo();
			};
		}
		else if (player.getPlayerState() == 1) { //playing
			$("#playPauseButton").prop('disabled', false);
			$("#playPauseButtonIcon").text("pause");
			$("#music-controls").slideDown(250);
			updateCurrentTime();
		}
		else if (player.getPlayerState() == 2) { //paused
			$("#playPauseButtonIcon").text("play_arrow");
		}
		else if (player.getPlayerState() == 3) { //buffering
			$("#playPauseButton").prop('disabled', false);
			if (player.getCurrentTime() > 0) {
				$("#songBufferingBar").show();
			}
			
			$("#playPauseButtonIcon").html("play_arrow");
			$("#music-controls").slideDown(250);
		}
		else {
			$("#playPauseButtonIcon").text("play_arrow");
		}
	}, 100);
}

function updateCurrentTime() {
	currentTime = player.getCurrentTime();
	$("#currentTime").text(displayTime(currentTime));
	$("#songProgressBar").val(currentTime);
	updateProgressBar();
	if (player.getPlayerState() == 1) {
		setTimeout(function(){
			updateCurrentTime();
		}, 200);
	}
}

function updateProgressBar() {
	var fraction =  ($("#songProgressBar").val() - $("#songProgressBar").prop('min')) / ($("#songProgressBar").prop('max') - $("#songProgressBar").prop('min'));
    if (fraction === 0) { 
        $("#songProgressBar").addClass("is-lowest-value");
    } else {
        $("#songProgressBar").removeClass("is-lowest-value");
    }
    var isIE_ = window.navigator.msPointerEnabled;

    var fractioninv = 1 - fraction;
    fraction = fraction + "1 0%";
    fractioninv = fractioninv + "1 0%";
    var upper = $("#songProgressBarContainer .mdl-slider__container .mdl-slider__background-flex .mdl-slider__background-upper")
    var lower = $("#songProgressBarContainer .mdl-slider__container .mdl-slider__background-flex .mdl-slider__background-lower");
	// upper.css("flex", fractioninv, "important");
	// upper.css("flex", fraction, "important");
	upper.css({
		"-webkit-flex": fractioninv,
		"-ms-flex": fractioninv,
		"flex": fractioninv
	});
	lower.css({
		"-webkit-flex": fraction,
		"-ms-flex": fraction,
		"flex": fraction
	});
}

function displayTime(time) {
	var minutes = Math.floor(Math.ceil(time) / 60);
	var minutesString = ("0" + Math.floor(minutes)).slice(-2);
	var seconds = time - minutes * 60;
	var secondsString = ("0" + Math.ceil(seconds)).slice(-2);
	var text = minutesString + ":" + secondsString;
	return text;
}

function stopVideo() {
		player.pauseVideo();
		
}

function playVideo() {
	player.playVideo();
	$("#playPauseButtonIcon").text("pause");
}

function switchVolume() {
	if($("#soundButton").is(":checked")) {
		$("#soundButtonIcon").text("volume_up");
		player.unMute();
	}
	else {
		$("#soundButtonIcon").text("volume_off");
		player.mute();
	}
}

function switchLoop() {
	if($("#replayButton").is(":checked")) {
		$("#replayButtonIcon").text("repeat");
		loop = 1;
	}
	else {
		$("#replayButtonIcon").text("repeat");
		loop = 0;
	}
}

function showErrorMessage() {
	$("#errorMessage").slideDown(250);
}

function hideErrorMessage() {
	$("#errorMessage").slideUp(250);
}

function makeLyricsApiFindDataReady(song) {
	query = song;
	console.log("input: " + query);
	query = query.toLowerCase();
	query = query.replace(" (origional version)", "");
	query = query.replace(" (origional mix)", "");
	query = query.replace(" (original version)", "");
	query = query.replace(" (original mix)", "");
	query = query.replace(" (radio edit)", "");
	query = query.replace(" (radio version)", "");
	query = query.replace(" (radio mix)", "");
	query = query.replace(" (extended mix)", "");
	query = query.replace(" (remix)", "");
	query = query.replace(" (single version)", "");
	query = query.replace(" - origional version", "");
	query = query.replace(" - origional mix", "");
	query = query.replace(" - original version", "");
	query = query.replace(" - original mix", "");
	query = query.replace(" - radio edit", "");
	query = query.replace(" - radio version", "");
	query = query.replace(" - radio mix", "");
	query = query.replace(" - extended mix", "");
	query = query.replace(" - remix", "");
	query = query.replace(" - single version", "");
	query = query.split(" (feat.")[0];
	query = query.replace("’", "'");
	query = query.replace(" - ", ":");
	query = makeLyricsApiDataReady(query);
	console.log("converted to: " + query);
	return query;
}

function makeLyricsApiDataReady(song) {
	query = song;
	console.log("input: " + query);
	query = query.split(" ").join("_");
	console.log("converted to: " + query);
	return query;
}

function findLyrics(song) {
	query = makeLyricsApiFindDataReady(song);
	console.log("findlyrics" + query);
	$.ajax({
		dataType: "json",
		url: "lyrics/searchLyrics.php",
		data: {
			query: query
		},
		success: function(data)
		{
			var suggestions = data.suggestions;
			console.log(suggestions);
			if (suggestions.length > 0){
				console.log("foundlyrics" + suggestions);
				var song = suggestions[0];
				var query = makeLyricsApiDataReady(song);
				console.log("getlyrics" + query);
				getLyrics(query);
			}
			else {
				updateLyrics("Geen songtekst gevonden.");
			}

		},
		error: function(e)
		{
			updateLyrics("Songtekst ophalen mislukt.");
		}
	});
}

function getLyrics(song) {
	$.ajax({
		dataType: "json",
		url: "lyrics/getLyrics.php",
		data: {
			song: song
		},
		success: function(data)
		{
			console.log("gotlyrics" + query);
			var lyrics = data.lyrics;
			if (lyrics == "Instrumental"){
				updateLyrics("Instrumentaal nummer.");
			}
			else if (lyrics == "Not found"){
				updateLyrics("Geen songtekst gevonden.");
			}
			else {
				console.log("displayLyrics" + data.url);
				displayLyrics(data.url)
			}

		},
		error: function(e)
		{
			updateLyrics("Songtekst ophalen mislukt.");
		}
	});
}

function displayLyrics(url) {
	$.ajax({
		type: "GET",
		url: "lyrics/displayLyrics.php",
		data: {
			url: url
		},
		success: function(data)
		{
			updateLyrics("Geen songtekst gevonden.");
			var lyricbox = $('.lyricbox', data);
			$(lyricbox).find("script").remove();
			updateLyrics($(lyricbox).html());
		},
		error: function(e)
		{
			updateLyrics("Songtekst ophalen mislukt.");
		}
	});
}

function updateLyrics(text) {
	$("#songtext").html(text);
	$("#songtext").fadeIn(250);
}

function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}