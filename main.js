var bt_server,
    bt_service,
    bt_characteristics,
    bt_button = document.getElementById('BTbutton'),
    p_data_string = document.getElementById('p_data_string'),
    p_data_array = document.getElementById('p_data_array'),
    div_data_buttons = document.getElementById('div_data_read_button'),
    bt_request_options = {
      filters: [{namePrefix: 'ESP32', }], // ble notify
      optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'], // ble notify
    };


bt_button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
  navigator.bluetooth.requestDevice(
    bt_request_options
  ).then(device => {
    console.log('Device: ');
    console.log(device);
    return device.gatt.connect();
  }).then(server => {
    // Note that we could also get all services that match a specific UUID by
    // passing it to getPrimaryServices().
    console.log('Getting Services...');
    return server.getPrimaryServices();
  }).then(services => {
    console.log('Getting Characteristics...');
    let queue = Promise.resolve();
    services.forEach(service => {
      bt_service = service;    // Assigning to bt_service so we have access outside the promise
      queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
      console.log('> Service: ' + service.uuid);
      console.log('> Characteristics: ');
      bt_characteristics = characteristics;   // Assigning to bt_characteristics so we have access outside the promise
      characteristics.forEach(characteristic => {
        console.log('>> Characteristic: ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic));
        if (characteristic.properties.read == true) {
          newDataButton(characteristic.uuid)

          characteristic.readValue().then(val => {
            console.log(`>>> VALUE: ${characteristic.uuid}:: ${val.byteLength} bytes::  `);
            // console.log(new Uint8Array(val.buffer))

            // Output Data to the website for consumption
            p_data_string.innerHTML = new TextDecoder().decode(val.buffer);
            p_data_array.innerHTML = '[' + new Uint8Array(val.buffer) + ']';
          });
        }
      });
      }));
    });
    return queue;
  })
  .catch(error => {
    console.log('Argh! ' + error);
    console.error(error);
  });
});

function getBtDataFromServer(event) {
  console.log(event);
  console.log(event.target.id)
  bt_service.getCharacteristics().then(characteristics => {
    characteristics.forEach(characteristic => {
      if (characteristic.properties.read == true) {
        characteristic.readValue().then(val => {
          console.log(`${characteristic.uuid} reads:: ` + '[' + new Uint8Array(val.buffer) + ']')
        });
      }
    });
  });
}

function newDataButton(id) {
  var btn = document.createElement('button');
  btn.id = id;
  btn.innerHTML = id;
  btn.addEventListener('click', getBtDataFromServer)

  div_data_buttons.appendChild(btn);
}

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}