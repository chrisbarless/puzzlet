import * as THREE from 'three';

// var geometry = new THREE.BufferGeometry();
// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
// var vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0,
// 	 1.0, -1.0,  1.0,
// 	 1.0,  1.0,  1.0,

// 	 1.0,  1.0,  1.0,
// 	-1.0,  1.0,  1.0,
// 	-1.0, -1.0,  1.0
// ] );

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
  const material = new THREE.MeshNormalMaterial();
  const hexagonMesh = new THREE.Mesh(geometry, material);

  return hexagonMesh;
};

export default Hexagon;
