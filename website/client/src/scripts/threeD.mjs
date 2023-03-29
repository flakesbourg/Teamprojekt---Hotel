import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';

export function basicThreeD () {
  const basicCanvas = document.getElementById('basicCanvas');

  const renderer = new THREE.WebGLRenderer({
    canvas: basicCanvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000

  );

  const orbit = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 10);

  orbit.update();

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;

  const loader = new RGBELoader();
  loader.load('../assets/threeDimgs/hotelRoom-1.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  });

  function animate () {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}

export function familyThreeD () {
  const familyCanvas = document.getElementById('familyCanvas');

  const renderer = new THREE.WebGLRenderer({
    canvas: familyCanvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000

  );

  const orbit = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 10);

  orbit.update();

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const loader = new RGBELoader();
  loader.load('../assets/threeDimgs/hotelRoom-2.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  });

  function animate () {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
export function premiumThreeD () {
  const premiumCanvas = document.getElementById('premiumCanvas');

  const renderer = new THREE.WebGLRenderer({
    canvas: premiumCanvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000

  );

  const orbit = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 10);
  orbit.update();

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const loader = new RGBELoader();
  loader.load('../assets/threeDimgs/hotelRoom-3.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  });

  function animate () {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
