import * as THREE from 'three';
import Hexagons from './hexagons';

function HexagonGrid(renderer, scene, camera) {
  const hexCount = 5766;
  const rowLimit = 95;
  const soldIds = ['2223'];

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(1, 1);
  const transform = new THREE.Object3D();
  const instanceMatrix = new THREE.Matrix4();
  const matrix = new THREE.Matrix4();
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(0.1);
  const hexagons = Hexagons(hexCount);
  const offsetX = rowLimit / 2;
  const offsetY = Math.floor(hexCount / rowLimit) / 2;

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

  let column = 1;
  let row = 1;

  for (let hexIndex = 1; hexIndex < hexCount; hexIndex += 1) {
    const isEvenRow = row % 2 === 0;

    transform.position.setX(offsetX + -(column + (isEvenRow ? 0.5 : 0)));
    transform.position.setY(offsetY + -row);

    transform.updateMatrix();

    hexagons.setMatrixAt(hexIndex, transform.matrix);

    if (column >= (isEvenRow ? rowLimit - 1 : rowLimit)) {
      column = 1;
      row += 1;
    } else {
      column += 1;
    }
  }

  scene.add(hexagons);

  this.tick = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(hexagons);

    if (intersection.length > 0) {
      const { instanceId } = intersection[0];

      hexagons.getMatrixAt(instanceId, instanceMatrix);
      matrix.multiplyMatrices(instanceMatrix, rotationMatrix);

      hexagons.setMatrixAt(instanceId, matrix);
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
