import { mat4, vec4 } from 'gl-matrix';
import Plane from './plane';

function HexagonGrid(context) {
  const hexagonWidth = 10;
  const hexCount = 5765;
  const rowLimit = 95;
  const hexRadius = Math.tan((30 * Math.PI) / 180);
  let soldIds = [];

  // const raycaster = new THREE.Raycaster();
  // const mouse = new THREE.Vector2(1, 1);
  // const transform = new THREE.Object3D();
  // const instanceMatrix = new THREE.Matrix4();
  // const matrix = new THREE.Matrix4();
  // const rotationMatrix = new THREE.Matrix4().scale(new THREE.Vector3(0, 0, 0));
  const hexagons = new Map();
  const columns = hexCount >= rowLimit ? rowLimit : hexCount;
  const rows = Math.ceil(hexCount / rowLimit);
  const offsetX = -columns / 2;
  const offsetY = rows / 2;

  const server = 'https://bitforbit.notquite.se';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;

  if (process.env.NODE_ENV === 'production') {
    // Or, `process.env.NODE_ENV !== 'production'` }
    const request = new XMLHttpRequest();
    request.onreadystatechange = function receive() {
      if (this.readyState === 4 && this.status === 200) {
        soldIds = JSON.parse(this.responseText).soldIds;
      }
    };

    request.open('GET', endpoint);
    request.send();
  } else {
    soldIds = ['2223'];
  }

  let hexIndex = 1;
  let column;
  let row;

  for (row = 1; row < rows; row += 1) {
    for (column = 1; column < columns; column += 1) {
      const isEvenRow = row % 2 === 0;

      if (column === columns - 1 && isEvenRow) {
        continue;
      }

      hexagons.set(hexIndex, { column, row });

      // transform.position.setX(offsetX + (column + (isEvenRow ? 0.5 : 0)));
      // transform.position.setY(offsetY + -row);

      // transform.updateMatrix();

      // hexagons.setMatrixAt(hexIndex, transform.matrix);

      hexIndex++;
    }
  }

  // scene.add(hexagons);

  // const plane = Plane(column, row);
  // scene.add(plane);

  this.tick = () => {
    hexagons.forEach(({ column, row }, index) => {
      const a = hexagonWidth / 4;
      const b = Math.sqrt(3) * a;
      const x = (column + 1) * hexagonWidth;
      const y = (row + 1) * hexagonWidth;
      // if (yIndex % 2 !== 0) {
      //   x += hexagonWidth / 2;
      // }
      context.beginPath();
      context.moveTo(x + 0, y + -2 * a);
      context.lineTo(x + b, y + -a);
      context.lineTo(x + b, y + a);
      context.lineTo(x + 0, y + 2 * a);
      context.lineTo(x + -b, y + a);
      context.lineTo(x + -b, y + -a);
      context.lineTo(x + 0, y + -2 * a);
      context.closePath();
      context.stroke();
      context.fillText(index, x, y);
    });
  };

  // hexagon.draw(context);
  // // Hide sold pieces
  // if (soldIds.length) {
  //   soldIds.forEach((soldId) => {
  //     hexagons.getMatrixAt(soldId, instanceMatrix);
  //     matrix.multiplyMatrices(instanceMatrix, rotationMatrix);
  //     hexagons.setMatrixAt(soldId, matrix);
  //   });
  //   hexagons.instanceMatrix.needsUpdate = true;
  // }
  // // Mouseover (TODO)
  // raycaster.setFromCamera(mouse, camera);
  // const intersection = raycaster.intersectObject(hexagons);
  // if (intersection.length > 0) {
  //   const { instanceId } = intersection[0];
  //   renderer.domElement.style.cursor = 'pointer';
  //   hexagons.getMatrixAt(instanceId, instanceMatrix);
  //   hexagons.instanceMatrix.needsUpdate = true;
  // } else {
  //   renderer.domElement.style.cursor = 'default';
  // }
}

//   function onMouseMove(event) {
//     event.preventDefault();

//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   function onClick(event) {
//     event.preventDefault();
//     raycaster.setFromCamera(mouse, camera);
//     const intersection = raycaster.intersectObject(hexagons);

//     if (intersection.length > 0) {
//       const { instanceId } = intersection[0];

//       window.location.href = `${server}/product/pusselbit/?attribute_pa_hex=${instanceId}`;
//     }
//   }

export default HexagonGrid;
