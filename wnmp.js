"use strict";
/*Constants*/
var playlistElement = document.querySelector('#playlist');
var baseDir = 'music/';
var playlist = [
	'track1.mp3',
	'track2.mp3',
	'track3.mp3'
];
/*Generate playlist*/
var playlistHTML = '';
for(var i = 0, l = playlist.length; i < l; i++){
	playlistHTML += '<div class="song">'+ (i+1) + '. ' + playlist[i] +'<audio class="track" id="track'+ i +'" type="audio/mpeg"><source src="' + baseDir + playlist[i] + '"></audio></div>';
}
/*Push playlist into HTML*/
playlistElement.innerHTML = playlistHTML;

/*Load tracks durations*/
function loadDuration(){
	var tracks = document.querySelectorAll('.track');
	for(var i = 0; i < tracks.length; i++){
		tracks[i].onloadedmetadata = function(){
			var duration = document.createElement('span');
			duration.classList = 'duration';
			duration.innerHTML = Math.floor(this.duration/60) + ':' + (Math.floor(this.duration%60) < 10 ? '0' + Math.floor(this.duration%60) : Math.floor(this.duration%60))
			this.parentNode.appendChild(duration);
		}
		ID3.loadTags(baseDir + playlist[i], function() {
		    var tags = ID3.getAllTags(filename);
		    var songTags = document.createElement('span');
			songTags.classList = 'duration';
			songTags.innerHTML = tags;
			this.parentNode.appendChild(songTags);
		});
	}
}

loadDuration();