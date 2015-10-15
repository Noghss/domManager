// server/config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport)
{
	// =========================================================================
    // passport session setup ==================================================
    // used to serialize the user for the session
    passport.serializeUser(function(user, done)
    {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done)
    {
        User.findById(id, function(err, user)
        {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    passport.use('local-signup', new LocalStrategy(
    {
    	usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done)
    {
		// find a user whose email is the same as the forms email
        User.findOne({ 'local.email' :  email }, function(err, user)
        {
            // if there are any errors, return the error
            if (err)
            {
                return done(err);
            }
            
            // check to see if theres already a user with that email
            if (user)
            {
                return done(null, false, req.flash('signupMessage', 'email is already taken.'));
            }
            else
            {
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email    	= email;
                newUser.local.password 	= newUser.generateHash(password); // use the generateHash function in our user model

				// save the user
                newUser.save(function(err)
                {
                    if (err)
                    {
                    	throw err;
                    }
                    
                    return done(null, newUser);
                });
            }
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    passport.use('local-login', new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done)
    {
        // find a user whose email is the same as the forms email
        User.findOne({ 'local.email' :  email }, function(err, user)
        {
            // if there are any errors, return the error before anything else
            if (err)
            {
                return done(err);
            }

            // if no user is found, return the message
            if (!user)
            {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
            {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            return done(null, user);
        });
    }));
};
