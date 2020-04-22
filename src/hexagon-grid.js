import Hexagon from './hexagon';

const hexLimit = 5765
    const rowLimit = 96;
    const hexagonWidth = Math.floor(window.innerWidth / rowLimit);

    let xIndex = 0;
    let yIndex = 0;

    hexagons = new Map();

    for (let hexIndex = 1; hexIndex <= hexagonLimit; hexIndex += 1) {
      // Add to hexagon Map
      hexagons.set(
        hexIndex,
        new Hexagon(hexIndex, xIndex, yIndex, hexagonWidth),
      );

      if (xIndex >= rowLimit) {
        xIndex = 0;
        yIndex += 1;
      } else {
        xIndex += 1;
      }
    }

const overallWidth = hexagonWidth * xIndex;
const overallHeight = hexagonWidth * yIndex;

//   draw(context) {
//     context.save();
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.font = '4px sans-serif';
//     // eslint-disable-next-line no-restricted-syntax
//     for (const [hexIndex, hexagon] of hexagons) {
//       hexagon.draw(context);
//     }
//     context.restore();
//   }



  getCenter() {
    const center = [
      Math.floor(overallWidth / 2),
      Math.floor(overallHeight / 2),
    ];
    return center;
  }

  getClosestHexagon(x, y) {
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
export default HexagonGrid;
