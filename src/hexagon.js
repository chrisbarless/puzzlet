import * as THREE from 'three';

const shape = new THREE.Shape();

const hexagonWidth = 10;
const a = hexagonWidth / 4;
const b = Math.sqrt(3) * a;
const x = 0;
const y = 0;

const extrudeSettings = {
  steps: 1,
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelSegments: 1,
};

shape.moveTo(x + 0, y + -2 * a);
shape.lineTo(x + b, y + -a);
shape.lineTo(x + b, y + a);
shape.lineTo(x + 0, y + 2 * a);
shape.lineTo(x + -b, y + a);
shape.lineTo(x + -b, y + -a);
shape.lineTo(x + 0, y + -2 * a);

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);

export default mesh;
