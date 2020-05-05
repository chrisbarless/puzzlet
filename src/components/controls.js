const increment = 1;

function Controls(camera) {
  // Move Left
  document.getElementById('button-arrow-left').addEventListener('click', () => {
    camera.pan([-increment, 0]);
  });
  // Move Right
  document
    .getElementById('button-arrow-right')
    .addEventListener('click', () => {
      camera.pan([increment, 0]);
    });
  // Move Up
  document.getElementById('button-arrow-up').addEventListener('click', () => {
    camera.pan([0, increment]);
  });
  // Move Down
  document.getElementById('button-arrow-down').addEventListener('click', () => {
    camera.pan([0, -increment]);
  });
  // Zoom in
  document.getElementById('button-arrow-plus').addEventListener('click', () => {
    camera.zoom(2);
    // const zoomedVal = camera.position.z - increment;
    // zoomedVal > minZoom && camera.position.setZ(zoomedVal);
  });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', () => {
      camera.zoom(-2);
      // const zoomedVal = camera.position.z + increment;
      // zoomedVal < maxZoom && camera.position.setZ(zoomedVal);
    });
}

export default Controls;
