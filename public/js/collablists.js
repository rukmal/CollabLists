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

  function search(query) {
    console.log(query);

    // call search API
    
    // get results back
    var sample = {
      results: [
        {
          title: 'Starlight',
          artist: 'Muse'
        },
        {
          title: 'Starlight',
          artist: 'Muse'
        },
        {
          title: 'Starlight',
          artist: 'Muse'
        }
      ]
    };

    $('#results').empty();
    for (var i = 0; i < sample.results.length; i++) {
      var result = '<div class="result"><p class="result-song">' + sample.results[i].title + '</p><p class="result-artist">' + sample.results[i].artist + '</p></div>'
      $('#results').append(result);
    }
  }

});