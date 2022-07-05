const app = require("./server");
const { connect, onConnect } = require("./persist/connect");
const config = require("./config/config");

onConnect(() => {
    app.listen(8080, () => {
        console.log("serving on port 8080");
    });
});

try {
    connect(
        config.mongo_user,
        config.mongo_pass,
        config.mongo_host,
        config.mongo_port,
        config.mongo_db,
    )
} catch (err) {
    console.log("error with config", err);
    throw "error with config"
}

