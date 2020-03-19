(function() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const hexagonWidth = 25;
  let xIndex = 0;
  let yIndex = 0;

  function drawHexagons(numberToDraw) {
    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let i = 0; i < numberToDraw; i++) {
      drawHexagon(i);
    }
    context.restore();
  }

  function drawHexagon(hexIndex) {
    let x = (xIndex + 1) * hexagonWidth;
    const y = (yIndex + 1) * hexagonWidth;
    const a = hexagonWidth / 4;
    const b = Math.sqrt(3) * a;

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

    if (xIndex > 30) {
      xIndex = 0;
      yIndex += 1;
    }
    xIndex++;
  }

  drawHexagons(5765);
})();
