import { mat4, vec4 } from 'gl-matrix';

function HexagonGrid(context, camera) {
  const mousePosition = [0, 0];

  // Get a copy of the current mouse position
  const getMousePos = () => mousePosition.slice();

  const getNdcX = (x) => -1 + (x / context.canvas.width) * 2;
  const getNdcY = (y) => 1 + (y / context.canvas.height) * -2;

  // Get relative WebGL position
  const getMouseGlPos = () => [
    getNdcX(mousePosition[0]),
    getNdcY(mousePosition[1]),
  ];

  const hexCount = 5765;
  const rowLimit = 61;
  const columnLimit = 95;
  let soldIds = [];

  const hexagons = new Map();

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

  let hexIndex = 1;
  let x;
  let y;

  for (y = 0; y < rowLimit; y += 1) {
    const isEvenRow = y % 2 === 0;
    for (x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
      hexagons.set(hexIndex, { position: [x, y] });
      hexIndex += 1;
    }
  }

  // camera.scale(10);
  // camera.scale(5);
  // console.log(x, y);
  // camera.lookAt([(x * 10) / 2, y / 2], 0.1);
  // camera.setViewCenter([columnLimit / 2, rowLimit / 2]);
  camera.setViewCenter([context.canvas.width / 2, -context.canvas.height / 2]);
  // camera.refresh();
  // camera.setTarget([context.canvas.width / 2, context.canvas.height / 2]);

  context.fillStyle = '#ffac8c';
  context.strokeStyle = '#ffffff';

  this.tick = () => {
    const { scaling } = camera;
    const hexagonRealWidth = 2 * Math.tan((30 * Math.PI) / 180);
    const hexagonHeight = Math.cos(0.5);
    const a = (hexagonRealWidth / 4) * scaling;
    const b = Math.sqrt(3) * a;
    const offset = {
      x:
        context.canvas.width / 2
        - (columnLimit / 2) * scaling
        + camera.translation[0] / scaling,
      y:
        context.canvas.height / 2
        - (rowLimit / 2) * scaling
        + camera.translation[1] / scaling,
    };

    const imageX = x * scaling;
    const imageY = y * hexagonHeight * scaling;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    // context.beginPath();
    hexagons.forEach(({ position }, index) => {
      let targetPath = unsoldPieces;
      if (soldIds.includes(index)) {
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

  function getClosestHexagon(x, y) {
    let minDist = Infinity;
    let nearest;
    // eslint-disable-next-line no-restricted-syntax
    for (const [hexIndex, hexagon] of hexagons) {
      const dist = Math.hypot(
        hexagon.x * camera.scaling - x,
        hexagon.y * camera.scaling - y,
      );
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
    const [mouseX, mouseY] = getMouseGlPos();
    // console.log(mouseX, mouseY, ...mousePosition);
  }

  function onClick(event) {
    event.preventDefault();
    const closest = getClosestHexagon(event.clientX, event.clientY);
    // window.location.href = `${server}/product/pusselbit/?attribute_pa_hex=${closest}`;
    // alert(`${closest}`);
  }
  context.canvas.addEventListener('click', onClick);
  context.canvas.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
