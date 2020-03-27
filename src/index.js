import Camera from '../node_modules/camera/camera';

import HexagonGrid from './hexagon-grid';

import findRequestAnimationFrame from './utils';

const renderFrame = findRequestAnimationFrame();

class Main {
  constructor() {
    const hexagonGrid = new HexagonGrid(5765);

    this.canvas = document.getElementById('canvas');
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight);
    this.context = this.canvas.getContext('2d');
    this.camera = new Camera(this.context);
    this.objects = [];
    this.hexagons = this.objects.push(hexagonGrid);

    const resetViewport = () => {
      const [centerX, centerY] = hexagonGrid.getCenter();
      this.camera.moveTo(this.camera.worldToScreen(centerX, centerY));
      this.camera.zoomTo(1400.0);
    };

    window.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        const { pageX: x, pageY: y } = event;
        const closest = hexagonGrid.getClosestHexagon(x, y);

        this.camera.zoomTo(500);
        this.camera.moveTo(x, y);

        console.log(`Clicked at ${x},${y}`);
        console.log(`Nearest hexagon #${closest}`);
      },
      false,
    );

    document.getElementById('reset').addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetViewport();
      },
      false,
    );

    resetViewport();
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
