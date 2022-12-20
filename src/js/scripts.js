import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';
import wood from '../img/wood.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

// perspective camera
// fov: field of view, an angle in degrees, human eyes can see 60 degrees
// near and far: clipping planes, objects outside of these planes will not be rendered

// orthographic camera
// 2d scene, no perspective
// left, right, top, bottom: clipping planes
// near and far: clipping planes

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.update();

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

camera.position.z = 5;
camera.position.y = 2;

camera.position.set( 20, 45, 45 );
orbit.update();

// const gridHelper = new THREE.GridHelper( 30 );
// scene.add( gridHelper );

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new THREE.ExtrudeGeometry( shape, {
    amount: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  
  geometry.center();
  
  return geometry;
}

function createBoxWithRoundedEdgesAndHole( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  
  const hole = new THREE.Path();
  hole.moveTo(0.5, 0.5);
  hole.lineTo(0.5, 47.5);
  hole.lineTo(23.5, 47.5);
  hole.lineTo(23.5, 0.5);
  hole.lineTo(0.5, 0.5);
  
  shape.holes = [hole];
  
  let geometry = new THREE.ExtrudeGeometry( shape, {
    amount: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
    depth: 1.5,
  });
  
  geometry.center();
  
  return geometry;
}

// const boxGeometryPre = new THREE.BoxGeometry( 25, 50, 2, 100, 50, 10 );
let boxGeometry = createBoxWithRoundedEdges(25, 50, 2, 0.5, 10);
const boxMaterial = new THREE.MeshLambertMaterial( {
  color: 0x88ff88,
} );

const box = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( box );
box.position.set( 0, -1, 0 );
box.rotation.x = - Math.PI / 2;

const paddingGeo = createBoxWithRoundedEdgesAndHole(25, 50, 2, 0.5, 10);
const paddingMat = new THREE.MeshPhongMaterial( {
  color: 0x88ff88,
  side: THREE.DoubleSide
} );

const padding = new THREE.Mesh( paddingGeo, paddingMat );
scene.add( padding );
padding.position.set( 0, 0, 0 );
padding.rotation.x = - Math.PI / 2;

const boxGeometry1 = new THREE.BoxGeometry( 26, 52, 6 );
const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshBasicMaterial({
  color: 0xFF8844,
  map: textureLoader.load(wood),
});

const woodBox = new THREE.Mesh( boxGeometry1, material );
scene.add( woodBox );
woodBox.position.set( 0, -4.1, 0 );
woodBox.rotation.x = - Math.PI / 2;

// const snookerTableGeometry = new THREE.PlaneGeometry( 25, 50, 10, 10 );
// const snookerTableMaterial = new THREE.MeshLambertMaterial( {
//   color: 0x88ff88,
//   wireframe: false,
// } );
// const snookerTable = new THREE.Mesh( snookerTableGeometry, snookerTableMaterial );
// scene.add( snookerTable );
// snookerTable.position.set( 0, 0, 0 );
// snookerTable.rotation.x = - Math.PI / 2;

const ballPosition = [
  { x: 3, z: 0 },
  { x: 5, z: 0 },
  { x: 7, z: 0 },
  { x: 9, z: 0 },
  { x: 11, z: 0 },
  { x: 4, z: 2 },
  { x: 6, z: 2 },
  { x: 8, z: 2 },
  { x: 10, z: 2 },
  { x: 5, z: 4 },
  { x: 7, z: 4 },
  { x: 9, z: 4 },
  { x: 6, z: 6 },
  { x: 8, z: 6 },
  { x: 7, z: 8 },
]);

const group = new THREE.Group();

