const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer(handler);
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
  console.log(
    'MQTT client \x1b[32m' +
      (client ? client.id : client) +
      '\x1b[0m subscribed to topics: ' +
      subscriptions.map((s) => s.topic).join('\n'),
    'from broker',
    aedes.id
  );
});

io.sockets.on('connection', function (socket) {
  // WebSocket Connection
  var lightvalue = 0; //static variable for current status
  socket.on('light', function (data) {
    //get light switch status from client
    lightvalue = data;
    if (lightvalue) {
      console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
    }
  });
});
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
