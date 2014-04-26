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
    var output = new Array();
    if (result.status.code != 5) {
      for each (song in results.songs) {
        var songInfo = {};
        // Isolating song title and artist
        songInfo.title = song.title;
        songInfo.artist = song.artist_id;
        // Isolating album art and track id
        for each (track in song.tracks) {
          if (songInfo.album_art && track.release_image) {
            songInfo.album_art = track.release_image;
          }
          if (songInfo.id && (song.id === 'rdio-US')) {
            songInfo.id = track.foreign_id;
          }
        }
        output.push(songInfo);
      }
    }

    // do something with output

    $('#results').empty();
    for (var i = 0; i < sample.results.length; i++) {
      var result = '<div class="result"><p class="result-song">' + sample.results[i].title + '</p><p class="result-artist">' + sample.results[i].artist + '</p></div>'
      $('#results').append(result);
    }
  }
});