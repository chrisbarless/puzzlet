import { mat4, vec2, vec3 } from 'gl-matrix';

function HexagonGrid(context, camera) {
  const ROW_LIMIT = 61;
  const COLUMN_LIMIT = 95;

  const { canvas } = context;
  const mousePosition = [0, 0];
  const hideControls = camera.puzzHideControls;
  const baseUnit = !hideControls
    ? canvas.width / 150 // Arbitrary
    : canvas.width / COLUMN_LIMIT;
  const server = 'https://bitforbit.notquite.se';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;
  const hexagons = new Map();
  const img = new Image();
  img.src = 'https://i.imgur.com/7KAE5M7.jpg';
  const hexidinput = document.getElementById('hexid');

  // Matrices
  const scratch0 = mat4.create();
  const scratch1 = mat4.create();
  const canvasCenterMatrix = mat4.create();
  const gridCenterMatrix = mat4.create();
  const oddRowCorrectionMatrix = mat4.create();
  const evenRowCorrectionMatrix = mat4.create();
  const viewTransformationMatrix = mat4.create();

  // Ratios
  const triangleDegs = 60 * (Math.PI / 180);
  const scaleFactor = Math.tan(triangleDegs / 2);
  const verticalCorrection = Math.cos(30 * (Math.PI / 180));

  // Vectors
  const scratchVec0 = vec3.create();
  const scratchVec1 = vec3.create();
  const scratchVec2 = vec3.create();
  const canvasSize = vec3.create();
  const canvasCenter = vec3.create();
  const gridSize = vec3.create();
  const gridCenter = vec3.create();
  const vertexVectors = [0, 1, 2, 3, 4, 5, 0].map((i) => {
    const vertexVector = vec3.create();
    return vec3.rotateZ(
      vertexVector,
      vec3.fromValues(0, -scaleFactor * baseUnit, 0),
      [0, 0, 0],
      i * triangleDegs,
    );
  });

  // State
  let hovered;
  let inputValue = -1;
  let soldIds = [];
  let drag = false;

  function onClick(event) {
    event.preventDefault();

    if (hovered && !soldIds.includes(hovered.bitNumber)) {
      window.location.href = `${server}/product/pusselbit/?bitnummer=${hovered.bitNumber}`;
    }
  }

  function onMouseMove(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    let minDist = Infinity;
    let closest;
    drag = true;
    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    // Get mouse position relative to grid
    vec2.transformMat4(
      scratchVec2,
      mousePosition,
      mat4.invert(
        scratch1,
        mat4.multiply(scratch1, camera.view, viewTransformationMatrix),
      ),
    );

    hexagons.forEach((hexagon) => {
      // Find closest hex by scaled distance
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

  function buildHexagonGrid() {
    let index = 1; // Linear counter
    for (let y = 0; y < ROW_LIMIT; y += 1) {
      const isEvenRow = y % 2 === 0;
      for (
        let x = 0;
        x < (isEvenRow ? COLUMN_LIMIT : COLUMN_LIMIT - 1);
        x += 1
      ) {
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

  function resetView() {
    // Cache canvas size
    vec3.set(canvasSize, canvas.width, canvas.height, 0);

    // Cache grid size
    vec3.set(gridSize, COLUMN_LIMIT - 1, ROW_LIMIT - 1, 0);
    vec3.scale(gridSize, gridSize, baseUnit);
    vec3.scale(gridCenter, gridSize, 0.5);

    // Find centers
    vec3.scale(canvasCenter, canvasSize, 0.5);
    vec3.scale(gridCenter, gridSize, 0.5);
    vec3.multiply(gridCenter, gridCenter, [1, verticalCorrection, 1]);

    // Create transform matrices based on program state
    mat4.fromTranslation(oddRowCorrectionMatrix, [0.5 * baseUnit, 0, 0]);
    mat4.fromTranslation(evenRowCorrectionMatrix, [0 * baseUnit, 0, 0]);
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
  }

  function setupListeners() {
    if (hideControls) {
      return;
    }
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
          // Place hexagon in middle of camera view
          mat4.invert(scratch1, hexagon.matrix),
          mat4.fromTranslation(mat4.create(), gridCenter),
        );
        camera.scale(4);
      });
  }

  function startFetching() {
    if (process.env.NODE_ENV !== 'production') {
      soldIds = [2223];
      return;
    }

    // Request sold hexes
    const request = new XMLHttpRequest();
    request.onreadystatechange = function receive() {
      if (this.readyState === 4 && this.status === 200) {
        soldIds = JSON.parse(this.responseText).soldIds;
      }
    };

    // Recursively check sold hexes every minute
    const refreshHexes = () => {
      request.open('GET', endpoint);
      request.send();
      setTimeout(refreshHexes, 60 * 1000);
    };

    refreshHexes();
  }

  this.tick = () => {
    const selectedPieces = new Path2D();
    const imagePieces = new Path2D();
    const emptyPieces = new Path2D();

    context.fillStyle = '#ffac8c';

    inputValue = !hideControls ? parseInt(hexidinput.value, 10) : -1;

    mat4.identity(scratch0);
    mat4.multiply(scratch0, camera.view, viewTransformationMatrix);

    hexagons.forEach((hexagon, bitNumber) => {
      let targetPath = emptyPieces;
      if (inputValue === bitNumber) {
        targetPath = selectedPieces;
      } else if (
        soldIds.includes(bitNumber)
        || hovered === hexagon
        || bitNumber === inputValue
      ) {
        targetPath = imagePieces;
      }
      vertexVectors.forEach((vertex, i) => {
        vec3.transformMat4(scratchVec0, vertex, hexagon.matrix);
        vec3.transformMat4(scratchVec0, scratchVec0, scratch0);
        if (i === 0) {
          targetPath.moveTo(...scratchVec0);
        } else {
          targetPath.lineTo(...scratchVec0);
        }
      });
    });

    context.strokeStyle = '#ffffff';
    context.fill(imagePieces);
    context.fill(selectedPieces);

    context.strokeStyle = '#ff0000';

    // Start drawing
    context.globalCompositeOperation = 'source-atop';

    vec3.zero(scratchVec1);

    // Should be a matrix
    vec3.subtract(scratchVec1, scratchVec1, [0, baseUnit, 0]);
    vec3.transformMat4(
      scratchVec1,
      scratchVec1,
      mat4.invert(scratch1, oddRowCorrectionMatrix),
    );
    vec3.transformMat4(scratchVec1, scratchVec1, scratch0);

    context.drawImage(
      img,
      scratchVec1[0],
      scratchVec1[1],
      COLUMN_LIMIT * baseUnit * camera.scaling,
      (ROW_LIMIT + verticalCorrection)
        * baseUnit
        * verticalCorrection
        * camera.scaling,
    );

    // Stop drawing
    context.globalCompositeOperation = 'source-over';

    context.strokeStyle = '#ffffff';
    context.stroke(emptyPieces);

    context.strokeStyle = '#ff0000';
    context.stroke(selectedPieces);
  };

  resetView();
  buildHexagonGrid();
  setupListeners();
  startFetching();
}

export default HexagonGrid;
