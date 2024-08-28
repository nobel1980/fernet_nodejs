const crypto = require('crypto');

class EncryptionHelper {
    static encrypt(data, password) {
        // Generate salt as random bytes
        
        const salt = crypto.randomBytes(16);
        console.log('Json Data:', data ,'Password:',password , 'Salt:', salt.length);
        // Derive key from password using PBKDF2
        const key = crypto.pbkdf2Sync(password, salt, 480000, 32, 'sha256');
        //console.log('key', key)
        // Initialize AES-GCM cipher
        const iv = crypto.randomBytes(12);
        console.log('IV Length:', iv.length, 'key Length:', key.length)
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        console.log('Cipher length:', cipher.length);
        // Encrypt plaintext
        let ciphertext = cipher.update(data, 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        ;
        // Concatenate salt, IV, and ciphertext
        const combined = Buffer.concat([salt, iv, Buffer.from(ciphertext, 'hex')]);

        // Log the length of the ciphertext
        console.log('Length of ciphertext:', combined.length);

        // Encode combined bytes to Base64
        return combined.toString('base64');
    }

    static decrypt(ciphertextBase64, password) {
        // Decode ciphertext from Base64
        const combined = Buffer.from(ciphertextBase64, 'base64');

        // Extract salt, IV, and ciphertext
        const salt = Buffer.alloc(16);
        combined.copy(salt, 0, 0, 16);
        
        const iv = Buffer.alloc(12);
        combined.copy(iv, 0, 16, 28);
        
        const ciphertext = Buffer.alloc(combined.length - 28);
        combined.copy(ciphertext, 0, 28);

        // Derive key from password using PBKDF2
        const key = crypto.pbkdf2Sync(password, salt, 480000, 32, 'sha256');

        // Initialize AES-GCM decipher
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

        // Decrypt ciphertext
        let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        return plaintext;
    }
}

module.exports = EncryptionHelper;