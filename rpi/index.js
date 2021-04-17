const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer(handler);
var nedb = require('nedb');
var db = new nedb('mqtt.db');
var io = require('socket.io')(httpServer); //require socket.io module and pass the http object (server)
var fs = require('fs'); //require filesystem module
const ws = require('websocket-stream');
const port = 1883;
const wsPort = 8080;

server.listen(port, function () {
  console.log('Aedes listening on port:', port);
});

ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(wsPort, function () {
  console.log('websocket server listening on port ', wsPort);
});

function handler(req, res) {
  //create server
  fs.readFile(__dirname + '/public/index.html', function (err, data) {
    //read file index.html in public folder
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
      return res.end('404 Not Found');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

aedes.on('subscribe', function (subscriptions, client) {
  db.insert({
    topic: '/',
    action: 'subscribe',
    timestamp: new Date(),
    message: client.id + ' ' + subscriptions,
  });
  console.log(
    'MQTT client \x1b[32m' +
      (client ? client.id : client) +
      '\x1b[0m subscribed to topics: ' +
      subscriptions.map((s) => s.topic).join('\n'),
    'from broker',
    aedes.id
  );
});

// This is an example

// io.sockets.on('connection', function (socket) {
//   // WebSocket Connection
//   var lightvalue = 0; //static variable for current status
//   socket.on('light', function (data) {
//     //get light switch status from client
//     lightvalue = data;
//     if (lightvalue) {
//       console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
//     }
//   });
// });
aedes.on('unsubscribe', function (subscriptions, client) {
  db.insert({
    topic: '/',
    action: 'unsubscribe',
    timestamp: new Date(),
    message: client.id + ' ' + topic,
  });
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
  db.insert({
    topic: '/',
    action: 'connect',
    timestamp: new Date(),
    message: client.id,
  });
  console.log(
    'Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m',
    'to broker',
    aedes.id
  );
});

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  db.insert({
    topic: '/',
    action: 'disconnect',
    timestamp: new Date(),
    message: client.id,
  });
  console.log(
    'Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m',
    'to broker',
    aedes.id
  );
});

// fired when a message is published
aedes.on('publish', async function (packet, client) {
  if (!client) return;

  packet.payloadString = packet.payload.toString();
  packet.payloadLength = packet.payload.length;
  packet.payload = JSON.stringify(packet.payload);
  packet.timestamp = new Date();
  db.insert(packet);

  db.insert({
    topic: '/',
    action: 'publish',
    timestamp: new Date(),
    message: client.id + ' ' + packet.topic,
  });
  //socket.emit('light', packet.payload.toString()); //send button status to client
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
