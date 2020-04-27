import * as THREE from 'three';

const state = [0, 0, 500];

const Controls = (camera) => {
  camera.position.set(state);
};

export default Controls;
