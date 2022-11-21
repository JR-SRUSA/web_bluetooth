Web Bluetooth and ESP32 BLE
===========================

2022-11-20
John Robinson
SRUSA

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


Generate an HTTPS server with self-signed certificate
-----------------------------------------------------

Generate a server.pem file:
    $ openssl req -new -x509 -keyout key.pem -out server.pem -days 365 -nodes
    Generating a RSA private key
    .+++++
    ..........+++++
    writing new private key to 'key.pem'
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
    Locality Name (eg, city) []:Buffalo
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:SRUSA
    Organizational Unit Name (eg, section) []:Design
    Common Name (e.g. server FQDN or YOUR name) []:John
    Email Address []:j_robinson@sumitomorubber-usa.com

Run the Python file:
    $ python https_server.py

Connect in the browser:
    https://localhost:4443/main.html
    -> You will need to 'Accept the Risk' if your certificate is self generated and not set as trusted

To Enable BT in Chrome:
    about://flags -> enable #experimental-web-platform-features
