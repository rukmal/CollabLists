
/*
 * GET home page.
 */

var Routes = function (app, server) {
	var databaseUrl = 'localdb';
	var collections = ['playlists'];
	var db = require('mongojs').connect(databaseUrl, collections);

	// HTTP GET routing
	app.get('/', function(req, res){
	  res.render('index', { title: 'Express' });
	});

	app.get('/:playlistURL', function(req, res){
		// check if the playlist URL is valid
		if (req.params.playlistURL == "deadbeef")
			// it's valid, so we serve the playlist view page
			res.render('playlistview', {playlist: req.params.playlistURL});
		else
			// it's not valid, so we serve up a 404 not found page
			res.render('notfound', { title: 'Express' });
	});


	// HTTP POST routing
	app.post('/addparty-formdata', function (req, res) {
		
	});

	// Socket.io stuff
	var clientUpdateInterval = 500; // ms
	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {
		socket.on('voting', function (votingInfo) {
			 // votingInfo --> {partyID, song, voteType ['up' or 'down']}
			 updateVote(votingInfo.partyID, votingInfo.song, votingInfo.voteType);
		});

		socket.on('add song', function (addSongInfo) {
			// addSongInfo --> {partyID, song}
			addSong(addSongInfo.partyID, addSongInfo.song);
		});

		socket.on('delete song', function (delSongInfo) {
			// delSongInfo --> {partyID, userID, song}
			deleteSong(song.partyID, song.userID, song.song);
		});

		/**
		 * Function to refresh all of the viewer's GUI
		 */
		socket.on('playlist update request', function (clientInfo) {
			// clientInfo --> String party ID
			socket.emit('playlist update', updatePlaylist(clientInfo))
		});
	});

	// playlist state change functions
	// ===============================


	/**
	 * Function to update votes for an individual song in a playlist
	 * @param  {String} partyID  ID of the party playlist to be updated
	 * @param  {JSON} songData JSON object with the song data
	 * @param  {String} voteType Type of vote. Can be 'up' or 'down'
	 */
	function updateVote(partyID, songData, voteType) {

	};
};

module.exports = Routes;