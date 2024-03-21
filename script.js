import * as THREE from "./3lib.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';
// import { tweenZoom } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0.5, 0.5, 1).setLength(14);
let renderer = new THREE.WebGLRenderer({
  physicallyCorrectLights: true,
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);


let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );

window.addEventListener("resize", onWindowResize);

let controls = new OrbitControls(camera, labelRenderer.domElement);
controls.enablePan = false;
controls.minDistance = 11;
controls.maxDistance = 15;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.0;
// updateCameraZoomLimit();

let globalUniforms = {
  time: { value: 0 }
};


// function zoomIn() {
//   controls.minDistance -= 3;
//   controls.maxDistance -= 3; 
//   updateProjectionMatrix();
// }

// function zoomOut() {
//   controls.minDistance += 3;
//   controls.maxDistance += 3;
//   updateProjectionMatrix();
// }

// Define the target zoom levels
let targetMinDistance = controls.minDistance;
let targetMaxDistance = controls.maxDistance;

// Flag to track if zoom animation is in progress
let isTweening = false;

// Define the lerping factor
const lerpFactor = 0.1; // Adjust this value to control the speed of zooming

// Function to smoothly transition between zoom levels
function tweenZoom() {
  // Calculate the new zoom levels using lerp
  let newMinDistance = THREE.MathUtils.lerp(controls.minDistance, targetMinDistance, lerpFactor);
  let newMaxDistance = THREE.MathUtils.lerp(controls.maxDistance, targetMaxDistance, lerpFactor);

  // Update the camera controls with the new zoom levels
  controls.minDistance = newMinDistance;
  controls.maxDistance = newMaxDistance;

  // Update the projection matrix
  updateProjectionMatrix();

  // Check if we reached the target zoom levels
  if (Math.abs(newMinDistance - targetMinDistance) > 0.01 || Math.abs(newMaxDistance - targetMaxDistance) > 0.01) {
    // If not, request the next frame to continue the animation
    requestAnimationFrame(tweenZoom);
  } else {
    // Zoom animation finished, reset the tweening flag
    isTweening = false;
  }
}

// Function to smoothly zoom in
function zoomIn() {
  // Set the maximum allowed zoom in distance
  const minZoomLimit = 4;

  // Adjust the target zoom levels for zooming in only if the limit is not reached
  if (targetMinDistance - 7 >= minZoomLimit) {
    targetMinDistance -= 7;
    targetMaxDistance -= 7;

    // Start the tweening animation if it's not already running
    if (!isTweening) {
      isTweening = true;
      tweenZoom();
    }
  }
}


// Function to smoothly zoom out
function zoomOut() {
  // Set the minimum allowed zoom out distance
  const minZoomLimit = 20; // Adjust this value as needed

  // Adjust the target zoom levels for zooming out only if the limit is not exceeded
  if (targetMinDistance + 7 <= minZoomLimit) {
    targetMinDistance += 7;
    targetMaxDistance += 7;

    // Start the tweening animation if it's not already running
    if (!isTweening) {
      isTweening = true;
      tweenZoom();
    }
  }
}


// Function to update the projection matrix after zooming
function updateProjectionMatrix() {
  camera.updateProjectionMatrix();
}



//event listeners for zoom button
document.getElementById('zoomIn').addEventListener('click',zoomIn);
document.getElementById('zoomOut').addEventListener('click',zoomOut);


let rad = 5;
const shellGeometry = new THREE.SphereBufferGeometry(rad + 0.2, 64, 64);
const textureLoader1 = new THREE.TextureLoader();
const texture3D1 = textureLoader1.load('./map2.jpeg'); 
const shellMaterial = new THREE.MeshBasicMaterial({
  map: texture3D1,
  transparent: false,
  depthTest: true
})
const activeUsers = memberCount;

function updateDiceGeometryandNumInstances(activeUsers){
let numberDots;
let dotHeight;
let dotWidth;

switch(true){
  case activeUsers <= 1000:
    dotHeight = 0.07;
    dotWidth = 0.07;
    numberDots = 100000;
    break;
  case activeUsers <= 2000:
    dotHeight = 0.05;
    dotWidth = 0.05;
    numberDots = 200000;
    break;
  case activeUsers <= 3000:
    dotHeight = 0.04;
    dotWidth = 0.04;
    numberDots = 300000;
    break;
  case activeUsers <= 4000:
    dotHeight = 0.035;
    dotWidth = 0.035;
    numberDots = 400000;
    break;
  case activeUsers <= 5000:
    dotHeight = 0.029;
    dotWidth = 0.029;
    numberDots = 500000;
    break;
  case activeUsers <= 6000:
    dotHeight = 0.015;
    dotWidth = 0.015;
    numberDots = 600000;
  case activeUsers <= 7000:
    dotHeight = 0.005;
    dotWidth = 0.005;
    numberDots = 700000;
  default:
    dotHeight = 0.045;
    dotWidth = 0.045;
    numberDots = 1000000;
}

return {
  dotHeight,
  dotWidth,
  numberDots
};
}

