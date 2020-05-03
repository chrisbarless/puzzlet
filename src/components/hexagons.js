import * as THREE from 'three';

const hexRadius = Math.pow(2, 1 / 4) / 2;

const geometry = new THREE.CircleBufferGeometry(hexRadius, 6);
geometry.rotateZ(Math.PI / 2);

const material = new THREE.MeshBasicMaterial({
  // color: 0xffac8c,
  // // map: texture,
});

const Hexagon = (hexCount) => {
  const mesh = new THREE.InstancedMesh(geometry, material, hexCount);

  return mesh;
};

export default Hexagon;
