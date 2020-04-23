// import * as THREE from 'three';
import Hexagon from './hexagon';
import Plane from './plane';

// const hexagonLimit = 5;
const hexagonLimit = 5765;
const hexagonWidth = 10;
const rowLimit = 96;
const overallWidth = hexagonWidth * rowLimit;
const overallHeight = hexagonWidth * Math.floor(hexagonLimit / rowLimit);

function HexagonGrid(scene) {
  const hexagons = new Map();
  // var group = new THREE.Group();

  let xIndex = 0;
  let yIndex = 0;

  for (let hexIndex = 1; hexIndex <= hexagonLimit; hexIndex += 1) {
    let x = xIndex * hexagonWidth - overallWidth / 2;
    const y = yIndex * hexagonWidth - overallHeight / 2;

    if (yIndex % 2 !== 0) {
      x += hexagonWidth / 2;
    }
    if (xIndex >= rowLimit) {
      xIndex = 0;
      yIndex += 1;
    } else {
      xIndex += 1;
    }

    const hex = Hexagon(hexagonWidth, hexIndex);
    hex.position.x = x;
    hex.position.y = y;

    hexagons.set(hexIndex, hex);
    if (Math.random() > 0.4) {
      scene.add(hex);
    }
  }

  const plane = Plane(overallWidth, overallHeight);
  scene.add(plane);
}

function getCenter(overallWidth, overallHeight) {
  const center = [Math.floor(overallWidth / 2), Math.floor(overallHeight / 2)];
  return center;
}

function getClosestHexagon(x, y) {
  let minDist = Infinity;
  let nearest;
  // eslint-disable-next-line no-restricted-syntax
  for (const [hexIndex, hexagon] of hexagons) {
    const dist = Math.hypot(hexagon.x - x, hexagon.y - y);
    if (dist < minDist) {
      nearest = hexIndex;
      minDist = dist;
    }
  }
  return nearest;
}

function draw(context) {
  context.save();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '4px sans-serif';
  // eslint-disable-next-line no-restricted-syntax
  for (const [hexIndex, hexagon] of hexagons) {
    hexagon.draw(context);
  }
  context.restore();
}

export default HexagonGrid;
