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
  // camera.setViewCenter([200000000, 200]);
  // camera.setViewCenter([context.canvas.width / 2, context.canvas.height / 2]);
  // camera.refresh();
  // camera.setTarget([context.canvas.width / 2, context.canvas.height / 2]);

  this.tick = () => {
    const { scaling } = camera;
    const hexagonRealWidth = 2 * Math.tan((30 * Math.PI) / 180);
    const hexagonHeight = Math.cos(0.5);
    const a = (hexagonRealWidth / 4) * scaling;
    const b = Math.sqrt(3) * a;
    const offset = {
      x: 0,
      y: 0,
      // x: context.canvas.width / 2 - (x / 2) * scaling + camera.translation[0],
      // y: context.canvas.height / 2 - (y / 2) * scaling + camera.translation[1],
    };

    const imageX = x * scaling;
    const imageY = y * hexagonHeight * scaling;

    context.drawImage(img, offset.x, offset.y, imageX, imageY);

    hexagons.forEach(({ position }, index) => {
      if (soldIds.includes(index)) {
        return;
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
      context.beginPath();
      context.moveTo(x + 0, y + -2 * a);
      context.lineTo(x + b, y + -a);
      context.lineTo(x + b, y + a);
      context.lineTo(x + 0, y + 2 * a);
      context.lineTo(x + -b, y + a);
      context.lineTo(x + -b, y + -a);
      context.lineTo(x + 0, y + -2 * a);
      context.closePath();
      context.fillStyle = '#ffac8c';
      context.fill();
      context.strokeStyle = '#ffffff';
      context.stroke();
      // context.fillStyle = '#ff0000';
      // context.fillRect(x, y, 1, 1);
      // context.fillText(`${x},${y}`, x, y);
      if (index === columnLimit) {
        // debugger;
      }
    });
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
    // alert(`${server}/product/pusselbit/?attribute_pa_hex=${closest}`);
  }
  context.canvas.addEventListener('click', onClick);
  context.canvas.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
