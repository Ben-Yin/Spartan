/**
 * Created by BenYin on 3/28/17.
 */
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../public/uploads' });

module.exports = function (app, model) {
    'use strict';

    var auth = authorized;
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.post  ('/api/login',passport.authenticate('local'),login);
    app.post  ('/api/register',register);
    app.post  ('/api/logout',logout);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.post  ('/api/admin/user',auth, createUser);
    app.get   ('/api/loggedin',loggedin);
    app.get   ('/api/user/:userId', auth,findUserById);
    app.get   ('/api/admin/find',auth, findAllUsers);
    app.put   ('/api/user/:userId',auth, updateUser);
    app.put('/api/user/pass/:userId', auth, updatePass);
    app.delete('/api/user/:userId',auth, deleteUser);
    app.get('/api/admin/find/',findAllUsers);
    app.get('/api/user/:userId/following', auth,findUserFollowing);
    app.get('/api/user/:userId/follower',auth, findUserFollower);
    app.get('/api/user/:userId/followerNum',auth, CountUserFollower);
    app.get("/api/find/users/by/:username",auth,findUsersByUsername);

    function findUsersByUsername(req,res) {
        var username=req.params.username;
        // console.log(username)
        model.UserModel.findUsersByUsername(username)
            .then(
                function (users) {
                    res.json(users);
                },function (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
            )
    }
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    function findAllUsers(req,res) {
        var type=req.query.type;
        model.UserModel.findAllUsers()
            .then(
                function (users) {
                    res.json(users)
                },function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            )
    }
    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    };



    function localStrategy(username,password,done) {
        model.UserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }




    function deserializeUser(user, done) {
        // console.log("deserializeUser",user)
        model
            .UserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function serializeUser(user, done) {
        // console.log("serializeUser",user)
        done(null, user);
    }


    function login(req, res) {

        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function createUser(req,res) {
        var newUser=req.body;
        newUser.password=bcrypt.hashSync(newUser.password);
        model.UserModel.createUser(newUser)
            .then(
                function (status) {
                    res.sendStatus(200);
                },function (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
            )
    }
    function register(req, res) {
        var newUser=req.body;
        model
            .UserModel
            .findUserByUsername(newUser.username)
            .then(
                function (user) {
                    if(user){
                        res.json(null)
                    }else{
                        newUser.password=bcrypt.hashSync(newUser.password);
                        model.UserModel.createUser(newUser)
                            .then(function (user) {
                                if(user){
                                    // console.log("register success",user)
                                    req.login(user,function (err) {
                                        if (err){
                                            re.status(400).send(err);
                                        }else{
                                            res.json(user);
                                        }
                                    });
                                }
                            });
                    }
                },function (err) {
                    res.status(400).send(err)
                }
            );
    }

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/profile',
            failureRedirect: '/#/login'
        }));

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    function facebookStrategy(token, refreshToken, profile, done) {
        model.UserModel
            .findUserByFacebookId(profile.id)
                .then(
                    function(user) {
                        if(user) {
                            return done(null, user);
                        } else {
                            var newFacebookUser = {
                                username:  profile.displayName,
                                firstname: profile.name.givenName,
                                lastname:  profile.name.familyName,
                                facebook: {
                                    id:    profile.id,
                                    token: token
                                },
                                usertype:"Membership",
                                service:true
                            };
                            return model.UserModel.createUser(newFacebookUser);
                        }
                    },
                    function(err) {
                        if (err) { return done(err); }
                    }
                )
                .then(
                    function(user){
                        return done(null, user);
                    },
                    function(err){
                        if (err) { return done(err); }
                    }
                );}




    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/profile',
            failureRedirect: '/#/login'
        }));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    function googleStrategy(token, refreshToken, profile, done) {
        model.UserModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            },
                            usertype:"Membership",
                            service:true
                        };
                        return model.UserModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    var githubConfig = {
        clientID     : process.env.GITHUB_CLIENT_ID,
        clientSecret : process.env.GITHUB_CLIENT_SECRET,
        callbackURL  : process.env.GITHUB_CALLBACK_URL
    };

    app.get('/auth/github', passport.authenticate('github', { scope : ['profile', 'email'] }));
    app.get('/auth/github/callback',
        passport.authenticate('github', {
            successRedirect: '/#/profile',
            failureRedirect: '/#/login'
        }));
    passport.use(new GitHubStrategy(githubConfig, githubStrategy));
    function githubStrategy(token, refreshToken, profile, done) {
        model.UserModel
            .findUserByGitHubId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newGitHubUser = {
                            username:  profile.username,
                            firstName: profile.displayName[0],
                            lastName:  profile.displayName[1],
                            email:     profile.email,
                            avatar:     profile.avatar_url,
                            github: {
                                id:    profile.id,
                                token: token
                            },
                            usertype:"Membership",
                            service:true
                        };
                        return model.UserModel.createUser(newGitHubUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model
            .UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.sendStatus(500);
                }
            );
    }
    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model
            .UserModel
            .updateUser(userId, newUser)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                }
            );
    }
    function updatePass(req, res) {
        var userId = req.params.userId;
        var password = req.body;
        var originPass=password.originPass;
        var newpass=password.newpass;
        var encryptPass=password.encryptPass;
        if ( bcrypt.compareSync(originPass,encryptPass))
        {
            model
                .UserModel
                .updatePassword(userId,bcrypt.hashSync(newpass))
                .then(
                    function (user) {
                        res.json(user);
                    },
                    function (err) {
                        res.json(null);
                    }
                );}else {
            res.json(null);
        }


    }
    function uploadImage(req, res) {
        var userId = req.body.userId;
        if(req.file !=undefined){
            var path = "/uploads/" + req.file.filename;
            model.UserModel.updateAvatar(userId,path)
                .then(function (user) {
                    res.redirect("/#/profile");
                },function (err) {
                    res.redirect("/#/profile");
                })}
        else{
            res.redirect("/#/profile");
        }
    }
    
    function deleteUser(req,res) {
        var userId=req.params.userId;
        model.UserModel.deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200)
                },function (err) {
                    res.sendStatus(500);
                }
            )
        
        
    }

    function findUserFollowing(req,res) {
        var userId = req.params.userId;
        model
            .UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    return model
                        .UserModel
                        .findUsersByIds(user.following);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                }
            )
            .catch(
                function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            );
    }

    function findUserFollower(req, res) {
        var userId = req.params.userId;
        model
            .UserModel
            .findFollowerById(userId)
            .then(
                function (users) {
                    res.json(users);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            );
    }

    function CountUserFollower(req, res) {
        var userId = req.params.userId;
        model
            .UserModel
            .countFollowerById(userId)
            .then(
                function (followerNum) {
                    res.json({followerNum: followerNum});
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            );
    }



};