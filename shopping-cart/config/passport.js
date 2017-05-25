var passport = require("passport")
var User = require("../model/user")
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
}); 

passport.deserializeUser(function (id, done) {
    User.findById(id,function(err, user){
        done(err, user)
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqtoCallBack: true
}, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email is already in use.' })
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encrpytPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return (err);
            }
            return done(null, newUser);
        });
    });
}));