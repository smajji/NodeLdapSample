var express = require('express'),
	passport     = require('passport'),
	bodyParser   = require('body-parser'),
	LdapStrategy = require('passport-ldapauth');

var port = 8999;

var app = express();

function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
		res.render('unauthorised', { status: 403 });
		return;
	}

	next();
}



app.configure(function () {

	app.use(express.cookieParser());
	app.use(express.session({ secret: 'example' }));
	app.use(express.bodyParser());
	app.use(require('flash')());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	
	app.use(checkAuth);
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('view options', { layout: false });

});

require('./lib/routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
