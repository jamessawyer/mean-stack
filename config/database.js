const path = require('path');

// 提供加密功能(OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    username: 'james',
    password: '123456',
    host: 'localhost',
    port: '27017',
    db: 'example',
    secret: crypto
}