const express = require('express');
const { User } = require('./persist/schema');
const app = express();
const setUpAuth = require("./auth/auth");
const setUpSessionStore = require("./auth/session");
app.use(express.static(`${__dirname}/public/`));

app.use(express.json());
setUpSessionStore(app);
setUpAuth(app);


app.post("/users", async (req, res) => {
    try {
        let user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({
            message: `post failed to create user`,
            error: err,
        });
    }
});

module.exports = app;
