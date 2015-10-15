// app/routes.js

module.exports = function(app, passport)
{
	// =====================================
	// HOME PAGE (with login links) ========
	app.get('/', function(req, res)
	{
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	app.get('/login', function(req, res)
	{
		res.render('signin.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard', // redirect to dashboard
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	app.get('/signup', function(req, res)
	{
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the dashboard
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// DASHBOARD SECTION =========================
	app.get('/dashboard', isLoggedIn, function(req, res)
	{
		res.render('dashboard.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	app.get('/logout', function(req, res)
	{
		req.logout();
		res.redirect('/');
	});
};

// redirect to login if is not logged in
function isLoggedIn(req, res, next)
{
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
	{
		return next();
	}

	// if they aren't redirect them to the home page
	res.redirect('/');
}