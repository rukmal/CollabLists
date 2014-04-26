$(function() {

  var timer = undefined;
  var lastInput = undefined;

  $('#search-input').focusout(function(event) {
    $('.result').fadeOut(200);
  });

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
    var echoNestURL = 'http://developer.echonest.com/api/v4/song/search?api_key=JBLMC5BKDIPYMLYD5&bucket=id:rdio-US&bucket=tracks&results=3&bucket=id:7digital-US&sort=song_hotttnesss-desc&title=';
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
            songInfo.album_art = 'img/default-album.png';
          }
          output.push(songInfo);
        });
      }

      $('#results').empty();
      $.each(output, function(i, song) {
        var result = '<div class="result"><img src="' + song.album_art + '" class="result-album-art"><div class="result-info"><p class="result-song">' + song.title + '</p><p class="result-artist">' + song.artist + '</p></div></div>'
        $(result).appendTo('#results').hide().fadeIn(200);
      });
    });
  }
});