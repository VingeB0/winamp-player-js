"use strict";
//длина дива 100% - дюрейтион который перевести в проценты и двигать ползунок через сет интервал
var audioHidden = document.querySelector('#audioHidden');
var btnPlay = document.querySelector('#btn-play');
var btnPause = document.querySelector('#btn-pause');
var btnReset = document.querySelector('#btn-reset');
var btnPrev = document.querySelector('#btn-prev');
var btnNext = document.querySelector('#btn-next');
var btnRewind = document.querySelector('#btn-rewind');
var fieldRewind = document.querySelector('#winamp-header-main-bottom-rewind');
var btnTogglePlaylist = document.querySelector('#btn-playlist');
var audioTitle = document.querySelector('.winamp-header-main-right-title');
var audioTitleName = document.querySelector('.winamp-header-main-right-name');
var audioTitleTime = document.querySelector('.winamp-header-main-right-time');
var currentTimeBlock = document.querySelector('.winamp-header-main-left span');
var winampPlaylist = document.querySelector('#winamp-playlist');
var tracksDir = 'audio/';

var playingStatus = false;
var currentTrack = 0;

var selectedInput = document.querySelector('#inputFile');
selectedInput.addEventListener('change', function(){
	var playListContainer = document.createElement('ul');
	var playlistContent = '';
	for (var song in selectedInput.files) {
		if (!selectedInput.files[song].hasOwnProperty('name') && !(typeof(selectedInput.files[song].name) === 'undefined')) {
			playlistContent += '<li class="playListTrack"> ' +  selectedInput.files[song].name + ' </li>';
		};
	};
	playListContainer.innerHTML = playlistContent;
	winampPlaylist.appendChild(playListContainer);
});

var contentDragAndDrop = document.querySelector('.winamp-playlist-content');

contentDragAndDrop.addEventListener("drop", function(e){
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
	var playListContainer = document.createElement('ul');
	var playlistContent = '';
	var i = 0;
	var audioTags = [];

		for (var song in files) {
			if (!files[song].hasOwnProperty('name') && !(typeof(files[song].name) === 'undefined')) {
				playlistContent += '<li onclick="playFromPlaylist(' + i + ')" class="playListTrack"><span id="trackDesc' + i + '">' + files[song].name + '</span><audio controls class="track" id="audioHidden' + i + '" src="' + tracksDir + files[song].name + '"></audio></li>';
				i++;
			};
		};
		playListContainer.innerHTML = playlistContent;
		winampPlaylist.appendChild(playListContainer);
		// loadDuration();
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
	lengthTrack();
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
	audioReset();
	audioPause();
	loadAudioFilename();
	loadDuration();
	loadTime();
	lengthTrack();
	showActiveTrackInPlaylist();
	document.querySelector('#audioHidden' + trackId).play();
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
	};
};

function audioReset() {
	var sounds = document.getElementsByTagName('audio');
	for(var i=0; i<sounds.length; i++){
		sounds[i].currentTime = 0;
	};
};

function showActiveTrackInPlaylist(){
	var list = document.querySelectorAll('.playListTrack');
	for(var i = 0, l = list.length; i < l; i++){
		list[i].classList = 'playListTrack';
	};
	document.querySelector('#audioHidden' + currentTrack).parentNode.className += " active-track";
};
// 216

function lengthTrack(trackId) {
	btnRewind.classList.remove('lazyScroll');
	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
	var trackWidth = Math.floor(audioHiddenPlay.duration);
	// btnRewind.style.animationPlayState = 'initial';
	btnRewind.style.animationDuration = trackWidth + 's';

	setTimeout(function() {
		btnRewind.style.animationDuration = "none";
		// audioNext();
	},trackWidth*1000);

	setTimeout(function() {
		btnRewind.style.animationDuration = "none";
		btnRewind.classList.remove('lazyScroll');
		btnRewind.classList.add('lazyScroll');
	},1);

	// var timeSettimeout = trackWidth*1000; 
	// function func() {
	// 	btnRewind.classList.remove('lazyScroll');
	// };
	// setTimeout(func ,timeSettimeout);
	// console.log(timeSettimeout);
};

// function lengthTrack(trackId) {

// 	var audioHiddenPlay = document.querySelector('#audioHidden' + currentTrack);
// 	var trackWidth = Math.floor(audioHiddenPlay.duration);
// 	console.log(trackWidth);
// 	var updateLengthTrack = setInterval(function(){
// 		btnRewind.classList.add('transition-rewind');
// 		var persentCurTime = (audioHiddenPlay.currentTime*100)/trackWidth;
// 		btnRewind.style.left = persentCurTime + '%';
// 		console.log(persentCurTime);
// 		if (persentCurTime >= 100) {
// 			clearInterval(updateLengthTrack);
// 			btnRewind.classList.remove('transition-rewind');
// 			btnRewind.classList.add('notransition-rewind');
// 			btnRewind.style.left = '0';
// 			audioNext();
// 			btnRewind.classList.remove('notransition-rewind');
// 		}
// 	}, 100);
// };