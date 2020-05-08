import { mat4, vec4 } from 'gl-matrix';

function HexagonGrid(context, camera) {
  const mousePosition = [0, 0];
  const { canvas } = context;

  const hexCount = 5765;
  const rowLimit = 61;
  const columnLimit = 95;
  let soldIds = [];

  const hexagons = new Set();

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

  let index = 1;

  for (let y = 0; y < rowLimit; y += 1) {
    const isEvenRow = y % 2 === 0;
    for (let x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
      hexagons.add({ bitNumber: index, position: [x, y], opacity: 1 });
      index += 1;
    }
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
        - canvas.height / 2
        + (rowLimit / 2) * scaling
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

    const imageX = columnLimit * scaling;
    const imageY = rowLimit * hexagonHeight * scaling;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    // context.beginPath();
    hexagons.forEach(({ position, bitNumber }) => {
      let targetPath = unsoldPieces;
      if (soldIds.includes(bitNumber)) {
        targetPath = soldPieces;
      }
      let [x, y] = position.slice();
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

  function getClosestHexagon(position) {
    const { scaling } = camera;
    const minDist = Infinity;
    let nearest;

    const closest = [
      Math.floor(position[0] / scaling),
      Math.floor(position[1] / scaling),
    ];

    const target = [...hexagons].find(({ position: targetPosition }) => {
      const t = targetPosition[0] === closest[0] && targetPosition[1] === closest[1];
      return t;
    });

    // console.log(position);
    return target;
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
    const closest = getClosestHexagon(getGridMousePos());
    canvas.style.cursor = closest ? 'pointer' : 'default';
  }

  function onClick(event) {
    event.preventDefault();
    const closest = getClosestHexagon(getGridMousePos());
    window.location.href = `${server}/product/pusselbit/?bitnummer=${closest.bitNumber}`;
  }
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
