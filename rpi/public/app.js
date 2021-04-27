//global variables
let number = 100;
var twostrings = 1;

notes = ["C", "D", "E", "F", "G", "A", "H"]


function calculateNote (valueString) {
  let iterval = parseInt(valueString)% 7;
  return (notes[iterval]);
}
function calculateOctave (valueString) {
  let iterval = Math.floor(parseInt(valueString)/ 7);
  return (iterval.toString());
}

//establishing mqtt connection over websocket port
const client = mqtt.connect('ws://localhost:8888', {
      clientId: 'javascript'
    });

    client.on('connect', function () {
      console.log('connected!');
      client.subscribe('/distance');
    });

//tone.js sampler    
const player = new Tone.Player("sounds/diva.wav")

const filter = new Tone.Filter(400, "lowpass").toDestination();
player.connect(filter);

//membrane synth
  const synth = new Tone.MetalSynth().toDestination();
  const loop = new Tone.Loop(
    function(time) {
    synth.triggerAttackRelease(twostrings);
  }, "8n").start(0);

  Tone.Transport.start();
 
 //play synth when button1 is pressed
  document.getElementById("button1").addEventListener("click", function() {
    playSynth();
  });

//attach a click listener to a play button
document.getElementById("button").addEventListener("click", async () => {
  console.log("audio is ready");
  player.start();
});

//map range
function mapNumber (number, inMin, inMax, outMin, outMax)
{
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//on received message from mqtt
    client.on('message', function (topic, message) {
      console.log(message.toString())

      document.getElementById("p1").innerHTML = message.toString();
if (message < 30) {
      twostrings = calculateNote(message).concat(calculateOctave(message))
      console.log(twostrings);
}
      filter.frequency.value = mapNumber (message, 0, 30, 0, 500);
    });
    
    document.getElementById('button').addEventListener('click', function () {
      client.publish('hello', 'world');
    });