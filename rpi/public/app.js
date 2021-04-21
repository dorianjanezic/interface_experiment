//global variables
let number = 100;

//establishing mqtt connection over websocket port
const client = mqtt.connect('ws://localhost:8888', {
      clientId: 'javascript'
    });

    client.on('connect', function () {
      console.log('connected!');
      client.subscribe('/distance');
    });

//tone.js sampler    
const player = new Tone.Player("sounds/diva.wav").toDestination();

//attach a click listener to a play button
document.getElementById("button").addEventListener("click", async () => {
  console.log("audio is ready");
  player.start();
});

//map range
function mapNumber (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//on received message from mqtt
    client.on('message', function (topic, message) {
      console.log(topic + ': ' + message.toString());
      document.getElementById("p1").innerHTML = message.toString();
    });

    document.getElementById('button').addEventListener('click', function () {
      client.publish('hello', 'world');
    });