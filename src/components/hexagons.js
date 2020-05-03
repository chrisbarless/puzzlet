import * as THREE from 'three';

const texture = new THREE.TextureLoader().load(
  'http://i.imgur.com/7KAE5M7.jpg',
);

const geometry = new THREE.CircleBufferGeometry(0.5, 6);
geometry.rotateZ(Math.PI / 2);

const material = new THREE.MeshBasicMaterial({ map: texture });

const Hexagon = (hexCount) => {
  const mesh = new THREE.InstancedMesh(geometry, material, hexCount);

  return mesh;
};

export default Hexagon;
