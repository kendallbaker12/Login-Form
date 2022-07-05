const mongoose = require('mongoose');
const db = mongoose.connection;

async function connect(user, pass, host, port, db_name) {
    let connectionString = `mongodb+srv://codeschool:codeschool@cluster0.o7b5acp.mongodb.net/?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("error connecting to mongoose", err);
        throw "mongo coulnt connect"
    }
}

function onConnect(callback) {
    db.once("open", () => {
        console.log("mongo connection open");
        callback();
    });
}

module.exports = {
    connect,
    onConnect,
}
