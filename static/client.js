//global variables
var clientID;
var publish;
var alpha;
var loop;
let client;

//input clientID and MQTT topic and connect to broker
window.addEventListener("load", () => {
  
  var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1/60; // Sensor refresh rate
// synth start
document.getElementById("accelPermsButton").addEventListener("click", async () => {
  console.log("ab");
  getAccel();
});
function getAccel(){
  console.log("a");
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
       // Add a listener to get smartphone orientation 
           // in the alpha-beta-gamma axes (units in degrees)
          window.addEventListener("deviceorientation", e => {
            console.log(e);
            alpha = document.getElementById("alpha").innerHTML = e.alpha;
            document.getElementById("beta").innerHTML = e.beta;
            document.getElementById("gama").innerHTML = e.gamma;
            //mapping frequency value to alpha
            filter.frequency.value = mapNumber(alpha, 0, 180, 0, 300);
            client.publish(publish, alpha.toString());

            // do something with e
          });
        }
    });
}
  
  document.getElementById("button").addEventListener("click", async () => {
    clientID = document.getElementById("clientID").value;
    clientID.toString();

    publish = document.getElementById("publish").value;
    publish.toString();

    client = mqtt.connect("wss://mobileclient.glitch.me", {
      clientId: clientID,
      wsOptions: {
        port: 8888,
        headers: {
          "user-agent": "Chrome"
        }
      }
    });

    client.on("connect", function() {
      console.log("connected!");
      //startDeviceOrientation();
    });
  });

  //console log euler angles
  function startDeviceOrientation() {
    window.addEventListener("deviceorientation", e => {
      console.log(e);
      alpha = document.getElementById("alpha").innerHTML = e.alpha;
      document.getElementById("beta").innerHTML = e.beta;
      document.getElementById("gama").innerHTML = e.gamma;
      client.publish(publish, alpha.toString());

      //mapping frequency value to alpha
      filter.frequency.value = mapNumber(alpha, 0, 180, 0, 300);
      // do something with e
    });
  }

  //window.addEventListener("deviceorientation", e => {});
});

// synth start
document.getElementById("synthstart").addEventListener("click", async () => {
  await Tone.start();
  Tone.Transport.start();
});

//synth stop
document.getElementById("synthstop").addEventListener("click", async () => {
  Tone.Transport.stop();
});

//filter object
const filter = new Tone.Filter(400, "lowpass").toDestination();

//map range
function mapNumber(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Membrane Synth
const synth = new Tone.MembraneSynth().connect(filter);

//array of notes to be played in sequence
const chord = ["C3", "E3", "G3", "B3"];

const notes = [chord, "Eb3", "G3", "Bb3"];

//sequence object
const synthPart = new Tone.Sequence(
  function(time, note) {
    sampler.triggerAttackRelease(note, "10hz", time);
  },
  notes,
  "4n"
);
synthPart.start();

// sampler object
const sampler = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
    A2: "A2.mp3"
  },
  baseUrl: "https://tonejs.github.io/audio/casio/",
  onload: () => {
    console.log("loaded");
  }
}).connect(filter);

// iOS read device orientation
function readDeviceOrientation() {
  if (Math.abs(window.orientation) === 90) {
    // Landscape
    document.getElementById("orientation").innerHTML = "LANDSCAPE";
  } else {
    // Portrait
    document.getElementById("orientation").innerHTML = "PORTRAIT";
  }
}

window.onorientationchange = readDeviceOrientation;

