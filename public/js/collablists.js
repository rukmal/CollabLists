var apiswf = undefined;
var timer = undefined;
var lastInput = undefined;
var socket = io.connect();

$(function() {

  var queue = [];
  var currentState = {};

  $('#apiswf').rdio('GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=');

  // set up the controls
  $('#play').click(function() {
    $('#apiswf').rdio().play();
    $('.track .result-info .track-icon').first().show();
  });

  $('#next').click(function() {
    $('#apiswf').rdio().next();
  });

  $('#search-input').focusout(function(event) {
    $('.result').fadeOut(200);
  });

  $('#apiswf').bind('playingSourceChanged.rdio', function(e, playingSource) {
    if (queue.length !== 0) {
      $('.track').first().remove();
      $('.track .result-info .track-icon').first().show();
    }
    queue.shift();
    queue = [playingSource.key].concat(queue);
  });

  $('#apiswf').bind('queueChanged.rdio', function(e, newQueue) {
    queue = [queue[0]];
    $.each(newQueue, function(i, item) {
      queue.push(item.key);
    });
  });

  var displayTrack = function (song) {
    var track = '<div class="track">' + $(song)[0].innerHTML + '</div>';
    var trackId = $(song)[0].dataset.id.split(':')[2];
    $(track).appendTo('#playlist');
  }

  var queueTrack = function(event) {
    var trackId = event.currentTarget.dataset.id.split(':')[2];
    $('#apiswf').rdio().queue(trackId);

    console.log(event.currentTarget.dataset);
    
    var song = {
      id: event.currentTarget.dataset.id,
      title: event.currentTarget.dataset.song,
      artist: event.currentTarget.dataset.artist,
      album_art: event.currentTarget.dataset.art
    };
    
    // if (!currentState.playlist) {
    //   currentState.playlist = [];
    // }
    // currentState.playlist.push(song);
    // console.log(currentState.playlist);
    var addRequest = {
      song: song,
      owner_last_name: currentState.owner_last,
      slug: currentState.slug
    }

    socket.emit('add song', addRequest);

    var track = '<div class="track">' + event.currentTarget.innerHTML + '</div>';
    $(track).appendTo('#playlist').hide().fadeIn(200)
  };

  function redrawPlaylist(songs) {
    console.log(songs);
    $('#playlist').empty();
    $.each(songs, function (i, song) {
      var song = '<div class="result" data-id="' + song.id + '" data-artist="' + song.artist + '" data-song="' + song.title + '" data-art="' + song.album_art + '"><div class="arrows"><i class="upvote ion-arrow-up-b"></i><i class="ion-arrow-down-b downvote"></i></div><img src="' + song.album_art + '" class="result-album-art"><div class="result-info"><p class="result-song">' + song.title + '</p><p class="result-artist">' + song.artist + '</p><i class="track-icon ion-music-note" style="display:none;"></i></div></div>';
      // $(song, displayTracks);
      displayTrack(song);
    });

    $('.upvote').click(function(event) {
      console.log('up!');
    });
    $('.downvote').click(function(event) {
      console.log('down!');
    });
  }

  $('#search-input').keyup(function(event) {
    var query = event.currentTarget.value;
    if (query == '' || query == undefined) {
      $('#results').empty();
      return;
    }
    if (query == lastInput) {
      return;
    }
    lastInput = query;
    clearTimeout(timer);
    timer = setTimeout(function() {
      search(query);
    }, 500);
  });

  function search(data) {
    var echoNestURL = 'http://developer.echonest.com/api/v4/song/search?api_key=JBLMC5BKDIPYMLYD5&bucket=id:rdio-US&bucket=tracks&results=10&bucket=id:7digital-US&sort=song_hotttnesss-desc&title=';
    $.get(echoNestURL + data, function(results) {
      var output = [];
      if (results.response.status.code === 0) {
        $.each(results.response.songs, function(i, song) {
          var songInfo = {};
          songInfo.title = song.title;
          songInfo.artist = song.artist_name;
          $.each(song.tracks, function(j, track) {
            if (!songInfo.album_art && track.release_image) {
              songInfo.album_art = track.release_image;
            }
            if (!songInfo.id && (track.catalog === 'rdio-US')) {
              songInfo.id = track.foreign_id;
            }
          });
          if (!songInfo.album_art) {
            songInfo.album_art = '../img/default-album.png';
          }
          if (songInfo.id) {
            output.push(songInfo);
          }
        });
      };
      output = output.slice(0, Math.min(3, output.length));

      $('#results').empty();
      $.each(output, function(i, song) {
        var result = '<div class="result" data-id="' + song.id + '" data-artist="' + song.artist + '" data-song="' + song.title + '" data-art="' + song.album_art + '"><div class="arrows"><i class="upvote ion-arrow-up-b"></i><i class="ion-arrow-down-b downvote"></i></div><img src="' + song.album_art + '" class="result-album-art"><div class="result-info"><p class="result-song">' + song.title + '</p><p class="result-artist">' + song.artist + '</p><i class="track-icon ion-music-note" style="display:none;"></i></div></div>';
        $(result).appendTo('#results').hide().fadeIn(200).click(queueTrack);
      });
    });
  }

  // Get unique document identifier (only has to be done once)
  var url = document.URL;
  var splitURL = url.split('/');
  var request = {};
  // isolating the slug and owner last name from the URL
  request.slug = splitURL[splitURL.length - 1];
  request.owner_last_name = splitURL[splitURL.length - 2];
  // Refresh page state
  var refreshRate = 1000; // ms
  var first = true;
  setInterval(function () {
    socket.emit('playlist update request', request);
  }, refreshRate);
  socket.on('playlist update', function (playlistInfo) {
    currentState = playlistInfo;
    if (first) {
      $.each(playlistInfo.playlist, function (i, song) {
        $('#apiswf').rdio().queue(song.id);
      });
      first = false;
    }
    redrawPlaylist(currentState.playlist);
  });
});
