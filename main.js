import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader, TTFLoader } from 'three/examples/jsm/Addons.js';

/* ----Gui---- */
const gui = new dat.GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 8;
scene.add(camera);

// Text
const loader = new TTFLoader();

loader.load('fonts/bold.ttf', function (json) {
  const font = new FontLoader().parse(json);

  const textGeometry = new TextGeometry('hello world!', {
    depth: 0,
    size: 3,
    color: 'white',
    font: font,
  });

  // Center the font
  textGeometry.computeBoundingBox();
  const centerOffsetX = (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / 2;
  const centerOffsetY = (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 3;
  textGeometry.translate(-centerOffsetX, -centerOffsetY, 0);

  const textMaterial = new THREE.MeshBasicMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.z = -3;
  scene.add(text);
});

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 30, 100),
  new THREE.MeshPhysicalMaterial({
    thickness: 0.2,
    roughness: 0,
    transmission: 0.99,
    ior: 1.2,
    dispersion: 12,
    // backSide: true
    side: THREE.DoubleSide
  })
);
gui.add(torus.material, 'thickness', 0, 1).name('Thickness');
gui.add(torus.material, 'roughness', 0, 1).name('Roughness');
gui.add(torus.material, 'transmission', 0, 1).name('Transmission');
gui.add(torus.material, 'ior', 1, 2).name('IOR');
gui.add(torus.material, 'dispersion', 0, 50).name('Chromatic Aberration');
gui.add(torus.material, 'side', { FrontSide: THREE.FrontSide, BackSide: THREE.BackSide, DoubleSide: THREE.DoubleSide }).name('Side').onChange(value => {
  torus.material.side = parseInt(value);
  torus.material.needsUpdate = true;
});
scene.add(torus);

// Light
const dLight = new THREE.DirectionalLight(0xffffff, 1);
gui.add(dLight, 'intensity', 0, 100000);
dLight.position.set(0, 3, 2);
scene.add(dLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// Calling F(x)
animate();
handleResize();
window.addEventListener('resize', handleResize);

// Imp F(x)
function animate() {

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  torus.scale.set(sizes.width / 500, sizes.width / 500, sizes.width / 500);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}