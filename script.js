(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  function drawHexagons(numberToDraw) {
    for (let i = 0; i < numberToDraw; i++) {
      drawHexagon(i);
    }
  }

  function drawHexagon(index) {
    const width = 25;
    const x = (index + 1) * width;
    const y = width;

    const a = width / 4;
    const b = Math.sqrt(3) * a;

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
    context.fillText(index, x - 3, y + 3);

    context.restore();
  }

  context.save();

  drawHexagons(20);
})();
