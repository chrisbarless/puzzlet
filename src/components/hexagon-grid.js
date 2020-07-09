import { mat4, vec2, vec3 } from 'gl-matrix';

const scratch0 = new Float32Array(16);
const scratch1 = new Float32Array(16);

const scratchVec0 = new Float32Array(3);
const scratchVec1 = new Float32Array(3);

const offset = mat4.create();

const canvasSize = new Float32Array(3);
const canvasCenter = new Float32Array(3);
const gridSize = new Float32Array(3);
const gridCenter = new Float32Array(3);

const triangleDegs = 60 * (Math.PI / 180);
const scaleFactor = Math.tan(triangleDegs / 2);
const verticalCorrection = Math.cos(30 * (Math.PI / 180));

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

  this.tick = () => {
    context.fillStyle = '#ffac8c';
    context.strokeStyle = '#ffffff';

    const { view } = camera;

    const soldPieces = new Path2D();
    const unsoldPieces = new Path2D();

    hexagons.forEach((hexagon, bitNumber) => {
      let targetPath = unsoldPieces;
      if (soldIds.includes(bitNumber) || hovered === hexagon) {
        targetPath = soldPieces;
      }

      hexagon.vectors.forEach((vec, i) => {
        vec3.transformMat4(scratchVec0, vec, view);
        if (i === 0) {
          targetPath.moveTo(...scratchVec0);
        } else {
          targetPath.lineTo(...scratchVec0);
        }
      });
    });

    context.fill(soldPieces);
    context.stroke(soldPieces);
    context.globalCompositeOperation = 'source-atop';
    context.drawImage(
      img,
      camera.translation[0],
      camera.translation[1],
      columnLimit * camera.scaling,
      rowLimit * camera.scaling,
    );
    context.globalCompositeOperation = 'source-over';
    context.fill(unsoldPieces);
    context.stroke(unsoldPieces);
  };

  function getClosestHexagon() {
    let minDist = Infinity;
    let closest;

    mat4.invert(scratch0, camera.view);
    vec2.subtract(scratchVec0, scratchVec0, [1, verticalCorrection]);
    vec2.transformMat4(scratchVec0, mousePosition, scratch0);
    vec3.multiply(scratchVec0, scratchVec0, [1, 1 / verticalCorrection, 1]);

    hexagons.forEach((hexagon) => {
      vec3.add(scratchVec1, hexagon.position, [
        hexagon.isEvenRow ? 0.5 : 1,
        1,
        0,
      ]);
      const thisDist = vec2.dist(scratchVec0, scratchVec1);

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

    hovered = getClosestHexagon();

    canvas.style.cursor = hovered && !soldIds.includes(hovered.bitNumber) ? 'pointer' : 'default';
  }

  function onClick(event) {
    event.preventDefault();

    if (hovered && !soldIds.includes(hovered.bitNumber)) {
      window.location.href = `${server}/product/pusselbit/?bitnummer=${hovered.bitNumber}`;
    }
  }

  let index = 1;

  for (let y = 0; y < rowLimit; y += 1) {
    const isEvenRow = y % 2 === 0;
    for (let x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
      const position = vec3.fromValues(x, y, 1);
      const vectors = [0, 1, 2, 3, 4, 5, 0].map((i) => {
        const vec = vec3.clone(position);
        const vertexVector = new Float32Array(3);
        const origin = new Float32Array(3);
        vertexVector[1] = scaleFactor;
        vec3.rotateZ(vertexVector, vertexVector, origin, i * triangleDegs);

        if (!isEvenRow) {
          vec3.add(vec, vec, [1, verticalCorrection, 0]);
        } else {
          vec3.add(vec, vec, [0.5, verticalCorrection, 0]);
        }
        vec3.multiply(vec, vec, [1, verticalCorrection, 1]);
        vec3.add(vec, vec, vertexVector);
        return vec;
      });
      hexagons.set(index, {
        bitNumber: index,
        position,
        vectors,
        isEvenRow,
      });
      index += 1;
    }
  }

  vec3.set(canvasSize, canvas.width, canvas.height, 0);
  vec3.set(gridSize, columnLimit - 1, rowLimit - 1, 0);

  vec3.scale(canvasCenter, canvasSize, 0.5);
  vec3.scale(gridCenter, gridSize, 0.5);
  vec3.negate(gridCenter, gridCenter);

  mat4.fromTranslation(scratch0, canvasCenter);
  mat4.fromTranslation(scratch1, gridCenter);

  mat4.multiply(offset, scratch0, scratch1);

  // camera.setScaleBounds([canvas.width / 150, canvas.width * 15]);
  camera.setView(offset);
  camera.scale(baseUnit);

  if (!camera.isFake) {
    canvas.addEventListener('mousedown', () => {
      drag = false;
    });
    canvas.addEventListener('mouseup', (event) => !drag && onClick(event));
    canvas.addEventListener('mousemove', onMouseMove);
    document
      .getElementById('goto-hex-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        // event.target[0];
        const targetHex = hexagons.get(parseInt(event.target[0].value, 10));
        vec3.scale(scratchVec0, targetHex.position, 1 / baseUnit);

        camera.lookAt(scratchVec0, 1 / baseUnit);
      });
  }
}

export default HexagonGrid;
