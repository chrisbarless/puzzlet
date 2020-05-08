import createDom2dCamera from 'dom-2d-camera';
import { mat4, vec4 } from 'gl-matrix';

let camera;

// const scratch = new Float32Array(16);
const increment = 10;
function Camera(canvas) {
  const cameraLog = CameraDebugger();

  camera = createDom2dCamera(canvas, {
    // target: [5, 1],
    // target: [-96 / 2, -61 / 2],
    // target: [canvas.width / 2, canvas.height / 2],
    scaleBounds: [10, 100],
    panSpeed: 10,
    isNdc: false,
    isRotate: false,
    onWheel: cameraLog,
    onMouseUp: cameraLog,
  });
  camera.refresh();
  // camera.lookAt([canvas.width / 2, canvas.height / 2], 0.1);

  // <div id="controls" class="buttonwrapper">
  // <button id="button-arrow-up" class="button">&uarr;</button>
  // <button id="button-arrow-left" class="button">&larr;</button>
  // <button id="button-arrow-right" class="button">&rarr;</button>
  // <button id="button-arrow-down" class="button">&darr;</button>
  // <button id="button-arrow-plus" class="button">&plus;</button>
  // <button id="button-arrow-minus" class="button">&minus;</button>
  // </div>
  const controlWrap = document.createElement('div');
  controlWrap.id = 'controls';
  controlWrap.className = 'buttonwrapper';
  document.body.appendChild(controlWrap);

  // Move Left
  const leftButton = document
    .createElement('button');
  leftButton.id = 'button-arrow-left';
  leftButton.className = 'button';
  leftButton.innerText = 'V';
  leftButton.addEventListener('click', (event) => {
    event.preventDefault();
    camera.translate([increment * camera.scaling, 0]);
  });
  controlWrap.appendChild(leftButton);

  // Move Right
  const rightButton = document
    .createElement('button');
  rightButton.id = 'button-arrow-right';
  rightButton.className = 'button';
  rightButton.innerText = 'H';
  rightButton.addEventListener('click', (event) => {
    event.preventDefault();
    camera.translate([-increment * camera.scaling, 0]);
  });
  controlWrap.appendChild(rightButton);

  // Move Up
  const upButton = document
    .createElement('button');
  upButton.id = 'button-arrow-up';
  upButton.className = 'button';
  upButton.innerText = 'U';
  upButton.addEventListener('click', (event) => {
    event.preventDefault();
    camera.translate([0, increment * camera.scaling]);
  });
  controlWrap.appendChild(upButton);

  // Move Down
  const downButton = document
    .createElement('button');
  downButton.id = 'button-arrow-down';
  downButton.className = 'button';
  downButton.innerText = 'N';
  downButton.addEventListener('click', (event) => {
    event.preventDefault();
    camera.translate([0, -increment * camera.scaling]);
  });
  controlWrap.appendChild(downButton);

  // Zoom in
  const plusButton = document
    .createElement('button');
  plusButton.id = 'button-arrow-plus';
  plusButton.className = 'button';
  plusButton.innerText = '+';
  plusButton.addEventListener('click', (event) => {
    event.preventDefault();
    // const zoomedVal = camera.position.z - increment;
    // zoomedVal > minZoom && camera.position.setZ(zoomedVal);
  });
  controlWrap.appendChild(plusButton);

  // Zoom out
  const minusButton = document
    .createElement('button');
  minusButton.id = 'button-arrow-minus';
  minusButton.className = 'button';
  minusButton.innerText = '–';
  minusButton.addEventListener('click', (event) => {
    event.preventDefault();
    // const zoomedVal = camera.position.z + increment;
    // zoomedVal < maxZoom && camera.position.setZ(zoomedVal);
  });
  controlWrap.appendChild(minusButton);

  return camera;
}

function CameraDebugger() {
  if (process.env.NODE_ENV === 'production') return null;

  return () => {
    console.clear();
    const { view } = camera;
    for (const key in camera) {
      if (
        [
          'translation',
          'target',
          'scaling',
          'distance',
          // 'view',
          'viewCenter',
        ].includes(key)
      ) {
        console.log(key);
        console.log(camera[key]);
      }
    }
    // console.dir(view);
    console.log(view[0], view[1], view[2], view[3]);
    console.log(view[4], view[5], view[6], view[7]);
    console.log(view[8], view[9], view[10], view[11]);
    console.log(view[12], view[13], view[14], view[15]);
  };
}

export default Camera;
