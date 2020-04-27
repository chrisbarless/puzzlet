import * as THREE from 'three';

const state = new THREE.Vector3(0, 0, 500);

const Controls = (camera) => {
  const update = () => camera.position.set(state);

  // document.getElementById('button-arrow-left', () => {
  //   state.setX(state.x - 10);
  //   update();
  // });

  update();
};

export default Controls;
