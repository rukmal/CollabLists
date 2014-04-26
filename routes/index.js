
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.servePlaylistURL = function(req, res){
	// check if the playlist URL is valid
	if (req.params.playlistURL == "deadbeef")
		res.send("Your playlist URL is : " + req.params.playlistURL);
	else
		// it's not valid, so we serve up a 404 not found page
		res.render('notfound', { title: 'Express' });
};