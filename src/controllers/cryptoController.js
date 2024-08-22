const { Fernet } = require('fernet-nodejs');
const key = process.env.FERNET_SECRET;

// Function to encrption
const encryption = (req, res) => {
    const data = req.body;     
    //const message = "This is a top secret message!";
    const message = JSON.stringify(data);
    const fernet = new Fernet(key);   
    //const f = new Fernet(key);
    
    const ciphertext = fernet.encrypt(message);
    console.log(ciphertext);

    res.send({ciphertext});
};

// Function to decryption data
const decryption = (req, res) => {
    const {ciphertext} = req.body;

    //const message = "gAAAAABmvHDB5zKHvfbuIlvjI5JtdQZZtrXdhAAdeuh9R3y79P_Thtjhd5CWs2VRMkk7ORU7de5zebG3ec7SJUQZA9AnEM2glbve0tKcKhuTAv711xIqg8Gxf2zs3_c4iMu7Kv6GCin8";

    const jsonString = Fernet.decrypt(ciphertext, key);
    const real_text = JSON.parse(jsonString);
    console.log(real_text);
    res.send(real_text);
};

module.exports = {
    encryption,
    decryption,
};