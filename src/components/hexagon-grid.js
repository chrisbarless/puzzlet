import { mat4, vec2, vec3 } from 'gl-matrix';

const a = 1 / 4;
const b = Math.sqrt(3) * a;
const rad = Math.PI / 3;

const scratch0 = new Float32Array(16);
const scratch1 = new Float32Array(16);

const scratchVec0 = new Float32Array(3);
const scratchVec1 = new Float32Array(3);

const offset = mat4.create();

const canvasSize = new Float32Array(3);
const canvasCenter = new Float32Array(3);
const gridSize = new Float32Array(3);
const gridCenter = new Float32Array(3);

const scaleMatrix = new Float32Array(16);
const vertexRotationMatrix = new Float32Array(16);
const vertexTranslationMatrix = new Float32Array(16);

mat4.fromZRotation(vertexRotationMatrix, Math.PI / 3);
mat4.fromTranslation(vertexTranslationMatrix, [0, -1, 0]);
const horizontalScale = Math.cos(1);
const verticalScale = Math.tanh(1);
mat4.fromScaling(scaleMatrix, [horizontalScale, verticalScale, 1]);

console.log(vertexRotationMatrix);
console.log(vertexTranslationMatrix);

// const hexVecs = [
//   vec3.fromValues(b, -a, 1),
//   vec3.fromValues(b, a, 1),
//   vec3.fromValues(0, 2 * a, 1),
//   vec3.fromValues(-b, a, 1),
//   vec3.fromValues(-b, -a, 1),
//   vec3.fromValues(0, -2 * a, 1),
// ];

// const hexMatrices = [];

const hexScratch = [
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
];

const mousePosition = [0, 0];

function HexagonGrid(context, camera) {
  const { canvas } = context;

  const baseUnit = canvas.width / 150;
  const rowLimit = 61;
  const columnLimit = 95;
  let hovered;
  let soldIds = [];
  let drag = false;

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
      hexagons.set(index, {
        bitNumber: index,
        position: vec3.fromValues(
          x,
          y,
          1, // Opacity
        ),
        isEvenRow,
      });
      index += 1;
    }
  }

  vec3.set(canvasSize, canvas.width, canvas.height, 0);
  vec3.set(gridSize, columnLimit - 1, rowLimit - 1, 0);

  vec3.scale(canvasCenter, canvasSize, 0.5);
  vec3.scale(gridCenter, gridSize, 0.5);
  vec3.scale(gridCenter, gridCenter, baseUnit);
  vec3.negate(gridCenter, gridCenter);

  mat4.fromTranslation(scratch0, canvasCenter);
  mat4.fromTranslation(scratch1, gridCenter);

  mat4.multiply(offset, scratch0, scratch1);

  // camera.setScaleBounds([canvas.width / 150, canvas.width * 15]);
  camera.setView(offset);

  this.tick = () => {
    context.fillStyle = '#ffac8c';
    context.strokeStyle = '#ffffff';

    const { scaling, view } = camera;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    hexagons.forEach((hexagon, bitNumber) => {
      const { position, isEvenRow } = hexagon;
      let targetPath = unsoldPieces;
      if (soldIds.includes(bitNumber) || hovered === hexagon) {
        targetPath = soldPieces;
      }

      for (let i = 0; i <= 5; i++) {
        vec3.rotateZ(
          hexScratch[i],
          position,
          [position[0], position[1] - 0.5, position[2]],
          rad * i,
        );
        if (isEvenRow) {
          vec3.subtract(hexScratch[i], hexScratch[i], [0.5, 0, 0]);
        }
        vec3.scale(hexScratch[i], hexScratch[i], baseUnit);
        // vec3.transformMat4(hexScratch[i], hexScratch[i], scaleMatrix);
        vec3.transformMat4(hexScratch[i], hexScratch[i], view);
        vec3.ceil(hexScratch[i], hexScratch[i]);
      }

      if (bitNumber > 5000 && bitNumber < 5006) {
        // console.table(hexScratch);
        // debugger;
      }

      targetPath.moveTo(...hexScratch[0]);
      targetPath.lineTo(...hexScratch[1]);
      targetPath.lineTo(...hexScratch[2]);
      targetPath.lineTo(...hexScratch[3]);
      targetPath.lineTo(...hexScratch[4]);
      targetPath.lineTo(...hexScratch[5]);
      targetPath.lineTo(...hexScratch[0]);
    });

    context.fill(soldPieces);
    context.stroke(soldPieces);
    context.globalCompositeOperation = 'source-atop';
    context.drawImage(
      img,
      camera.translation[0],
      camera.translation[1],
      columnLimit * scaling * 10,
      rowLimit * scaling * 10,
    );
    context.globalCompositeOperation = 'source-over';
    context.fill(unsoldPieces);
    context.stroke(unsoldPieces);
  };

  function getClosestHexagon(position) {
    let minDist = Infinity;
    let closest;

    hexagons.forEach((hexagon) => {
      const thisDist = vec2.dist(hexagon.position, position);

      if (thisDist < minDist) {
        minDist = thisDist;
        closest = hexagon;
      }
    });

    return closest;
  }

  function onMouseMove(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    drag = true;
    mat4.invert(scratch0, camera.view);
    vec2.transformMat4(scratchVec0, mousePosition, scratch0);

    hovered = getClosestHexagon(scratchVec0);

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
