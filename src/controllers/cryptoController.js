const { Fernet } = require('fernet-nodejs');
//const EncryptionHelper = require('../EncryptionHelper.js');

const key = process.env.FERNET_SECRET;

// Function to encrption
const encryption = (req, res) => {
    const data = req.body;  
    const message = JSON.stringify(data);
    const ciphertext = Fernet.encrypt(message, key);
     res.send({ciphertext});
};

// Function to decryption data
const decryption = (req, res) => {
    const {ciphertext} = req.body;
    const jsonString = Fernet.decrypt(ciphertext, key);
    const real_text = JSON.parse(jsonString);
    res.send(real_text);
};

module.exports = {
    encryption,
    decryption,
};