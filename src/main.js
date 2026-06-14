import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene Setup
const scene = new THREE.Scene();

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Important for HDR rendering
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.querySelector('#app').appendChild(renderer.domElement);

// 4. Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth camera movements

// 5. HDRI Lighting using RGBELoader
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/venice_sunset_1k.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // Set the HDRI as the environment map (affects lighting/reflections)
  scene.environment = texture;
});

// 6. Load a GLB Object
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/wooden_box.glb', (gltf) => {
  scene.add(gltf.scene);
});

// 7. Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls for damping
  controls.update();

  renderer.render(scene, camera);
}
animate();

// 8. Handle Window Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
