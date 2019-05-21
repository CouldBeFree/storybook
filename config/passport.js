const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL:'/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            //console.log(accessToken);
            //console.log(profile);
            const image = profile.photos[0].value;

            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }
        })
    )
};
