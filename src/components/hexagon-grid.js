import { mat4, vec2, vec3 } from 'gl-matrix';

const correctedView = new Float32Array(16);
const canvasCenterMatrix = new Float32Array(16);
const gridCenterMatrix = new Float32Array(16);
const offset = mat4.create();

const scratchVec0 = new Float32Array(3);
const scratchVec1 = new Float32Array(3);
const scratchVec2 = new Float32Array(3);
const scratchVec3 = new Float32Array(3);

const canvasSize = new Float32Array(3);
const canvasCenter = new Float32Array(3);
const gridSize = new Float32Array(3);
const gridCenter = new Float32Array(3);

const triangleDegs = 60 * (Math.PI / 180);
const scaleFactor = Math.tan(triangleDegs / 2);
const verticalCorrection = Math.cos(30 * (Math.PI / 180));

const mousePosition = [0, 0];
let inputValue = -1;

function HexagonGrid(context, camera) {
  const { canvas } = context;

  // const baseUnit = canvas.width / 150;
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

  function getClosestHexagon() {
    let minDist = Infinity;
    let closest;

    vec2.transformMat4(
      scratchVec0,
      mousePosition,
      mat4.invert(correctedView, correctedView),
    );
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

    hovered = getClosestHexagon();

    canvas.style.cursor = hovered && !soldIds.includes(hovered.bitNumber) ? 'pointer' : 'default';
  }

  function onClick(event) {
    event.preventDefault();

    if (hovered && !soldIds.includes(hovered.bitNumber)) {
      window.location.href = `${server}/product/pusselbit/?bitnummer=${hovered.bitNumber}`;
    }
  }

  this.tick = () => {
    context.fillStyle = '#ffac8c';
    context.strokeStyle = '#ffffff';

    mat4.multiply(correctedView, offset, camera.view);

    const soldPieces = new Path2D();
    const selectedPieces = new Path2D();
    const unsoldPieces = new Path2D();

    hexagons.forEach((hexagon, bitNumber) => {
      let targetPath = unsoldPieces;
      if (inputValue === bitNumber) {
        targetPath = selectedPieces;
      } else if (soldIds.includes(bitNumber) || hovered === hexagon) {
        targetPath = soldPieces;
      }
      hexagon.vectors.forEach((vec, i) => {
        vec3.transformMat4(scratchVec0, vec, correctedView);
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

    mat4.getTranslation(scratchVec2, correctedView);
    mat4.getScaling(scratchVec3, correctedView);

    context.drawImage(
      img,
      scratchVec2[0],
      scratchVec2[1],
      columnLimit * scratchVec3[0],
      rowLimit * scratchVec3[1],
    );
    context.globalCompositeOperation = 'source-over';
    context.fill(unsoldPieces);
    context.stroke(unsoldPieces);

    context.strokeStyle = '#ff0000';
    context.stroke(selectedPieces);
  };

  let index = 1; // Linear counter
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

  // Find center points
  vec3.scale(canvasCenter, canvasSize, 0.5);
  vec3.scale(gridCenter, gridSize, 0.5 * camera.scaling);

  mat4.multiply(
    offset,
    mat4.fromTranslation(canvasCenterMatrix, canvasCenter),
    mat4.fromTranslation(gridCenterMatrix, vec3.negate(gridCenter, gridCenter)),
  );

  camera.setViewCenter(canvasCenter);

  if (!camera.isFake) {
    canvas.addEventListener('mousedown', () => {
      drag = false;
    });
    canvas.addEventListener('mouseup', (event) => !drag && onClick(event));
    canvas.addEventListener('mousemove', onMouseMove);
    document.getElementById('hexid').addEventListener('change', (event) => {
      const hexNumber = parseInt(event.target.value, 10);
      inputValue = hexNumber;
    });
    document
      .getElementById('goto-hex-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        if (inputValue < 1) return;
        const targetHex = hexagons.get(inputValue);
        const targetMatrix = new Float32Array(16);
        const targetZoom = 10;
        const vec = vec3.create();
        vec3.copy(vec, targetHex.position);
        // vec3.scale(vec, vec, 10);
        // vec3.negate(vec, vec);
        mat4.fromTranslation(targetMatrix, vec);
        mat4.multiply(targetMatrix, offset, targetMatrix);
        console.log(camera);
        mat4.scale(targetMatrix, targetMatrix, [
          targetZoom,
          targetZoom,
          targetZoom,
        ]);

        console.log(targetMatrix);
        camera.setView(targetMatrix);
        // camera.scale(50);
        console.log(camera.view);
      });
  }
}

export default HexagonGrid;
