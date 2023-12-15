import * as THREE from "./3lib.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

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
controls.minDistance = 6;
controls.maxDistance = 15;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.0;

let globalUniforms = {
  time: { value: 0 }
};

let rad = 5;
const shellGeometry = new THREE.SphereBufferGeometry(rad + 0.2, 64, 64);
const textureLoader1 = new THREE.TextureLoader();
const texture3D1 = textureLoader1.load('./map1.jpeg'); 
const shellMaterial = new THREE.MeshBasicMaterial({
  map: texture3D1,
  transparent: false,
})
const shell = new THREE.Mesh(shellGeometry, shellMaterial);
scene.add(shell);
const activeUsers = memberCount;

const sphereRadius = rad + 0.2; // Radius of the shell sphere
const numInstances = 1000000 - activeUsers;
console.log("sikander", memberCount, numInstances)

const test1 = new THREE.PlaneGeometry(0.045, 0.045);
const test2 = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.5,
  // blending: THREE.NormalBlending,
  side: THREE.DoubleSide,
});

const test3 = new THREE.InstancedMesh(test1, test2, numInstances);
scene.add(test3);


const instancedMatrix = new THREE.Matrix4();
const distributionPoints = distribution(numInstances, sphereRadius);

function distribution(samples, sphereRadius) {
  const points = [];
  const rows = Math.ceil(Math.sqrt(samples));
  const cols = Math.ceil(samples / rows);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const u = (j / (cols - 4)) * Math.PI * 5;
      const v = (i / (rows - 3)) * Math.PI;

      // Adjusted range and scaling based on sphereRadius
      const x = Math.cos(u) * Math.sin(v) * sphereRadius;
      const y = Math.sin(u) * Math.sin(v) * sphereRadius;
      const z = Math.cos(v) * sphereRadius;

      points.push(new THREE.Vector3(x, y, z));
    }
  }

  return points;
}





for (let i = 0; i < numInstances; i++) {
  const position = distributionPoints[i];
  instancedMatrix.makeTranslation(position.x, position.y, position.z);
  const normal = position.clone().normalize();
  instancedMatrix.lookAt(new THREE.Vector3(), normal, new THREE.Vector3(0, 1, 0));
  test3.setMatrixAt(i, instancedMatrix);
}

const markerPositions = [];
const markerCount = 100;
let markerInfo = []; // information on markers
let gMarker = new THREE.PlaneGeometry(0.7, 0.7);
let mMarker = new THREE.MeshBasicMaterial({
color: 0x2fae2d,
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
mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

let dummy = new THREE.Object3D();
let phase = [];
for (let i = 0; i < markerCount; i++) {
  dummy.position.randomDirection().setLength(rad + 0.2);
  dummy.lookAt(dummy.position.clone().setLength(rad + 1));

  let mMarker = new THREE.MeshBasicMaterial({
    color: i === 0 ? 0xFFD700 : 0x2fae2d,
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
    },
  });
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


scene.add(markers);

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
  const db = firebase.firestore();
  
var list = await db.collection("users")
  .get();

  console.log(list.docs.length);
  // const markerCount = 30;
  let labelDiv = document.getElementById("markerLabel");
let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("pointerdown", event => {
  labelDiv.classList.add("hidden");
})
const initialMarker = markerInfo[0];

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
console.log("errors")
function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
}