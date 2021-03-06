"use strict";

var audioHidden = document.querySelector('#audioHidden');
var btnPlay = document.querySelector('#btn-play');
var btnPause = document.querySelector('#btn-pause');
var btnReset = document.querySelector('#btn-reset');
var btnPrev = document.querySelector('#btn-prev');
var btnNext = document.querySelector('#btn-next');
var btnRewind = document.querySelector('#btn-rewind');
var btnVolume = document.querySelector('#btn-volume');
var fieldRewind = document.querySelector('#winamp-main-bottom__rewind');
var fieldVolume = document.querySelector('#winamp-main-right__volume');
var btnTogglePlaylist = document.querySelector('#btn-playlist');
var audioTitle = document.querySelector('.winamp-main-right-title');
var audioTitleName = document.querySelector('.winamp-main-right__marquee-name');
var audioTitleTime = document.querySelector('.winamp-main-right__marquee-time');
var currentTimeBlock = document.querySelector('.winamp-main-left span');
var tracksDir = 'audio/';

var playingStatus = false;
var currentTrack = 0;

var playListContainer = document.createElement('ul');
var contentDragAndDrop = document.querySelector('.winamp-playlist-content');
contentDragAndDrop.addEventListener("drop", function(e){
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
	var playlistContent = '';
	var i = 0;
	var audioTags = [];

		for (var song in files) {
			if (!files[song].hasOwnProperty('name') && !(typeof(files[song].name) === 'undefined')) {
				playlistContent += '<li onclick="playFromPlaylist(' + i + ')" class="playListTrack"><span id="trackDesc' + i + '">' + files[song].name + '</span><audio class="track" id="audioHidden' + i + '" src="' + tracksDir + files[song].name + '"></audio></li>';
				i++;
			};
		};
		playListContainer.innerHTML = playlistContent;
		winampPlaylist.appendChild(playListContainer);
	resetVolume();
});

contentDragAndDrop.addEventListener("dragenter", function(e){
	e.stopPropagation();
	e.preventDefault();
});

contentDragAndDrop.addEventListener("dragover", function(e){
	e.stopPropagation();
	e.preventDefault();
});

btnPause.addEventListener('click', audioPause);
btnReset.addEventListener('click', audioReset);

btnNext.addEventListener('click', function(){
	audioNext();
});

function audioNext() {
	var listSounds = document.querySelectorAll('audio');
	if (currentTrack < listSounds.length - 1) {
		currentTrack++
	} else {
		currentTrack = 0;
	};
	audioPause();
	audioReset();
	loadAudioFilename();
	loadDuration();
	audioPlay(currentTrack);
	lengthTrack();
	btnRewind.style.animationPlayState = "running";
};

btnPrev.addEventListener('click', function(){
	audioPrev();
});

function audioPrev() {
	var listSounds = document.querySelectorAll('audio');
	if (currentTrack > 0) {
		currentTrack--;
	} else {
		currentTrack = listSounds.length-1;
	};
	audioPause();
	audioReset();
	loadAudioFilename();
	loadDuration();
	audioPlay(currentTrack);
	lengthTrack();
	btnRewind.style.animationPlayState = "running";
};

btnPlay.addEventListener('click', function(){
	audioPlay(currentTrack);
});

function audioPlay(trackId) {
	document.querySelector('#audioHidden' + trackId).play();
	showActiveTrackInPlaylist();
	loadDuration();
	loadAudioFilename();
	loadTime();
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	var trackWidth = Math.floor(audioHiddenPlay.duration);
	btnRewind.style.animationDuration = trackWidth + 's';
	btnRewind.classList.remove('spinIt');
	btnRewind.classList.add('lazyScroll');
	btnRewind.style.animationPlayState = "running";
	changeTrack();
};

function loadAudioFilename(trackId) {
	var fileNamePanel = document.querySelector('#audioHidden' + currentTrack).src;
	var fileNamePanelSrc = fileNamePanel.substr(fileNamePanel.lastIndexOf('/') + 1);
	audioTitleName.innerHTML = fileNamePanelSrc;
};

function loadDuration(trackId) {
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	audioTitleTime.innerHTML = Math.floor(audioHiddenPlay.duration/60) + ':' + (Math.floor(audioHiddenPlay.duration%60) < 10 ? '0' + Math.floor(audioHiddenPlay.duration%60) : Math.floor(audioHiddenPlay.duration%60));
};

function playFromPlaylist(trackId) {
	currentTrack = trackId;
	audioPause();
	audioReset();
	document.querySelector('#audioHidden' + trackId).play();
	btnRewind.style.animationPlayState = "running";
	btnRewind.classList.remove('spinIt');
	// lengthTrack();
	loadAudioFilename();
	loadDuration();
	loadTime();
	showActiveTrackInPlaylist();
	changeTrack();
};

