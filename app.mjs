import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
//import bodyParser from 'body-parser';
import { Fernet } from 'fernet-nodejs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.disable('x-powered-by');

const key = process.env.FERNET_SECRET;

app.get("/", function(req, res) {
    // Add any desired functionality for the homepage
    res.send("NBR TAX Middleware Homepage");
});

app.post('/api/encrypt', (req, res) => {
    const data = req.body; 
    //const message = "This is a top secret message!";
    const message = JSON.stringify(data);
    const fernet = new Fernet(key);   
    //const f = new Fernet(key);
    
    const encryptedMessage = fernet.encrypt(message);
    console.log(encryptedMessage);

    res.send({ encryptedMessage });
});

app.post('/api/decrypt', (req, res) => {
    const {ciphertext} = req.body;

    //const message = "gAAAAABmvHDB5zKHvfbuIlvjI5JtdQZZtrXdhAAdeuh9R3y79P_Thtjhd5CWs2VRMkk7ORU7de5zebG3ec7SJUQZA9AnEM2glbve0tKcKhuTAv711xIqg8Gxf2zs3_c4iMu7Kv6GCin8";

    const jsonString = Fernet.decrypt(ciphertext, key);
    const real_text = JSON.parse(jsonString);
    console.log(real_text);
    res.send(real_text);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});