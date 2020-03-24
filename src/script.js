(function main() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const hexagons = new Map();

  const hexagonLimit = 5765;
  const rowLimit = Math.ceil((16 / 9) * Math.sqrt(hexagonLimit)); // Around 135
  const hexagonWidth = Math.floor(canvas.width / rowLimit);
  const a = hexagonWidth / 4;
  const b = Math.sqrt(3) * a;
  const { innerWidth, innerHeight } = window;

  let xIndex = 0;
  let yIndex = 0;

  function buildHexagon(hexIndex) {
    let x = (xIndex + 1) * hexagonWidth;
    const y = (yIndex + 1) * hexagonWidth;

    if (yIndex % 2 !== 0) {
      x -= hexagonWidth / 2;
    }

    // Draw hexagon
    context.beginPath();
    context.moveTo(x + 0, y + -2 * a);
    context.lineTo(x + b, y + -a);
    context.lineTo(x + b, y + a);
    context.lineTo(x + 0, y + 2 * a);
    context.lineTo(x + -b, y + a);
    context.lineTo(x + -b, y + -a);
    context.lineTo(x + 0, y + -2 * a);
    context.closePath();
    context.stroke();
    context.fillText(hexIndex, x, y);

    // Add to hexagon Map
    hexagons.set(hexIndex, {
      x,
      y,
      xIndex,
      yIndex,
    });

    // Increment the axis indexes
    if (xIndex > rowLimit) {
      xIndex = 0;
      yIndex += 1;
    }
    xIndex += 1;
  }

  function drawHexagons(numberToDraw) {
    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '7px sans-serif';
    for (let i = 1; i <= numberToDraw; i += 1) {
      buildHexagon(i);
    }
    context.restore();
  }

  function getClosestHexagon(x, y) {
    let minDist = Infinity;
    let nearest;
    for (const [hexIndex, hexagon] of hexagons) {
      const dist = Math.hypot(hexagon.x - x, hexagon.y - y);
      if (dist < minDist) {
        nearest = hexIndex;
        minDist = dist;
      }
    }
    return nearest;
  }

  canvas.addEventListener(
    'click',
    (event) => {
      const closest = getClosestHexagon(event.pageX, event.pageY);
      if (closest < hexagonLimit) {
        alert(closest);
      }
    },
    false,
  );
  canvas.setAttribute('width', innerWidth);
  canvas.setAttribute('height', innerHeight);

  drawHexagons(hexagonLimit);
}());