const dotSwitchData = updateDiceGeometryandNumInstances(activeUsers)
// console.log(dotSwitchData,"testing dots data");
const shell = new THREE.Mesh(shellGeometry, shellMaterial);

const sphereRadius = rad + 0.2; // Radius of the shell sphere
const numInstances = dotSwitchData.numberDots;
// console.log("sikander", memberCount, numInstances)
const diceplan = new THREE.PlaneGeometry(dotSwitchData.dotHeight, dotSwitchData.dotWidth);
const dicegeomatry = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.8,
  // blending: THREE.NormalBlending,
  side: THREE.DoubleSide,
  depthTest: true
});

let MillionDices = new THREE.InstancedMesh(diceplan, dicegeomatry, numInstances);


const instancedMatrix = new THREE.Matrix4();
// const distributionPoints = distribution(numInstances, sphereRadius);

function distributeOnFibonacciSphere(samples, sphereRadius) {
  const points = [];
  const phi = Math.PI * (3. - Math.sqrt(5.)); // golden angle in radians
  
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y); // radius at y

    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(sphereRadius));
  }

  return points;
}

// Usage
const distributionPoints = distributeOnFibonacciSphere(numInstances, sphereRadius);

for (let i = 0; i < numInstances; i++) {
  const position = distributionPoints[i];
  instancedMatrix.makeTranslation(position.x, position.y, position.z);
  const normal = position.clone().normalize();
  instancedMatrix.lookAt(new THREE.Vector3(), normal, new THREE.Vector3(0, 1, 0));
  MillionDices.setMatrixAt(i, instancedMatrix);
}


