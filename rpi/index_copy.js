//////////////////////////////////////////////////////////////////////////////////////////////
// server.js  - EXPRESS SERVER //////////////////////////////////////////////////////////////
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log(
    'Your express app is listening on port ' + listener.address().port
  );
});
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
/////// WEBSOCKET SERVER //////////////////////////////////////////////////////////////////////
// https://github.com/ParametricCamp/TutorialFiles/blob/master/Misc/WebSockets/nodejs-server-echo/server.js
const WebSocket = require('websocket-stream');

const PORT = 8888;

const wsServer = new WebSocket.Server({
  port: PORT,
});

wsServer.on('connection', function (socket) {
  // Some feedback on the console
  console.log('A client just connected');

  // Attach some behavior to the incoming socket
  socket.on('message', function (msg) {
    console.log('Received message from client: ' + msg);
    // socket.send("Take this back: " + msg);

    // Broadcast that message to all connected clients
    wsServer.clients.forEach(function (client) {
      client.send('Someone said: ' + msg);
    });
  });
});
console.log(new Date() + ' Websocket Server is listening on port ' + PORT);
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
////////////AEDES//////////////////////////////////////////////////////////////////////////////

const port = 1883;
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
server.listen(port, function () {
  console.log('Aedes listening on port:', port);
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

//////////////////////////////////////////////////////////////////////////////////////////////
