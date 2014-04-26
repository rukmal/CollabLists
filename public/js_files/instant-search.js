/*
 * @description: JS code for Echo Nest instant search
 */

function EchoInstant () {
	/**
	 * Function to return search result data from the Echo Nest API
	 * @param  {text} data Song title to be searched for
	 * @return {JSON}      Results from Echo nest database search
	 */
	function echoSearch(data) {
		var echoNestURL = 'http://developer.echonest.com/api/v4/song/search?api_key=JBLMC5BKDIPYMLYD5&bucket=id:rdio-US&bucket=tracks&title=';
		data = data.replace(' ', '+');
		$.get(echonestURL + data, function (data) {
			return data;
		});
	}
}