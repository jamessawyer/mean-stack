const express = require('express');
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const config = require('./config/database');

const db_url = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}`;

mongoose.Promise = global.Promise;
mongoose.connect(db_url, (err) => {
    if (err) {
        console.log('could not connect to database: ', err);
    } else {
        console.log(config.secret);
        console.log('Connected to database: ', config.db);
    }
});

app.use(express.static(__dirname + '/client/dist/'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'))
})

app.listen(8080, () => {
    console.log('app start');
})