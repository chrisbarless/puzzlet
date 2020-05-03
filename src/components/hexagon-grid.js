import * as THREE from 'three';
import Hexagons from './hexagons';
import Plane from './plane';

function HexagonGrid(renderer, scene, camera) {
  const hexCount = 5766;
  const rowLimit = 95;
  const soldIds = [2223];

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(1, 1);
  const transform = new THREE.Object3D();
  const instanceMatrix = new THREE.Matrix4();
  const matrix = new THREE.Matrix4();
  const rotationMatrix = new THREE.Matrix4().scale(new THREE.Vector3(0, 0, 0));
  const hexagons = Hexagons(hexCount);
  const columns = hexCount >= rowLimit ? rowLimit : hexCount;
  const rows = Math.ceil(hexCount / rowLimit);
  const offsetX = -columns / 2;
  const offsetY = rows / 2;

  const server = 'http://167.172.35.232';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;

  const oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function receive() {
    // console.log(this.readyState);
    // console.log(this.status);
    // debugger;
    if (this.readyState === 4 && this.status === 200) {
      const { soldIds } = JSON.parse(this.responseText);
    }
  };

  oReq.open('GET', endpoint);

  let hexIndex = 1;
  let column;
  let row;

  for (row = 1; row < rows; row += 1) {
    for (column = 1; column < columns; column += 1) {
      const isEvenRow = row % 2 === 0;

      if (column === columns - 1 && isEvenRow) {
        continue;
      }

      transform.position.setX(offsetX + (column + (isEvenRow ? 0.5 : 0)));
      transform.position.setY(offsetY + -row);

      transform.updateMatrix();

      hexagons.setMatrixAt(hexIndex, transform.matrix);

      hexIndex++;
    }
  }

  scene.add(hexagons);

  const plane = Plane(column, row);
  scene.add(plane);

  this.tick = () => {
    // Hide sold pieces
    if (soldIds.length) {
      soldIds.forEach((soldId) => {
        hexagons.getMatrixAt(soldId, instanceMatrix);
        matrix.multiplyMatrices(instanceMatrix, rotationMatrix);
        hexagons.setMatrixAt(soldId, matrix);
      });
      hexagons.instanceMatrix.needsUpdate = true;
    }

    // Mouseover (TODO)
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(hexagons);

    if (intersection.length > 0) {
      const { instanceId } = intersection[0];

      hexagons.getMatrixAt(instanceId, instanceMatrix);
      hexagons.instanceMatrix.needsUpdate = true;
    }
  };

  function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onClick(event) {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(hexagons);

    if (intersection.length > 0) {
      const { instanceId } = intersection[0];

      window.location.href = `${server}/product/pusselbit/?attribute_pa_hex=${instanceId}`;
    }
  }

  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
