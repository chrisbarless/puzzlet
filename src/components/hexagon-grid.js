import { mat4, vec4 } from 'gl-matrix';

function HexagonGrid(context, camera) {
  const mousePosition = [0, 0];
  const { canvas } = context;

  const hexCount = 5765;
  const rowLimit = 61;
  const columnLimit = 95;
  let soldIds = [];

  const index = 1;
  let x;
  let y;

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

  // Get hexagon relative mouse position
  const getGridMousePos = () => {
    const { scaling } = camera;
    return [
      mousePosition[0]
        - canvas.width / 2
        + (columnLimit / 2) * scaling
        - camera.translation[0] / scaling,
      mousePosition[1]
        + canvas.height / 2
        - (rowLimit / 2) * scaling
        - camera.translation[1] / scaling,
    ];
  };

  this.tick = () => {
    const { scaling } = camera;
    const hexagonRealWidth = 2 * Math.tan((30 * Math.PI) / 180);
    const hexagonHeight = Math.cos(0.5);
    const a = (hexagonRealWidth / 4) * scaling;
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

    const imageX = x * scaling;
    const imageY = y * hexagonHeight * scaling;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    // context.beginPath();
    for (let row = 0; row < rowLimit; row += 1) {
      const isEvenRow = y % 2 === 0;
      for (
        let column = 0;
        column < (isEvenRow ? columnLimit : columnLimit - 1);
        column += 1
      ) {
        let targetPath = unsoldPieces;
        let x = column;
        let y = row;
        if (soldIds.includes(index)) {
          targetPath = soldPieces;
        }
        if (y % 2 === 0) {
          x += 0.5;
        } else {
          x += 1;
        }
        // y += hexagonHeight / 2;
        y += Math.tan(0.5);
        x *= scaling;
        x += offset.x;
        // y *= 1 - (hexagonRealWidth - hexagonHeight);
        y *= scaling * hexagonHeight;
        y += offset.y;
        targetPath.moveTo(x + 0, y + -2 * a);
        targetPath.lineTo(x + b, y + -a);
        targetPath.lineTo(x + b, y + a);
        targetPath.lineTo(x + 0, y + 2 * a);
        targetPath.lineTo(x + -b, y + a);
        targetPath.lineTo(x + -b, y + -a);
        targetPath.lineTo(x + 0, y + -2 * a);
        // if (index === columnLimit) {
        // debugger;
        // }
      }
    }
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

  function getClosestHexagon(x, y) {
    const { scaling } = camera;
    let minDist = Infinity;
    let nearest;
    // eslint-disable-next-line no-restricted-syntax
    for (const [hexIndex, hexagon] of hexagons) {
      const dist = Math.hypot(hexagon.x * scaling - x, hexagon.y * scaling - y);
      debugger;
      if (dist < minDist) {
        nearest = hexIndex;
        minDist = dist;
      }
    }
    return nearest;
  }

  const getRelativeMousePosition = (event) => {
    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    return [...mousePosition];
  };

  function onMouseMove(event) {
    event.preventDefault();
    getRelativeMousePosition(event);
    const [mouseX, mouseY] = getGridMousePos();
    console.log(mouseX, mouseY);
  }

  function onClick(event) {
    event.preventDefault();
    const closest = getClosestHexagon(...mousePosition);
    console.log(closest);
    // window.location.href = `${server}/product/pusselbit/?attribute_pa_hex=${closest}`;
    // alert(`${closest}`);
  }
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
