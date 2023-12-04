# CPD Monitor

## Generate Key Pair
```bash
mkdir -p keys
cd keys
openssl ecparam -name secp384r1 -genkey -noout -out privateKey.pem
openssl ec -in privateKey.pem -pubout -out publicKey.pem
```