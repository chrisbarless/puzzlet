import * as THREE from 'three';

const texture = new THREE.TextureLoader().load(
  'http://i.imgur.com/7KAE5M7.jpg',
);

const Plane = (width, height) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.z = -1;

  return plane;
};

export default Plane;
