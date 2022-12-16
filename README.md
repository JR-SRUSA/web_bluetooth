Web Bluetooth and ESP32 BLE
===========================

2022-12-12

John Robinson, SRUSA

This sample code directory shows how to use Web Bluetooth with an external ESP32 microcontroller. It should serve as a
template for further development. In order to use WebBluetooth, you need to serve the website via HTTPS, so there is a
section below which talks about generating a self-signed certificate.

Browser Requirements
--------------------
Web bluetooth is not officially supported yet. It should work in Chrome (tested) if you enable
'Experimental Web Platform features', accessed by typing about://flags into the Chrome browser URL bar. There is also
support in MS Edge (untested), but no in Firefox as of this tutorials writing. Check here for further information about
browser support. https://caniuse.com/web-bluetooth

Files
-----

1.  BLE_notify.ino -> Arduino file which is part of the 'Examples > ESP32 BLE Arduino' example set. Included here as a
working example in case the examples are changed in the future.
2.  https.py -> Python file for hosting an https server. You must generate the server.pem and key.pem files first, as
described in the 'Generate an HTTPS server with self-signed certificate' section below.
3.  main.html and main.js -> Files which generate the Web Bluetooth website. html file specifies the layout, javascript
(js) file contains the code necessary for web bluetooth.
4.  bluetooth_ids.json -> Contains service and property UUIDs in JSON format. 


Generate an HTTPS server with self-signed certificate
-----------------------------------------------------
CA:

    $ openssl req -x509 -days 365 -newkey rsa:4096 -keyout ca_private_key.pem -out ca_cert.pem -nodes
    Generating a RSA private key
    .........++++
    .................................++++
    writing new private key to 'ca_private_key.pem'
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:NY
    Locality Name (eg, city) []:BUF
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:SRUSA
    Organizational Unit Name (eg, section) []:RnD
    Common Name (e.g. server FQDN or YOUR name) []:localhost
    Email Address []:jr@srusa.com
    $ ls
    ca_cert.pem  ca_private_key.pem
    $
    $ openssl req -new -newkey rsa:4096 -keyout my_private_key.pem -out my_cert_req.pem -addext "subjectAltName=IP:127.0.0.1,DNS:localhost" -nodes
    Generating a RSA private key
    ............................................................++++
    .....................................................................................................................++++
    writing new private key to 'my_private_key.pem'
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:NY
    Locality Name (eg, city) []:BUF
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:SRUSA
    Organizational Unit Name (eg, section) []:RnD
    Common Name (e.g. server FQDN or YOUR name) []:localhost
    Email Address []:jr@srusa.com
    
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:
    $ ls
    ca_cert.pem  ca_private_key.pem  my_cert_req.pem  my_private_key.pem
    $ # Create/ Copy the domains.ext file
    $ ls
    ca_cert.pem  ca_private_key.pem  domains.ext  my_cert_req.pem  my_private_key.pem
    $ openssl x509 -req -in my_cert_req.pem -days 365 -CA ca_cert.pem -CAkey ca_private_key.pem -CAcreateserial -extfile domains.ext -out my_signed_cert2.pem
    Signature ok
    subject=C = US, ST = NY, L = BUF, O = SRUSA, OU = RnD, CN = localhost, emailAddress = jr@srusa.com
    Getting CA Private Key


Install certificate authority on Windows:

    1. Windows + R -> mmc [enter]
    2. File > Add/Remove Snap-in
    3. Certificates > Add
    4. Compter Account > Next
    5. Local Computer > Finish > OK
    6. Certificates (local computer) 2x
    7. Trusted Root Certification Authorities, Right Click Certificates (middle under Object Type) > All Tasks > Import
    8. Next > Browse (select 'All Files' in file type). Select srusaFEA_CA.pem > Open > Next
    9. Place all certificates in the following store 'Trusted Root Certification Authorities store' > Next > Finish

OR Install certificate on browser:
    
    Firefox: Options -> Privacy and Security -> View Certificates -> Import ca_cert.pem (check trust CA)
    Chrome: ???


Run the Python file:

    $ python https_server.py

Connect in the browser:
    https://localhost:4443/main.html
    -> You will need to 'Accept the Risk' if your certificate is self generated and not set as trusted

To Enable BT in Chrome:
    about://flags -> enable #experimental-web-platform-features


Updates
-------
2022-12-12: 
* Trying to generate a local CA to sign the certificates, so you don't have to click 'Proceed Anyway, Unsafe'
