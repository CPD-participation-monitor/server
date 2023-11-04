const crypto = require('crypto');
const fs = require('fs');

const private_key = fs.readFileSync('../keys/signingKey.pem', 'utf-8');

const createSignature = (data) => {
    // Signing
    const signer = crypto.createSign('RSA-SHA256');
    signer.write(data);
    signer.end();

    // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
    return signer.sign(private_key, 'base64');
}

module.exports = { createSignature };