const onemarkerPositions = [];
const oneMarkerCount = 1;
let markerInfo1 = []; // information on markers1
let gMarker1 = new THREE.PlaneGeometry(0.7, 0.7);
let mMarker1 = new THREE.MeshBasicMaterial({
  color: 0x2fae2d,
  opacity: 0.0,
  transparent: false,
  depthTest: true,
  onBeforeCompile: (shader) => {
    shader.uniforms.time = globalUniforms.time;
  shader.vertexShader = `
  attribute float phase;
  varying float vPhase;
  ${shader.vertexShader}
  `.replace(
    `#include <begin_vertex>`,
    `#include <begin_vertex>
    vPhase = phase; // de-synch of ripples
    `
    );
    //console.log(shader.vertexShader);
    shader.fragmentShader = `
    uniform float time;
    varying float vPhase;
    ${shader.fragmentShader}
    `.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
    vec2 lUv = (vUv - 0.5) * 2.;
    float val = 0.;
    float lenUv = length(lUv);
    val = max(val, 1. - step(0.01, lenUv)); // central circle
    val = max(val, step(0.08, lenUv) - step(0.05, lenUv)); // outer circle
    
    float tShift = fract(time * 0.5 + vPhase);
    val = max(val, step(0.1 + (tShift * 0.01), lenUv) - step(0.05 + (tShift * 0.4), lenUv)); // ripple
    
    if (val < 0.1) discard;
    
    vec4 diffuseColor = vec4( diffuse, opacity );`
    );
    //console.log(shader.fragmentShader)
}
});
mMarker1.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
let markers1 = new THREE.InstancedMesh(gMarker1, mMarker1, oneMarkerCount);

let dummy1 = new THREE.Object3D();
let phase1 = [];
for (let i = 0; i < oneMarkerCount; i++) {
dummy1.position.randomDirection().setLength(rad + 0.2);
dummy1.lookAt(dummy1.position.clone().setLength(rad + 1));
dummy1.updateMatrix();
markers1.setMatrixAt(i, dummy1.matrix);
phase1.push(Math.random());

markerInfo1.push({
  id: i + 1,
  mag: THREE.MathUtils.randInt(1, 10),
  crd: dummy1.position.clone()
});
onemarkerPositions.push(dummy1.position.clone()); // Store marker positions
}
gMarker1.setAttribute(
"phase1",
new THREE.InstancedBufferAttribute(new Float32Array(phase1), 1)
);






const markerPositions = [];
const markerCount = 1000;
let markerInfo = []; // information on markers
let gMarker = new THREE.PlaneGeometry(0.7, 0.7);
let mMarker = new THREE.MeshBasicMaterial({
color: 0xfddc5c,
opacity: 0.0,
transparent: false,
onBeforeCompile: (shader) => {
  shader.uniforms.time = globalUniforms.time;
  shader.vertexShader = `
  attribute float phase;
  varying float vPhase;
  ${shader.vertexShader}
  `.replace(
    `#include <begin_vertex>`,
    `#include <begin_vertex>
    vPhase = phase; // de-synch of ripples
    `
    );
    //console.log(shader.vertexShader);
    shader.fragmentShader = `
    uniform float time;
    varying float vPhase;
    ${shader.fragmentShader}
    `.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
    vec2 lUv = (vUv - 0.5) * 2.;
    float val = 0.;
    float lenUv = length(lUv);
    val = max(val, 1. - step(0.05, lenUv)); // central circle
    val = max(val, step(0.01, lenUv) - step(0.02, lenUv)); // outer circle
    
    float tShift = fract(time * 0.5 + vPhase);
    val = max(val, step(0.1 + (tShift * 0.01), lenUv) - step(0.05 + (tShift * 0.01), lenUv)); // ripple
    
    if (val < 0.1) discard;
    
    vec4 diffuseColor = vec4( diffuse, opacity );`
    );
    //console.log(shader.fragmentShader)
}
});
mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

let dummy = new THREE.Object3D();
let phase = [];
for (let i = 0; i < markerCount; i++) {
dummy.position.randomDirection().setLength(rad + 0.2);
dummy.lookAt(dummy.position.clone().setLength(rad + 1));
dummy.updateMatrix();
markers.setMatrixAt(i, dummy.matrix);
phase.push(Math.random());

markerInfo.push({
  id: i + 1,
  mag: THREE.MathUtils.randInt(1, 10),
  crd: dummy.position.clone()
});
markerPositions.push(dummy.position.clone()); // Store marker positions
}
gMarker.setAttribute(
"phase",
new THREE.InstancedBufferAttribute(new Float32Array(phase), 1)
);

function removeRandomInstances(numToRemove) {
  const currentNumInstances = MillionDices.count;

  if (numToRemove > currentNumInstances) {
    console.error("Trying to remove more instances than available.");
    return;
  }

  const indicesToRemove = [];
  while (indicesToRemove.length < numToRemove) {
    const randomIndex = Math.floor(Math.random() * currentNumInstances);
    if (!indicesToRemove.includes(randomIndex)) {
      indicesToRemove.push(randomIndex);
    }
  }

  // Create a new InstancedMesh with the instances to keep
  const newMillionDices = new THREE.InstancedMesh(
    MillionDices.geometry,
    MillionDices.material,
    currentNumInstances - numToRemove
  );

  // Copy the matrices, excluding the instances to remove
  let newIndex = 0;
  for (let i = 0; i < currentNumInstances; i++) {
    if (!indicesToRemove.includes(i)) {
      const matrix = new THREE.Matrix4();
      matrix.fromArray(MillionDices.instanceMatrix.array, i * 16);
      newMillionDices.setMatrixAt(newIndex, matrix);
      newIndex++;
    }
  }

  // Add the new mesh to the scene (replace the old one if needed)
  scene.remove(MillionDices);
  scene.add(newMillionDices);

  // Update matrix after removal
  newMillionDices.instanceMatrix.needsUpdate = true;

  // Update the reference to the new mesh
  MillionDices = newMillionDices;
}


removeRandomInstances(memberCount)

shell.renderOrder = 1;
MillionDices.renderOrder = 2;
markers.renderOrder = 3;
markers1.renderOrder = 4;
scene.add(shell);
scene.add(MillionDices);

scene.add(markers1);
// scene.add(markers);

const locateMeBox = document.getElementById('locateMeBox');
locateMeBox.addEventListener('click', ()=> {
  const marker1Position = markerInfo1[0].crd;
  // camera.position.copy(marker1Position.clone().setLength(14));
  // camera.lookAt(marker1Position);

  const startPosition = camera.position.clone();
  const startQuaternion = camera.quaternion.clone();
  const targetPosition = marker1Position.clone().setLength(14);
  const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler().setFromVector3(marker1Position));

  const animationDuration = 1000;
  const animationStartTime = Date.now();

  function animateCamera() {
    const timeElapsed = Date.now() - animationStartTime;
    const progress = Math.min(timeElapsed / animationDuration, 1);

    camera.position.lerpVectors(startPosition, targetPosition, progress);
    camera.quaternion.copy(startQuaternion).slerp(targetQuaternion, progress);

    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  }

  animateCamera();
});

let galaxyGeometry = new THREE.SphereBufferGeometry(200, 550, 550);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
const textureLoader2 = new THREE.TextureLoader();
// Load Galaxy Textures
textureLoader2.crossOrigin = true;
textureLoader2.load(
  './background.jpg',
  function(texture) {
    galaxyMaterial.map = texture;
    scene.add(galaxy);
  }
);
  // const db = firebase.firestore();
  
  // var list = await db.collection("users")
  // .get();
  
  // console.log(list.docs.length);
  // const oneMarkerCount = 30;
  let labelDiv = document.getElementById("markerLabel");
  let closeBtn = document.getElementById("closeButton");
  closeBtn.addEventListener("pointerdown", event => {
  labelDiv.classList.add("hidden");
})
const initialMarker = markerInfo1[0];

// Set camera position to the marker's position
camera.position.copy(initialMarker.crd.clone().setLength(14));

// Set camera lookAt to the marker's position
camera.lookAt(initialMarker.crd);
let clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime();
  globalUniforms.time.value = t;
  renderer.shadowMap.enabled = false;
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
});
// console.log("errors")
function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
}