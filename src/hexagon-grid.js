import Hexagon from './hexagon';

class HexagonGrid {
  constructor(hexagonLimit = 1) {
    const rowLimit = Math.ceil((16 / 9) * Math.sqrt(hexagonLimit)); // Around 135
    let xIndex = 0;
    let yIndex = 0;
    const hexagonWidth = Math.floor(window.innerWidth / rowLimit);

    this.hexagons = new Map();

    for (let hexIndex = 1; hexIndex <= hexagonLimit; hexIndex += 1) {
      // Add to hexagon Map
      this.hexagons.set(
        hexIndex,
        new Hexagon(hexIndex, xIndex, yIndex, hexagonWidth),
      );

      if (xIndex > rowLimit) {
        xIndex = 0;
        yIndex += 1;
      }
      xIndex += 1;
    }
  }

  draw(context) {
    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '7px sans-serif';
    // eslint-disable-next-line no-restricted-syntax
    for (const [hexIndex, hexagon] of this.hexagons) {
      hexagon.draw(context);
    }
    context.restore();
    // debugger;
  }

  getClosestHexagon(x, y) {
    let minDist = Infinity;
    let nearest;
    // eslint-disable-next-line no-restricted-syntax
    for (const [hexIndex, hexagon] of this.hexagons) {
      const dist = Math.hypot(hexagon.x - x, hexagon.y - y);
      if (dist < minDist) {
        nearest = hexIndex;
        minDist = dist;
      }
    }
    return nearest;
  }
}

export default HexagonGrid;
