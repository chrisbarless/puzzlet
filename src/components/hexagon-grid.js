const { mat4, vec4 } = require('gl-matrix');

const rowLimit = 61;
const columnLimit = 95;

function Grid() {
  const hexagons = new Set();
  let index = 1;

  for (let y = 0; y < rowLimit; y += 1) {
    const isEvenRow = y % 2 === 0;
    for (let x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
      hexagons.add({
        bitNumber: index,
        position: [x, y],
        opacity: 1,
        isEvenRow,
      });
      index += 1;
    }
  }

  this.getHexByPosition = function ([x, y]) {
    const target = [...hexagons].find(({ position }) => {
      const t = position[0] === x && position[1] === y;
      return t;
    });
    return target;
  };
}

function HexagonGrid(context, camera) {
  const baseUnit = canvas ? canvas.width / 150 : 10;
  const mousePosition = [0, 0];
  // const { canvas } = context;

  let hovered;
  let soldIds = [];
  let drag = false;

  const server = 'https://bitforbit.notquite.se';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;

  const img = new Image();
  img.src = 'https://i.imgur.com/7KAE5M7.jpg';

  if (process.env.NODE_ENV === 'production') {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function receive() {
      if (this.readyState === 4 && this.status === 200) {
        soldIds = JSON.parse(this.responseText).soldIds;
      }
    };

    request.open('GET', endpoint);
    request.send();
  } else {
    soldIds = [2223];
  }

  context.fillStyle = '#ffac8c';
  context.strokeStyle = '#ffffff';

  const hexagonWidthFactor = 2 * Math.tan((30 * Math.PI) / 180);
  const hexagonHeightFactor = Math.cos(0.5);

  const getGridMousePos = () => {
    const scaling = baseUnit * camera.scaling;
    return [
      mousePosition[0]
        - canvas.width / 2
        + (columnLimit / 2) * scaling
        - camera.translation[0] / scaling,
      (mousePosition[1]
        - canvas.height / 2
        + (rowLimit / 2) * scaling
        - camera.translation[1] / scaling)
        * (1 / hexagonHeightFactor),
    ];
  };

  this.tick = () => {
    const scaling = baseUnit * camera.scaling;
    const a = (hexagonWidthFactor / 4) * scaling;
    const b = Math.sqrt(3) * a;
    const offset = {
      x:
        canvas.width / 2
        - (columnLimit / 2) * scaling
        + camera.translation[0] / scaling,
      y:
        canvas.height / 2
        - (rowLimit / 2) * scaling
        + camera.translation[1] / scaling,
    };

    const imageX = columnLimit * scaling;
    const imageY = rowLimit * hexagonHeightFactor * scaling;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    hexagons.forEach((hexagon) => {
      const { position, bitNumber } = hexagon;
      let targetPath = unsoldPieces;
      if (soldIds.includes(bitNumber) || hovered === hexagon) {
        targetPath = soldPieces;
      }
      let [x, y] = position.slice();
      if (y % 2 === 0) {
        x += 0.5;
      } else {
        x += 1;
      }
      x *= scaling;
      x += offset.x;
      y += hexagonHeightFactor / 2;
      y *= scaling * hexagonHeightFactor;
      y += offset.y;
      targetPath.moveTo(x + 0, y + -2 * a);
      targetPath.lineTo(x + b, y + -a);
      targetPath.lineTo(x + b, y + a);
      targetPath.lineTo(x + 0, y + 2 * a);
      targetPath.lineTo(x + -b, y + a);
      targetPath.lineTo(x + -b, y + -a);
      targetPath.lineTo(x + 0, y + -2 * a);
    });
    // context.closePath();
    // context.clip();
    context.fill(soldPieces);
    context.stroke(soldPieces);
    context.globalCompositeOperation = 'source-atop'; // picture clipped inside oval
    context.drawImage(img, offset.x, offset.y, imageX, imageY);
    context.globalCompositeOperation = 'source-over'; // the default
    context.fill(unsoldPieces);
    context.stroke(unsoldPieces);
  };

  const getRelativeMousePosition = (event) => {
    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    return [...mousePosition];
  };

  function onMouseMove(event) {
    event.preventDefault();
    getRelativeMousePosition(event);
    hovered = getClosestHexagon(getGridMousePos());
    canvas.style.cursor = hovered && !soldIds.includes(hovered.bitNumber) ? 'pointer' : 'default';
  }

  function onClick(event) {
    event.preventDefault();

    if (hovered && !soldIds.includes(hovered.bitNumber)) {
      window.location.href = `${server}/product/pusselbit/?bitnummer=${hovered.bitNumber}`;
    }
  }

  if (!camera.isFake) {
    document.addEventListener('mousedown', () => (drag = false));
    document.addEventListener('mousemove', () => (drag = true));
    document.addEventListener('mouseup', (event) => !drag && onClick(event));
    canvas.addEventListener('mousemove', onMouseMove);
  }
}

export { Grid };
export default HexagonGrid;
