import { mat4, vec2, vec3 } from 'gl-matrix';

const triangleDegs = 60 * (Math.PI / 180);
const scaleFactor = Math.tan(triangleDegs / 2);
const verticalCorrection = Math.cos(30 * (Math.PI / 180));

// Vectors
const scratchVec0 = vec3.create();
const scratchVec1 = vec3.create();
const scratchVec2 = vec3.create();
const scratchVec3 = vec3.create();
const canvasSize = vec3.create();
const canvasCenter = vec3.create();
const gridSize = vec3.create();
const gridCenter = vec3.create();

// Matrices
const scratch0 = mat4.create();
const scratch1 = mat4.create();
const scratch2 = mat4.create();
const canvasCenterMatrix = mat4.create();
const gridCenterMatrix = mat4.create();
const oddRowCorrectionMatrix = mat4.create();
const evenRowCorrectionMatrix = mat4.create();
const transformedView = mat4.create();
const viewTransformationMatrix = mat4.create();
const verticalCorrectionMatrix = mat4.create();

const hexidinput = document.getElementById('hexid');
const mousePosition = [0, 0];
let inputValue = -1;

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

  const vertexVectors = [0, 1, 2, 3, 4, 5, 0].map((i) => {
    const vertexVector = vec3.create();
    return vec3.rotateZ(
      vertexVector,
      vec3.fromValues(0, -scaleFactor * baseUnit, 0),
      [0, 0, 0],
      i * triangleDegs,
    );
  });

  function onMouseMove(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    let minDist = Infinity;
    let closest;
    drag = true;
    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    vec2.transformMat4(
      scratchVec2,
      mousePosition,
      mat4.invert(
        scratch1,
        mat4.multiply(scratch1, camera.view, viewTransformationMatrix),
      ),
    );

    hexagons.forEach((hexagon) => {
      const thisDist = vec2.dist(
        scratchVec2,
        mat4.getTranslation(scratchVec0, hexagon.matrix, hexagon.matrix),
      );

      if (thisDist < minDist) {
        minDist = thisDist;
        closest = hexagon;
      }
    });

    hovered = closest;

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

    const soldPieces = new Path2D();
    const selectedPieces = new Path2D();
    const unsoldPieces = new Path2D();

    inputValue = parseInt(hexidinput.value, 10);

    mat4.identity(scratch0);
    mat4.multiply(scratch0, camera.view, viewTransformationMatrix);
    // mat4.copy(transformedView, camera.view);

    hexagons.forEach((hexagon, bitNumber) => {
      let targetPath = unsoldPieces;
      if (inputValue === bitNumber) {
        targetPath = selectedPieces;
      } else if (soldIds.includes(bitNumber) || hovered === hexagon) {
        targetPath = soldPieces;
      }
      vertexVectors.forEach((vertex, i) => {
        // debugger;
        // mat4.multiply(scratch0, hexagon.matrix, scratch0);
        vec3.transformMat4(scratchVec0, vertex, hexagon.matrix);
        vec3.transformMat4(scratchVec0, scratchVec0, scratch0);
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

    mat4.getTranslation(scratchVec2, camera.view);
    mat4.getScaling(scratchVec3, camera.view);

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

  function buildHexagons() {
    let index = 1; // Linear counter
    for (let y = 0; y < rowLimit; y += 1) {
      const isEvenRow = y % 2 === 0;
      for (let x = 0; x < (isEvenRow ? columnLimit : columnLimit - 1); x += 1) {
        const matrix = mat4.fromTranslation(mat4.create(), [
          x * baseUnit,
          y * verticalCorrection * baseUnit,
          1,
        ]);
        mat4.multiply(
          matrix,
          matrix,
          isEvenRow ? evenRowCorrectionMatrix : oddRowCorrectionMatrix,
        );
        hexagons.set(index, {
          bitNumber: index,
          matrix,
        });
        index += 1;
      }
    }
  }

  function init() {
    // Cache canvas size
    vec3.set(canvasSize, canvas.width, canvas.height, 0);

    // Cache grid size
    vec3.set(gridSize, columnLimit - 1, rowLimit - 1, 0);
    vec3.scale(gridSize, gridSize, baseUnit);
    vec3.scale(gridCenter, gridSize, 0.5);

    // Find centers
    vec3.scale(canvasCenter, canvasSize, 0.5);
    vec3.scale(gridCenter, gridSize, 0.5);

    // Create transform matrices based on program state
    mat4.fromScaling(verticalCorrectionMatrix, [1, verticalCorrection, 1]);
    mat4.fromTranslation(oddRowCorrectionMatrix, [1 * baseUnit, 0, 0]);
    mat4.fromTranslation(evenRowCorrectionMatrix, [0.5 * baseUnit, 0, 0]);
    mat4.fromTranslation(
      canvasCenterMatrix,
      canvasCenter,
      vec3.scale(vec3.create(), canvasCenter, 1 / camera.scaling),
    );
    mat4.fromTranslation(
      gridCenterMatrix,
      vec3.negate(vec3.create(), gridCenter),
    );
    mat4.multiply(
      viewTransformationMatrix,
      gridCenterMatrix,
      canvasCenterMatrix,
    );

    camera.setViewCenter(canvasCenter);

    buildHexagons();

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
          if (inputValue < 1) return;
          const hexagon = hexagons.get(inputValue);
          mat4.multiply(
            camera.view,
            mat4.invert(scratch1, hexagon.matrix),
            mat4.fromTranslation(mat4.create(), gridCenter),
          );
        });
    }
  }

  init();
}

export default HexagonGrid;
