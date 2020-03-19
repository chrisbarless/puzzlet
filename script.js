function init() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.save();

  draw(ctx);
}

function draw(ctx) {
  drawHexagons(ctx, 20);
}

function drawHexagons(ctx, num) {
  for (let i = 0; i < num; i++) {
    drawHexagon(ctx, i);
  }
}

function drawHexagon(ctx, idx) {
  const width = 25;
  const x = (idx + 1) * width;
  const y = width;

  const a = width / 4;
  const b = Math.sqrt(3) * a;

  // Draw hexagon
  ctx.beginPath();
  ctx.moveTo(x + 0, y + -2 * a);
  ctx.lineTo(x + b, y + -a);
  ctx.lineTo(x + b, y + a);
  ctx.lineTo(x + 0, y + 2 * a);
  ctx.lineTo(x + -b, y + a);
  ctx.lineTo(x + -b, y + -a);
  ctx.lineTo(x + 0, y + -2 * a);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}
