import Hexagon from './hexagon';

function HexagonGrid(scene) {
  const hexagonLimit = 5;
  const hexagonWidth = 10;
  // const hexagonWidth = 5765;
  const rowLimit = 96;
  const hexagons = new Map();

  let xIndex = 0;
  let yIndex = 0;

  for (let hexIndex = 1; hexIndex <= hexagonLimit; hexIndex += 1) {
    const hex = Hexagon(hexagonWidth, hexIndex);
    hex.position.x = xIndex * hexagonWidth;
    hex.position.y = yIndex * hexagonWidth;
    hexagons.set(hexIndex, hex);
    scene.add(hex);

    if (xIndex >= rowLimit) {
      xIndex = 0;
      yIndex += 1;
    } else {
      xIndex += 1;
    }
  }

  const overallWidth = hexagonWidth * xIndex;
  const overallHeight = hexagonWidth * yIndex;

  return hexagons;
}

function getCenter() {
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
