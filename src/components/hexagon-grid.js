import {
  mat4, vec2, vec3, vec4,
} from 'gl-matrix';

const scratch0 = new Float32Array(16);
const scratch1 = new Float32Array(16);
const scratch2 = new Float32Array(16);

const scratchV0 = vec3.create();
const scratchV1 = vec3.create();

const offset = mat4.create();

const canvasSize = vec3.create();
const canvasCenter = vec3.create();
const gridSize = vec3.create();
const gridCenter = vec3.create();

const mousePosition = [0, 0];

function HexagonGrid(context, camera) {
  const { canvas } = context;

  const baseUnit = canvas.width / 150;
  const hexCount = 5765;
  const rowLimit = 61;
  const columnLimit = 95;
  let hovered;
  let soldIds = [];
  let drag = false;

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

    const refreshHexes = () => {
      request.open('GET', endpoint);
      request.send();
      setTimeout(refreshHexes, 60 * 1000);
    };
    refreshHexes();
  } else {
    soldIds = [2223];
  }

  let index = 1;

  for (let y = 0; y < rowLimit; y += 1) {
    const isEvenRow = y % 2 === 0;
    for (let x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
      hexagons.add({
        bitNumber: index,
        position: [x, y],
        vector: vec3.fromValues(
          x,
          y,
          1, // Opacity
        ),
        isEvenRow,
      });
      index += 1;
    }
  }

  const hexagonWidthFactor = 2 * Math.tan((30 * Math.PI) / 180);
  const hexagonHeightFactor = Math.cos(0.5);

  const getGridMousePos = () => [
    mousePosition[0],
    -camera.translation[0],
    mousePosition[1],
    -camera.translation[1],
  ];

  vec3.set(canvasSize, canvas.width, canvas.height, 0);
  vec3.set(gridSize, columnLimit - 1, rowLimit - 1, 0);

  vec3.scale(canvasCenter, canvasSize, 0.5);

  vec3.scale(gridCenter, gridSize, 0.5);
  vec3.negate(scratchV0, gridCenter);
  vec3.scale(scratchV1, scratchV0, baseUnit);

  mat4.fromTranslation(scratch0, canvasCenter);
  mat4.fromTranslation(scratch2, scratchV1);

  mat4.multiply(offset, scratch0, scratch2);

  camera.setView(offset);

  this.tick = () => {
    const scaling = baseUnit * camera.scaling;
    const a = (hexagonWidthFactor / 4) * scaling;
    const b = Math.sqrt(3) * a;
    const offset = {
      x: camera.translation[0],
      y: camera.translation[1],
    };

    const imageX = columnLimit * scaling;
    const imageY = rowLimit * hexagonHeightFactor * scaling;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    context.fillStyle = '#ffac8c';
    context.strokeStyle = '#ffffff';

    // context.beginPath();
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
      // y *= 1 - (hexagonWidthFactor - hexagonHeightFactor);
      y += hexagonHeightFactor / 2;
      // y += 0.5;
      y *= scaling * hexagonHeightFactor;
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
    const scaling = baseUnit * camera.scaling;

    const closest = [
      Math.floor(position[0] / scaling),
      Math.floor(position[1] / scaling),
    ];

    const target = [...hexagons].find(({ position: targetPosition }) => {
      const t = targetPosition[0] === closest[0] && targetPosition[1] === closest[1];
      return t;
    });

    return target;
  }

  const getRelativeMousePosition = (event) => {
    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    // return mousePosition.set();
  };

  function onMouseMove(event) {
    drag = true;
    event.preventDefault();
    getRelativeMousePosition(event);
    const gridMousePos = getGridMousePos();
    hovered = getClosestHexagon(gridMousePos);

    mat4.invert(scratch0, camera.view);
    vec2.transformMat4(scratchV0, mousePosition, scratch0);

    // console.table({ mousePosition, gridMousePos, scratchV0 });
    canvas.style.cursor = hovered && !soldIds.includes(hovered.bitNumber) ? 'pointer' : 'default';
  }

  function onClick(event) {
    event.preventDefault();

    if (hovered && !soldIds.includes(hovered.bitNumber)) {
      window.location.href = `${server}/product/pusselbit/?bitnummer=${hovered.bitNumber}`;
    }
  }

  if (!camera.isFake) {
    canvas.addEventListener('mousedown', () => (drag = false));
    canvas.addEventListener('mouseup', (event) => !drag && onClick(event));
    canvas.addEventListener('mousemove', onMouseMove);
  }
}

export default HexagonGrid;
