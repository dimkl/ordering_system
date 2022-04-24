# Create RSA keys

1. create private key

  ```bash
  openssl genrsa -out private.key 2048  
  ```

2. create public key (PEM) from private

  ```bash
  openssl rsa -in private.key -out public.pem -pubout -outform PEM
  ```
