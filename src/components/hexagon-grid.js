import * as THREE from 'three';

import Hexagon from './hexagon';
import Plane from './plane';
import Controls from './controls';

let controls;

const HEX_LIMIT = 5765;
const hexagonWidth = 10;
const rowLimit = 95;
const overallWidth = hexagonWidth * rowLimit;
const overallHeight = hexagonWidth * Math.floor(HEX_LIMIT / rowLimit);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}
function HexagonGrid(renderer, scene, camera) {
  controls = new Controls(camera);
  const hexagons = new Map();

  let column = 1;
  let row = 1;

  for (let hexIndex = 1; hexIndex <= HEX_LIMIT; hexIndex += 1) {
    let x = column * hexagonWidth - overallWidth / 2;
    const y = row * hexagonWidth - overallHeight / 2;
    const isEvenRow = row % 2 === 0;

    if (isEvenRow) {
      x += hexagonWidth / 2;
    }
    if (column >= (isEvenRow ? rowLimit - 1 : rowLimit)) {
      column = 1;
      row += 1;
    } else {
      column += 1;
    }

    const hex = Hexagon(hexagonWidth, hexIndex);
    hex.position.x = x;
    hex.position.y = y;

    hexagons.set(hexIndex, hex);
    if (Math.random() > 0) {
      scene.add(hex);
    }
  }

  const plane = Plane(overallWidth, overallHeight);
  scene.add(plane);

  renderer.domElement.addEventListener('mousemove', onMouseMove);

  this.tick = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
    }
  };
}

export default HexagonGrid;
