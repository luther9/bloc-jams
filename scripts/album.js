var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">'
    + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>'

  var $row = $(template);

  var clickHandler = function() {
    switch (currentlyPlayingSongNumber) {
    case null:
      $(this).html(pauseButtonTemplate);
      setSong(parseInt($(this).attr('data-song-number')));
      updatePlayerBarSong();
      break;
    case parseInt($(this).attr('data-song-number')):
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      setSong(null);
      break;
    default:
      var $currentlyPlayingSongElement
	= getSongNumberCell(currentlyPlayingSongNumber);
      $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      setSong(parseInt($(this).attr('data-song-number')));
      updatePlayerBarSong();
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

// Update the HTML in the player bar based on the current song according to the
// global variables.
function updatePlayerBarSong() {
  $('.song-name').html(currentSongFromAlbum.title);
  $('.artist-song-mobile').html(
    currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
  $('.artist-name').html(currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
}

// Update the HTML and global variables to the next song, with wraparound.
// Assumes there is a song playing. If forward is true, go to the next song,
// else go to the previous one.
function changeSong(forward) {
  var oldNumber = currentlyPlayingSongNumber;
  var oldI = trackIndex(currentAlbum, currentSongFromAlbum);
  var newI;
  if (forward) {
    newI = (oldI + 1) % currentAlbum.songs.length;
  } else {
    newI = oldI - 1;
    if (newI < 0) {
      newI += currentAlbum.songs.length;
    }
  }
  setSong(newI + 1);
  updatePlayerBarSong();
  var $oldSongElement = getSongNumberCell(oldNumber);
  $oldSongElement.html(oldNumber);
  $newSongElement = getSongNumberCell(currentlyPlayingSongNumber);
  $newSongElement.html(pauseButtonTemplate);
}

// Set currentlyPlayingSongNumber and currentSongFromAlbum according to
// songNumber, which must be a positive integer or null.
function setSong(songNumber) {
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum
    = songNumber === null
    ? null
    : currentAlbum.songs[songNumber - 1];
}

// Return a jQuery object corresponding to the element that contains the given
// song number.
function getSongNumberCell(number) {
  return $('[data-song-number="' + number + '"]');
}

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso)
  $previousButton.click(function() {
    changeSong(false)
  });
  $nextButton.click(function() {
    changeSong(true)
  });
});
