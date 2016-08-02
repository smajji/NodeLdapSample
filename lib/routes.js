var util = require('util');


module.exports = function (app) {

	app.get('/', function (req, res, next) {
		res.render('index');
	}); 

	app.get('/welcome', function (req, res, next) {
		res.render('welcome');
	});

	app.get('/secure', function (req, res, next) {
		res.render('secure');
	});

	app.get('/login', function (req, res, next) {
		res.render('login', { flash: req.flash() } );
	});
	var passport     = require('passport'),
	LdapStrategy = require('passport-ldapauth');
	var OPTS = {
		server : {
			url : 'ldap_url',
			bindDn : 'bind_username',
			bindCredentials : 'bind_password',
			searchBase : 'base_dn',
			searchFilter : '(cn={{username}})'
		},
		usernameField: "username",
		passwordField: "password"
	};
	passport.use(new LdapStrategy(OPTS));
	passport.initialize();
	passport.session();
//	app.post('/login', passport.authenticate('ldapauth', {
//		successRedirect : '/secure',
//		failureRedirect : '/login'
//	}));
	app.post('/login', function(req, res, next) {
		passport.authenticate('ldapauth', function(err, user, info) {
			var error = err || info;
			console.log('Node listening on port %s', error);
			if (error)
				return res.json(401, error);
			if (!user)
				return res.json(404, {
					message : 'Something went wrong, please try again.'
				});
			req.session.authenticated = true;
			res.redirect('/secure');

		})(req, res, next)
	});
	

// app.post('/login', function (req, res, next) {
//		
//		var test = passport.authenticate('ldapauth', {session: false});
//		// you might like to do a database look-up or something more scalable here
//		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
//			req.session.authenticated = true;
//			res.redirect('/secure');
//		} else {
//			req.flash('error', 'Username and password are incorrect');
//			res.redirect('/login');
//		}
//
//	});

	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});

};
