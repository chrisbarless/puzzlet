import Camera from '../node_modules/camera/camera';

import HexagonGrid from './hexagon-grid';

import findRequestAnimationFrame from './utils';

const renderFrame = findRequestAnimationFrame();

class Main {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight);
    this.context = this.canvas.getContext('2d');
    this.camera = new Camera(this.context);
    this.objects = [];

    const hexagonGrid = new HexagonGrid(5765);
    this.hexagons = this.objects.push(hexagonGrid);

    window.addEventListener(
      'click',
      (event) => {
        const { x, y } = this.camera.screenToWorld(event.pageX, event.pageY);
        const closest = hexagonGrid.getClosestHexagon(x, y);
        alert(closest); // eslint-disable-line no-alert
      },
      false,
    );
  }

  // Update each item in the game
  updateScene() {
    this.objects.forEach((item) => {
      if (item.tick) {
        item.tick();
      }
    });
  }

  // Draw each item in the game
  drawScene() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.camera.begin();
    this.objects.forEach((item) => {
      if (item.draw) {
        item.draw(this.context);
      }
    });
    this.camera.end();
  }

  // Main game loop
  tick() {
    this.updateScene();
    this.drawScene();
    renderFrame(() => {
      this.tick();
    });
  }

  start() {
    // Start the game ticking
    renderFrame(() => {
      this.tick();
    });
  }
}

new Main().start();