function loadTime(trackId) {
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	audioHiddenPlay.ontimeupdate = function() {
		currentTimeBlock.innerHTML = Math.floor(audioHiddenPlay.currentTime/60) + ':' + (Math.floor(audioHiddenPlay.currentTime%60) < 10 ? '0' + Math.floor(audioHiddenPlay.currentTime%60) : Math.floor(audioHiddenPlay.currentTime%60))
	};
};

function audioPause() {
	var sounds = document.getElementsByTagName('audio');
	for(var i=0; i<sounds.length; i++){
		sounds[i].pause();
		btnRewind.style.animationPlayState = "paused";
	};
};

function audioReset() {
	var sounds = document.getElementsByTagName('audio');
	for(var i=0; i<sounds.length; i++){
		sounds[i].currentTime = 0;
	};
	lengthTrack();
};

function showActiveTrackInPlaylist(){
	var list = document.querySelectorAll('.playListTrack');
	for(var i = 0, l = list.length; i < l; i++){
		list[i].classList = 'playListTrack';
	};
	document.querySelector('#audioHidden' + currentTrack).parentNode.className += " active-track";
};

// rewindTrack
fieldRewind.addEventListener("click", function(e, trackId){
	var posXPercent = (e.offsetX/this.offsetWidth)*89;
	console.log(posXPercent + '%');
	console.log((89 - posXPercent) + '%');
	console.log((89 - posXPercent)/89);
	// btnRewind.style.left = posXPercent + '%';

	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	var trackWidth = Math.floor(audioHiddenPlay.duration);
	var setTimeFieldRewind = trackWidth*posXPercent/89;
	console.log(trackWidth*posXPercent/89);
	audioHiddenPlay.currentTime = setTimeFieldRewind;
	btnRewind.style.animationDuration = trackWidth*posXPercent/89 + 's';
	console.log(trackWidth-(trackWidth*posXPercent/89));
	var trackWidthDur = trackWidth - (trackWidth*posXPercent/89);
	changeLenTrack(posXPercent, trackWidthDur);
	console.log(trackWidthDur);
});

function changeLenTrack(posPx, trackWidthD) {
	btnRewind.classList.remove('spinIt');
	var style = document.createElement('style');
	style.type = 'text/css';
	var keyFrames = '\
	@keyframes spinIt {\
	    from {\
	        left: (A_DYNAMIC_VALUE);\
	    }\
	    to {\
	        left: 216px;\
	    }\
	}';
	style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, (posPx/89)*216 + 'px');
	document.getElementsByTagName('head')[0].appendChild(style);
	btnRewind.style.left = (posPx/89)*216 + 'px';
	setTimeout(function() {
		btnRewind.classList.add('spinIt');
	}, 10);

	console.log(trackWidthD);
	audioPlay(currentTrack);
	btnRewind.style.animationDuration = trackWidthD + 's';
	btnRewind.classList.remove('lazyScroll');
};

// rewindVolume
fieldVolume.addEventListener("click", function(e){
	var posXpersent = (e.offsetX*75)/this.offsetWidth;
	var listSounds = document.querySelectorAll('audio');
	var posXpx = (e.offsetX)/this.offsetWidth;
	btnVolume.style.left = posXpersent + '%';
	for (var i = 0; i <= listSounds.length-1; i++) {
		listSounds[i].volume = posXpx;
	};
});

function resetVolume() {
	var sounds = document.getElementsByTagName('audio');
	for(var i=0; i<sounds.length; i++){
		sounds[i].volume = 0;
	};
};

function lengthTrack(trackId) {
	btnRewind.classList.remove('lazyScroll');
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	var trackWidth = Math.floor(audioHiddenPlay.duration);
	btnRewind.style.animationDuration = trackWidth + 's';

	setTimeout(function() {
		btnRewind.style.animationDuration = "none";
	},trackWidth*1000);

	setTimeout(function() {
		btnRewind.style.animationDuration = "none";
		btnRewind.classList.remove('lazyScroll');
		btnRewind.classList.add('lazyScroll');
	},1);
};

var winampPlaylist = document.querySelector('#winamp-playlist');
btnTogglePlaylist.addEventListener('click', function(){
	winampPlaylist.classList.toggle('hide');
});

var body = document.querySelector('body');
body.addEventListener("drop", prevDefault);
body.addEventListener("dragenter", prevDefault);
body.addEventListener("dragover", prevDefault);

function prevDefault(e){
	e.preventDefault();
};

function changeTrack(trackId) {
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	setInterval(function() {
		if (audioHiddenPlay.duration == audioHiddenPlay.currentTime) {
			audioNext();
		};
	}, 10);
};