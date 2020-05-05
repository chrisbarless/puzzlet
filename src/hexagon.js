function Hexagon(hexIndex, xIndex, yIndex, hexagonWidth) {
  let x = (xIndex + 1) * hexagonWidth;
  const y = (yIndex + 1) * hexagonWidth;

  if (yIndex % 2 !== 0) {
    x += hexagonWidth / 2;
  }

  this.hexIndex = hexIndex;
  this.hexagonWidth = hexagonWidth;
  this.xIndex = xIndex;
  this.yIndex = yIndex;
  this.x = x;
  this.y = y;

  this.draw = (context) => {
    const {
      x, y, hexIndex, hexagonWidth,
    } = this;
    const a = hexagonWidth / 4;
    const b = Math.sqrt(3) * a;
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
  };
}

export default Hexagon;
