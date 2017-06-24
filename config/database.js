const path = require('path');
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    username: 'james',
    password: '123456',
    host: 'localhost',
    port: '27017',
    db: 'example',
    secret: crypto
}