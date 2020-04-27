import * as THREE from 'three';

const Hexagon = (hexagonWidth, hexIndex) => {
  const shape = new THREE.Shape();

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
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const hexagonMesh = new THREE.Mesh(geometry, material);

  return hexagonMesh;
};

export default Hexagon;
