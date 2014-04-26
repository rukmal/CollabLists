/*
 * @description Main routing file for application
 */

var passport = require('passport');

var Routes = function (app, server) {
	var pageTitle = 'MyApp : '
		Party = require('./models/party'),

	// HTTP GET routing
	// ================


	app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));

	app.get("/auth/facebook/callback",
	    passport.authenticate("facebook",{ failureRedirect: '/login'}),
	    function(req,res){
	        res.render("loggedin", {user : req.user});
	    }
	);

	// landing page routing
	app.get('/', function(req, res){
	  res.render('index', { title: 'Express' });
	});

	// add party routing
	app.get('/addparty', function (req, res) {
		res.render('addparty', {
			title: pageTitle + 'Add a new party'
		})
	});

	// dynamic party url routing
	app.get('/:name/:slug', function(req, res){
		Party.find({
			'owner_last': req.params.name,
			'slug': req.params.slug 
		}, function (err, party) {
			if (err) {
				res.render('error');
			}
			res.render('party-info', party); // create a page to render party information
		});
	});


	// HTTP POST routing
	// =================

	// routing for the add new post request
	app.post('/addparty-formdata', function (req, res) {
		var newParty = new Party({
			name: req.body.partyName,
			created_on: new Date(),
			firstName: req.body.first,
			lastName: req.body.last,
			owner_id: req.body.owner_id,
			owner_first: req.body.owner_first.toLowerCase(),
			owner_last: req.body.owner_last.replace(' ', '+').toLowerCase(), // replace spaces with plus signs
			location: req.body.location,
			slug: req.body.slug.toLowerCase()
		});
		// inserting the new party object into the database
		newParty.save(function (err) {
			if (err) {
				// redirect to error page
				console.log(err);
			} else {
				// redirect to party page
				res.redirect('/' + newParty.owner_last + '/' + newParty.slug);
			}
		});
	});

	// Socket.io stuff
	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {
		socket.on('voting', function (votingInfo) {
			 // votingInfo --> {partyID, song, voteType ['up' or 'down'], owner_last_name}
			 updateVote(votingInfo.owner_last_name, votingInfo.slug, votingInfo.song, votingInfo.voteType);
		});

		socket.on('add song', function (addSongInfo) {
			// addSongInfo --> {partyID, song, owner_last_name}
			addSong(addSongInfo.owner_last_name, addSongInfo.slug, addSongInfo.song);
		});

		socket.on('delete song', function (delSongInfo) {
			// delSongInfo --> {partyID, owner_last_name, song}
			deleteSong(song.owner_last_name, song.slug, song.song);
		});

		/**
		 * Function to refresh all of the viewer's GUI
		 */
		socket.on('playlist update request', function (partyInfo) {
			// partyInfo --> {owner_last_name, slug}
			Party.find({
				'owner_last': partyInfo.owner_last_name,
				'slug': partyInfo.slug
			}, function (err, party) {
				socket.emit('playlist update', party);
			});
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
	function updateVote(name, slug, songData, voteType) {
		Party.findOneAndModify({
			'owner_last': name,
			'slug': slug
		}, function (err, party) {
			if (err) {
				res.render('error');
			}
			var songIndex = party.playlist.indexOf(songData);
			var song = party.playlist[songIndex];
			if (voteType === 'up') {
				song.upVotes += 1;
			} else if (voteType === 'down') {
				song.downVotes += 1;
			}
		});
	};

	/**
	 * Function to add a song to the playlist of a specific party
	 * @param {String} name Last name of the owner of the party
	 * @param {String} slug Unique slug identifier of the party
	 * @param {Object} song Song object with all required song metadata
	 */
	function addSong(name, slug, song) {
		Party.findOneAndModify({
			'owner_last': name,
			'slug': slug
		}, function (err, party) {
			if (err) {
				res.render('error');
			}
			party.playlist.push(song);
		});
	};

	/**
	 * Function to delete a song from the playlist of a specific party
	 * @param  {String} name Last name of the owner of the party 
	 * @param  {String} slug Unique slug identified of the party
	 * @param  {Object} song Song object with all of the required metadata
	 */
	function deleteSong(name, slug, song) {
		Party.findOneAndModify({
			'owner_last': name,
			'slug': slug
		}, function (err, party) {
			if (err) {
				res.render('error');
			}
			var playlist = party.playlist;
			var removedSongIndex = playlist.indexOf(song);
			playlist.splice(removedSongIndex, 1);
		});
	};
};

module.exports = Routes;