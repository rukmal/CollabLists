$(function() {

  var timer = undefined;

  $('#search-input').keyup(function(event) {
    var query = event.currentTarget.value;

    if (query == '' || query == undefined) {
      $('#results').empty();
      return;
    }

    clearTimeout(timer);

    timer = setTimeout(function() {
      search(query);
    }, 500);
  });

  function search(data) {
    var echoNestURL = 'http://developer.echonest.com/api/v4/song/search?api_key=JBLMC5BKDIPYMLYD5&bucket=id:rdio-US&bucket=tracks&results=3&bucket=id:7digital-US&sort=song_hotttnesss-desc&title=';
    data = data.replace(' ', '+');
    $.get(echoNestURL + data, showResults);
  }

  function showResults(results) {
    var output = [];
    if (results.response.status.code != 5) {
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
        output.push(songInfo);
      });
    }

    console.log(output);

    // do something with output
    $('#results').empty();
    for (var i = 0; i < output.length; i++) {
      var result = '<div class="result"><p class="result-song">' + output[i].title + '</p><p class="result-artist">' + sample.results[i].artist + '</p></div>'
      $('#results').append(result);
    }
  }
});