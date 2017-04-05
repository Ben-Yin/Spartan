/**
 * Created by BenYin on 3/28/17.
 */
module.exports = function (app, model) {
    var passport= require('passport');
    var auth = authorized;
    app.post  ('/api/login',passport.authenticate('local'),login);
    app.post  ('/api/logout',logout);
    app.post  ('/api/register',register);
    app.post  ('/api/user',auth, createUser);
    app.get   ('/api/loggedin',loggedin);
    app.get   ('/api/user',auth, findAllUsers);
    app.put   ('/api/user/:id',auth, updateUser);
    app.delete('/api/user/:id',auth, deleteUser);
    var md5 = require('md5');



    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };


    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

    
    function localStrategy(username,password,done) {
        model.UserModel
            .findUserByCredential(username,password)
            .then(
                function (user) {
                    if(!user){
                        return done(null,false);
                    }
                        return done(null,user);

                },
                function (err) {
                    if (err){
                        return done(err);
                    }
                }
            );
    }

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    function deserializeUser(user, done) {
        model
            .AdminModel
            .findAdminById(user._id)
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
        done(null, user);
    }


    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var user=req.body;
        model
            .UserModel
            .createUser(user)
            .then(
                function (user) {
                    if(user){
                        req.login(user,function (err) {
                            if (err){
                                re.status(400).send(err);
                            }else{
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function createUser(req, res) {

        var user = req.body;
        console.log(user)
        user.password = md5(user.password);
        model
            .UserModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                }
            );
    }


    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findUserByCredentials(req, res);
        } else {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .UserModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.json(user);
                    } else {
                        res.sendStatus(500);
                    }
                }
            );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = md5(req.query.password);
        model
            .UserModel
            .findUserByCredential(username, password)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
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
                    console.log(err);
                    res.sendStatus(500).send(err);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        console.log(newUser);
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



    function deleteUser(req, res) {
        var userId = req.params.userId;
        model
            .UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    return model
                        .Promise
                        .join(
                            model
                                .WebsiteModel
                                .deleteWebsites(user.websites),
                            user.remove(),
                            function () {
                            }
                        );
                }
            )
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })
    }
    function findAllUsers() {
        
    }
};