for (var i = 0; i < 15; i++) {
  const sphere2Geometry = new THREE.SphereGeometry( 1 );
  const sphere2Material = new THREE.MeshLambertMaterial( {
    color: 0xff0000,
    // vertexShader: document.getElementById( 'vertexShader' ).textContent,
    // fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  });
  
  const sphere2 = new THREE.Mesh( sphere2Geometry, sphere2Material );
  group.add( sphere2 );
  sphere2.position.set( ballPosition[i].x, 1, ballPosition[i].z );
}

scene.add( group );
group.position.set( -6, 0, -10 );

const colours = [
  0xff00ff,
  0x0000ff,
  0xffff00,
  0x00ff00,
  0x996633,
  0x000000,
  0xffffff,
];

const colouredBallsPosition = [
  { x: 1, z: 0 },
  { x: 1, z: 6 },
  { x: 7, z: 17 },
  { x: -5, z: 17 },
  { x: 1, z: 17 },
  { x: 1, z: -18 },
  { x: 4, z: 22 }
];

for (var i = 0; i < 7; i++) {
  const sphere2Geometry = new THREE.SphereGeometry( 1 );
  const sphere2Material = new THREE.MeshLambertMaterial( {
    color: colours[i],
    // vertexShader: document.getElementById( 'vertexShader' ).textContent,
    // fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  });
  
  const sphere2 = new THREE.Mesh( sphere2Geometry, sphere2Material );
  scene.add( sphere2 );
  sphere2.position.set( colouredBallsPosition[i].x, 1, colouredBallsPosition[i].z );
  sphere2.name = i === 6 ? 'cueBall' : i;
}

const holePositions = [
  { x: -10.75, z: -22 },
  { x: 10.75, z: -22 },
  { x: -10.75, z: 23 },
  { x: 10.75, z: 23 },
  { x: -10.75, z: 0 },
  { x: 10.75, z: 0 }
];

for (var c = 0; c < 6; c++) {
  const holeGeometry = new THREE.CircleGeometry( 1.5, 32 );
  const holeMaterial = new THREE.MeshLambertMaterial( {
    color: 0x000000,
  });
  const hole = new THREE.Mesh( holeGeometry, holeMaterial );
  scene.add( hole );
  hole.position.set( holePositions[c].x, 0.1, holePositions[c].z );
  hole.rotation.x = - Math.PI / 2;
}

const gui = new dat.GUI();

const options = {
  sphereColor: 0x0000ff,
  wireframe: false,
  speed: 0.01,
  angle: 0.21,
  penumbra: 0.7,
  itensity: 0.5,
};

gui.add( options, 'speed', 0, 0.1);
gui.add( options, 'angle', 0, 1);
gui.add( options, 'penumbra', 0, 0.1);
gui.add( options, 'itensity', 0, 1);


const ambientLight = new THREE.AmbientLight( 0x555555 );
scene.add( ambientLight );

const spotLight = new THREE.SpotLight( 0xffffff);
scene.add( spotLight );
spotLight.position.set( 0, 100, 0 );
spotLight.castShadow = true;
spotLight.angle = 0.2;

// const sLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( sLightHelper );

const starsTexture = textureLoader.load( stars );

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load( [
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
] );

const box2Geometry = new THREE.BoxGeometry( 10, 10, 10 );
const box2Material = new THREE.MeshStandardMaterial( {
  // color: 0x00ff00,
  // map: textureLoader.load( nebula )
} );

scene.background = environmentMap;

let step = 0;

const mousePointer = new THREE.Vector2();

window.addEventListener( 'mousemove', ( event ) => {
  mousePointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mousePointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

// const sphereID = sphere.id;
// box2.name = 'box2';

function animate(time) {

  spotLight.intensity = options.itensity;
  spotLight.penumbra = options.penumbra;
  spotLight.angle = options.angle;
  // sLightHelper.update();

  raycaster.setFromCamera( mousePointer, camera );
  const intersects = raycaster.intersectObjects( scene.children, true );
  for ( const intersect of intersects ) {
    // console.log(intersect.object.name);
    if ( intersect.object.name === 'cueBall' ) {
      console.log('camera', camera);
      let v = new THREE.Vector2(
        intersect.object.position.x - camera.position.x,
        intersect.object.position.z - camera.position.z
      ).angle();
      const angleInRadians = v;
      const distance = 10;
      const ballPosition = {
        x: intersect.object.position.x + ( distance * Math.cos( angleInRadians ) ),
        z: intersect.object.position.z + ( distance * Math.sin( angleInRadians ) )
      }
      if (ballPosition.x > 11) {
        ballPosition.x = 11;
      }
      if (ballPosition.x < -11) {
        ballPosition.x = -11;
      }
      if (ballPosition.z > 23) {
        ballPosition.z = 23;
      }
      if (ballPosition.z < -22) {
        ballPosition.z = -22;
      }
      gsap.to( intersect.object.position, {
        x: ballPosition.x,
        z: ballPosition.z,
        duration: 1
      });
    }
  }
  

  renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

window.addEventListener( 'resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});