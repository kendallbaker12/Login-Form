const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("../persist/schema")

passport.use(
    new LocalStrategy(async (username, password, done) => {
        let user;
        try {
            user = await User.findOne({ username: username, password: password });
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err)
        }
    })
);

const setUpAuth = function (app) {
    app.use(passport.initialize());
    app.use(passport.authenticate("session"));

    passport.serializeUser(function (user, cb) {
        cb(null, { id: user._id, username: user.username });
    });
    passport.deserializeUser(function (user, cb) {
        return cb(null, user);
    });
    app.post("/session", passport.authenticate("local"), (req, res) => {
        res.status(201).json({ message: "succesfully created session" });
    });
    app.get("/session", (req, res) => {
        if (!req.user) {
            res.status(401).json({ message: "unauthenticated go log in" });
            return;
        }
        res.status(200).json({ message: "authenticated" });
    });
};
module.exports = setUpAuth;