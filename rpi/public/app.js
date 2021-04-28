//global variables
let number = 100;
var twostrings = 1;

notes = ["C", "D", "E", "F", "G", "A", "H"]

let synths = [
  "FM Synth",
  "AM Synth",
  "Membrane Synth",
  "Plucky Synth",
  "Metal Synth",
  "Mono Synth",
];

let am, fm, membrane, pluck, metal, mono;
let chosenSynth;

document.querySelector("button1")?.addEventListener("click", async () => {
  init();
});

window.addEventListener("load", () => {
  let dropdown = document.getElementById("dropdown");
  let defaultoption = document.createElement("option");
  defaultoption.text = "Select Synth";

  dropdown.add(defaultoption);

  for (let i = 0; i < synths.length; i++) {
    let synthOption = document.createElement("option");
    synthOption.text = synths[i];
    dropdown.add(synthOption);
  }

  dropdown.selectedIndex = 0;

  dropdown.addEventListener("change", function (e) {
    if (e.target.value == "FM Synth") {
      fm = true;
    }

    if (e.target.value == "AM Synth") {
      am = true;
    }

    if (e.target.value == "Membrane Synth") {
      membrane = true;
    }

    if (e.target.value == "Plucky Synth") {
      pluck = true;
    }

    if (e.target.value == "Metal Synth") {
      metal = true;
    }

    if (e.target.value == "Mono Synth") {
      mono = true;
    }
  });
});

let synthInstruments = [];

function init() {

  const fmSynth = new Tone.FMSynth().toDestination();

  const amSynth = new Tone.AMSynth().toDestination();

  const membraneSynth = new Tone.MembraneSynth().toDestination();

  const pluckSynth = new Tone.PluckSynth().toDestination();

  const metalSynth = new Tone.MetalSynth().toDestination();

  const monoSynth = new Tone.MetalSynth().toDestination();

  synthInstruments.push(
    amSynth,
    fmSynth,
    membraneSynth,
    pluckSynth,
    metalSynth,
    monoSynth
  );

  if (fm == true) {
    chosenSynth = synthInstruments[0];
  }

  if (am == true) {
    chosenSynth = synthInstruments[1];
  }

  if (membrane == true) {
    chosenSynth = synthInstruments[2];
  }

  if (pluck == true) {
    chosenSynth = synthInstruments[3];
  }

  if (metal == true) {
    chosenSynth = synthInstruments[4];
  }

  if (mono == true) {
    chosenSynth = synthInstruments[5];
  }
  const loop = new Tone.Loop(
    function(time) {
    chosenSynth.triggerAttackRelease(twostrings);
  }, "8n").start(0);

  Tone.Transport.start();
};

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