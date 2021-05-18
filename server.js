
//////////////////////////////////////////////////////////////////////////////////////////////
// server.js  - EXPRESS SERVER //////////////////////////////////////////////////////////////
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("static"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});


//////////////////////////////////////////////////////////////////////////////////////////////

//////////
const http = require('http');
// we need to create our own http server so express and ws can share it.
const server = http.createServer(app);

const aedes = require('aedes')();
var websocket = require('websocket-stream')
var wss = websocket.createServer({server: server}, aedes.handle);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your express app is listening on port " + listener.address().port);
});
// listen for requests :)
const listenerr = server.listen(8888, () => {
  console.log("server is listening on port " + listener.address().port);
});


//fired when a client subscribes
aedes.on('subscribe', function (subscriptions, client) {
  console.log(
    'MQTT client \x1b[32m' +
      (client ? client.id : client) +
      '\x1b[0m subscribed to topics: ' +
      subscriptions.map((s) => s.topic).join('\n'),
    'from broker',
    aedes.id
  );
});

//fired when a client unsubscribes
aedes.on('unsubscribe', function (subscriptions, client) {
  console.log(
    'MQTT client \x1b[32m' +
      (client ? client.id : client) +
      '\x1b[0m unsubscribed to topics: ' +
      subscriptions.join('\n'),
    'from broker',
    aedes.id
  );
});

// fired when a client connects
aedes.on('client', function (client) {
  console.log(
    'Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m',
    'to broker',
    aedes.id
  );
});

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  console.log(
    'Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m',
    'to broker',
    aedes.id
  );
});

// fired when a message is published
aedes.on('publish', async function (packet, client) {
  console.log(
    'Client \x1b[31m' +
      (client ? client.id : 'BROKER_' + aedes.id) +
      '\x1b[0m has published',
    packet.payload.toString(),
    'on',
    packet.topic,
    'to broker',
    aedes.id
  );
});
