const session = require("express-session");

const setUpSessionStore = function (app) {
    app.use(session({
        secret: "keyboardcat",
        resave: false,
        saveUninitialized: false,
    }));
}
module.exports = setUpSessionStore;