import {
  AbsoluteOrientationSensor,
  RelativeOrientationSensor
} from "./motion-sensors.js";

const params = new URLSearchParams(
  new URL(window.location.href).search.slice(1)
);
const relative = !!Number(params.get("relative"));
const coordinateSystem = params.get("coord");

let container, sensor, camera, scene, renderer, model;
var sensor_val;
//initiate sensors
const options = { frequency: 60, referenceFrame: "device" };
if (navigator.permissions) {
  // https://w3c.github.io/orientation-sensor/#model
  Promise.all([
    navigator.permissions.query({ name: "accelerometer" }),
    navigator.permissions.query({ name: "magnetometer" }),
    navigator.permissions.query({ name: "gyroscope" })
  ])
    .then(results => {
      if (results.every(result => result.state === "granted")) {
        initSensor();
      } else {
        console.log("Permission to use sensor was denied.");
      }
    })
    .catch(err => {
      console.log(
        "Integration with Permissions API is not enabled, still try to start app."
      );
      initSensor();
    });
} else {
  console.log("No Permissions API, still try to start app.");
  initSensor();
}

function initSensor() {
  const sensor = new AbsoluteOrientationSensor(options);
  sensor.addEventListener("reading", () => {
    // model is a Three.js object instantiated elsewhere.
    const quaternion = new THREE.Quaternion();
    quaternion.set(
      sensor.quaternion[0],
      sensor.quaternion[1],
      sensor.quaternion[2],
      sensor.quaternion[3]
    );
    sensor_val = new THREE.Euler().setFromQuaternion(quaternion, "ZXY");
    var element = document.getElementById("id01");
    //element.innerHTML = sensor_val.toString();
  });
  sensor.addEventListener("error", error => {
    if (event.error.name == "NotReadableError") {
      console.log("Sensor is not available.");
    }
  });
  sensor.start();
}

function initSensor2() {
  let model;
  const options = { frequency: 60, coordinateSystem };
  console.log(JSON.stringify(options));
  sensor = relative
    ? new RelativeOrientationSensor(options)
    : new AbsoluteOrientationSensor(options);
  sensor.euler;
  sensor.onreading = () => sensor.euler;
  sensor.onerror = event => {
    if (event.error.name == "NotReadableError") {
      console.log("Sensor is not available.");
    }
  };
  sensor.start();
}
