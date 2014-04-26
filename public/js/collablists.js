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
    var echoNestURL = 'http://developer.echonest.com/api/v4/song/search?api_key=JBLMC5BKDIPYMLYD5&bucket=id:rdio-US&bucket=tracks&title=';
    data = data.replace(' ', '+');
    $.get(echoNestURL + data, showResults);
  }

  function showResults(results) {    
    console.log(results);

    $('#results').empty();
    for (var i = 0; i < sample.results.length; i++) {
      var result = '<div class="result"><p class="result-song">' + sample.results[i].title + '</p><p class="result-artist">' + sample.results[i].artist + '</p></div>'
      $('#results').append(result);
    }
  }

});