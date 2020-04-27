import * as THREE from 'three';

const state = new Vector3([0, 0, 500]);

const moveLeft = () => state.setX(state.x - 10);

const Controls = (camera) => {
  camera.position.set(state);
};

export default Controls;
