var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">'
    + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
    '</tr>'

  var $row = $(template);

  var clickHandler = function() {
    switch (currentlyPlayingSongNumber) {
    case null:
      $(this).html(pauseButtonTemplate);
      setSong(parseInt($(this).attr('data-song-number')));
      updatePlayerBarSong();
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
      break;
    case parseInt($(this).attr('data-song-number')):
      if (currentSoundFile.isPaused()) {
	currentSoundFile.play();
	$(this).html(pauseButtonTemplate);
	$('.main-controls .play-pause').html(playerBarPauseButton);
      } else {
	currentSoundFile.pause();
	$(this).html(playButtonTemplate);
	$('.main-controls .play-pause').html(playerBarPlayButton);
      }
      break;
    default:
      var $currentlyPlayingSongElement
	= getSongNumberCell(currentlyPlayingSongNumber);
      $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      setSong(parseInt($(this).attr('data-song-number')));
      updatePlayerBarSong();
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
    }
  };

  var onHover = function(event) {
    var $songItem = $(this).find('.song-item-number');
    var songItemNumber = parseInt($songItem.attr('data-song-number'));
    if (songItemNumber !== currentlyPlayingSongNumber) {
      $songItem.html(playButtonTemplate);
    }
  };
  var offHover = function(event) {
    var $songItem = $(this).find('.song-item-number');
    var songItemNumber = parseInt($songItem.attr('data-song-number'));
    if (songItemNumber !== currentlyPlayingSongNumber) {
      $songItem.html(songItemNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  // 2
  $row.hover(onHover, offHover);
  // 3
  return $row;
}

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow =
      createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
}

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var playButtonTemplate =
  '<a class="album-song-button"><span class="ion-play"></span></a>'
var pauseButtonTemplate =
  '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// 1
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

// Update the HTML in the player bar based on the current song according to the
// global variables.
function updatePlayerBarSong() {
  $('.song-name').html(currentSongFromAlbum.title);
  $('.artist-song-mobile').html(
    currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
  $('.artist-name').html(currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
}

// Update the HTML and global variables to the next song, with wraparound.
// Assumes there is a song playing.
function nextSong() {
  var previousNumber = currentlyPlayingSongNumber;
  var songI = trackIndex(currentAlbum, currentSongFromAlbum);
  var newI = (songI + 1) % currentAlbum.songs.length;
  setSong(newI + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();
  var $previousSongElement = getSongNumberCell(previousNumber);
  $previousSongElement.html(previousNumber);
  $nextSongElement = getSongNumberCell(currentlyPlayingSongNumber);
  $nextSongElement.html(pauseButtonTemplate);
}

// Update the HTML and global variables to the previous song, with wraparound.
// Assumes there is a song playing.
function previousSong() {
  var nextNumber = currentlyPlayingSongNumber;
  var songI = trackIndex(currentAlbum, currentSongFromAlbum);
  var newI = songI - 1;
  if (newI < 0) {
    newI += currentAlbum.songs.length;
  }
  setSong(newI + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();
  var $nextSongElement = getSongNumberCell(nextNumber);
  $nextSongElement.html(nextNumber);
  $previousSongElement = getSongNumberCell(currentlyPlayingSongNumber);
  $previousSongElement.html(pauseButtonTemplate);
}

// Set currentlyPlayingSongNumber and currentSongFromAlbum according to
// songNumber, which must be a positive integer or null.
function setSong(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum
    = songNumber === null
    ? null
    : currentAlbum.songs[songNumber - 1];
  // 1
  currentSoundFile = new buzz.sound(
    currentSongFromAlbum.audioUrl,
    {
      // 2
      formats: ['mp3'],
      preload: true
    });

  setVolume(currentVolume);
}

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

// Return a jQuery object corresponding to the element that contains the given
// song number.
function getSongNumberCell(number) {
  return $('[data-song-number="' + number + '"]');
}

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    // 10
    currentSoundFile.bind(
      'timeupdate',
      function(event) {
	// 11
	var seekBarFillRatio = this.getTime() / this.getDuration();
	var $seekBar = $('.seek-control .seek-bar');

	updateSeekPercentage($seekBar, seekBarFillRatio);
	setCurrentTimeInPlayerBar(this.getTime());
      });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  // 1
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  // 2
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  // 6
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    // 3
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    // 4
    var seekBarFillRatio = offsetX / barWidth;

    // 5
    updateSeekPercentage($(this), seekBarFillRatio);
    if ($(this).parent().attr('class') === 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }
  });
  // 7
  $seekBars.find('.thumb').mousedown(function(event) {
    // 8
    var $seekBar = $(this).parent();

    // 9
    $(document).bind(
      'mousemove.thumb',
      function(event) {
	var offsetX = event.pageX - $seekBar.offset().left;
	var barWidth = $seekBar.width();
	var seekBarFillRatio = offsetX / barWidth;

	updateSeekPercentage($seekBar, seekBarFillRatio);
	if ($(this).parent().attr('class') === 'seek-control') {
	  seek(seekBarFillRatio * currentSoundFile.getDuration());
	} else {
	  setVolume(seekBarFillRatio * 100);
	}
      });

    // 10
    $(document).bind(
      'mouseup.thumb',
      function() {
	$(document).unbind('mousemove.thumb');
	$(document).unbind('mouseup.thumb');
      });
  });
};

function setCurrentTimeInPlayerBar(currentTime) {
  $('.current-time').text(filterTimeCode(currentTime));
}

function setTotalTimeInPlayerBar(totalTime) {
  $('.total-time').text(filterTimeCode(totalTime));
}

function filterTimeCode(timeInSeconds) {
  timeInSeconds = parseFloat(timeInSeconds);
  var seconds = Math.floor(timeInSeconds) % 60;
  var minutes = Math.floor(timeInSeconds / 60);
  // Need sprintf().
  return '' + minutes + ':' + seconds;
}

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso)
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
