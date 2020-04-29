import * as THREE from 'three';

const shape = new THREE.Shape();

const a = 1 / 4;
const b = Math.sqrt(3) * a;
const x = 0;
const y = 0;

const extrudeSettings = {
  curveSegments: 1,
  steps: 1,
  depth: 0.1,
  bevelEnabled: false,
};

shape.moveTo(x + 0, y + -2 * a);
shape.lineTo(x + b, y + -a);
shape.lineTo(x + b, y + a);
shape.lineTo(x + 0, y + 2 * a);
shape.lineTo(x + -b, y + a);
shape.lineTo(x + -b, y + -a);
shape.lineTo(x + 0, y + -2 * a);

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const Hexagon = (count = 1) => new THREE.InstancedMesh(geometry, material, count);

export default Hexagon;
