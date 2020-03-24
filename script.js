(function main() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  const hexagonLimit = 5765;
  const rowLimit = Math.ceil((16 / 9) * Math.sqrt(hexagonLimit));
  const hexagonWidth = Math.floor(canvas.width / rowLimit);
  const a = hexagonWidth / 4;
  const b = Math.sqrt(3) * a;
  const { innerWidth, innerHeight } = window;

  let xIndex = 0;
  let yIndex = 0;

  function drawHexagon(hexIndex) {
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
    for (let i = 0; i < numberToDraw; i += 1) {
      drawHexagon(i);
    }
    context.restore();
  }

  canvas.setAttribute('width', innerWidth);
  canvas.setAttribute('height', innerHeight);

  drawHexagons(hexagonLimit);
}());
