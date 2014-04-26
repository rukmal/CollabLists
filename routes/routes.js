
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.servePlaylistURL = function(req, res){
	// check if the playlist URL is valid
	if (req.params.playlistURL == "deadbeef")
		// it's valid, so we serve the playlist view page
		res.render('playlistview', {playlist: req.params.playlistURL});
	else
		// it's not valid, so we serve up a 404 not found page
		res.render('notfound', { title: 'Express' });
};