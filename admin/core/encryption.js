let debug = require('debug')('admin:encryption');
let cryptoJs = require("crypto-js");
let config = require('../config');

function hash256(clear_text){

    debug(`Hashing clear text: ${clear_text}`);

    let sha256_crypto;
    let hashed_text;
    try {

        sha256_crypto = require('crypto').createHash('sha256');
        sha256_crypto.update(clear_text);
        hashed_text = sha256_crypto.digest('hex');

    } catch (err) {

        debug('Internal Node Crypto is not supported - using crypto-js library instead');
        hashed_text = cryptoJs.SHA256(clear_text);
    } 

    debug(`Hashed text: ${hashed_text}`);
    return hashed_text;
}  

function aes_encrypt(clear_text){

    var ciphertext = cryptoJs.AES.encrypt(clear_text, config.app_secret);
    return ciphertext.toString();
}

function aes_decrypt(cipher_text){

    var bytes  = cryptoJs.AES.decrypt(cipher_text.toString(), config.app_secret);
    var decryptedData = bytes.toString(cryptoJs.enc.Utf8)

    if(decryptedData) return decryptedData;
    else throw 'Invalid crypto data - could not decrypt';
}

module.exports = { hash256, aes_encrypt, aes_decrypt }

