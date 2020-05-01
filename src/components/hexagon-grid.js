import * as THREE from 'three';

// import Plane from './plane';
import Controls from './controls';

function HexagonGrid(renderer, scene, camera) {
  const hexCount = 5766;
  const rowLimit = 95;
  let soldIds = [];

  const geometry = new THREE.CircleBufferGeometry(1, 6);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  // new THREE.InstancedMesh(geometry, material, count)
  // const mesh = new Hexagon(hexCount);
  const mesh = new THREE.InstancedMesh(geometry, material, hexCount);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(1, 1);
  const transform = new THREE.Object3D();
  const instanceMatrix = new THREE.Matrix4();
  const matrix = new THREE.Matrix4();
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(0.1);
  const offsetX = rowLimit / 2;
  const offsetY = Math.floor(hexCount / rowLimit) / 2;

  const server = 'http://167.172.35.232';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;

  const getSold = () => {
    const oReq = new XMLHttpRequest();
    oReq.onreadystatechange = () => {
      if (this.readyState == 4 && this.status == 200) {
        soldIds = JSON.parse(this.responseText).soldIds;
      }
    };
    oReq.open('GET', endpoint);
    // oReq.send();
  };

  let column = 1;
  let row = 1;

  for (let hexIndex = 1; hexIndex < hexCount; hexIndex += 1) {
    const isEvenRow = row % 2 === 0;

    transform.position.setX(offsetX + -(column + (isEvenRow ? 0.5 : 0)));
    transform.position.setY(offsetY + -row);

    transform.updateMatrix();

    mesh.setMatrixAt(hexIndex, transform.matrix);

    if (column >= (isEvenRow ? rowLimit - 1 : rowLimit)) {
      column = 1;
      row += 1;
    } else {
      column += 1;
    }
  }

  scene.add(mesh);

  this.tick = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(mesh);

    if (intersection.length > 0) {
      const { instanceId } = intersection[0];

      mesh.getMatrixAt(instanceId, instanceMatrix);
      matrix.multiplyMatrices(instanceMatrix, rotationMatrix);

      mesh.setMatrixAt(instanceId, matrix);
      mesh.instanceMatrix.needsUpdate = true;
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
    const intersection = raycaster.intersectObject(mesh);

    if (intersection.length > 0) {
      const { instanceId } = intersection[0];

      window.location.href = `${server}/product/pusselbit/?attribute_pa_hex=${instanceId}`;
    }
  }

  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
}

export default HexagonGrid;
