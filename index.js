const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // 处理跨域
const path = require('path');
const config = require('./config/database');
const authentication = require('./routes/authentication')(router);

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

/**
 * 中间件
 */
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication); // app.use([path,] callback [, callback...])

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'))
})

app.listen(8080, () => {
    console.log('app start');
})