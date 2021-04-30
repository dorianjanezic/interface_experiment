<!--https://github.com/mqttjs/MQTT.js/#connect-->
<!-- https://github.com/websockets/ws/blob/master/doc/ws.md#event-headers-->
<!--https://github.com/Schmavery/facebook-chat-api/blob/e60686c725ee253ee87da40bed03b233c576ccd9/src/listenMqtt.js#L34-->
mqtt = require('mqtt')
const client = mqtt.connect('wss://192.168.64.104:8888', {
    clientId: 'javascript'
  });

//   wsOptions: {
//     port: 8888,
//     headers: {
//       'user-agent': 'Chrome'
//     }
//   },
// });
console.log('client', client)


client.on('connect', function () {
  console.log('connected!');
  client.subscribe('/zGyro');
});

client.on('message', function (topic, message) {
  console.log(topic + ': ' + message.toString());
  document.getElementById("p1").innerHTML = message.toString();
});
