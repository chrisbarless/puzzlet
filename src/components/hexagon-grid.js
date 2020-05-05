import { mat4, vec4 } from 'gl-matrix';

function HexagonGrid(context, camera) {
  const hexCount = 5765;
  const rowLimit = 95;
  const hexRadius = Math.tan((30 * Math.PI) / 180);
  let soldIds = [];

  const hexagons = new Map();
  const columns = hexCount >= rowLimit ? rowLimit : hexCount;
  const rows = Math.ceil(hexCount / rowLimit);

  const server = 'https://bitforbit.notquite.se';
  const endpoint = `${server}/wp-admin/admin-ajax.php?action=get_sold_hexes`;

  const img = new Image();
  img.src = 'https://i.imgur.com/7KAE5M7.jpg';

  if (process.env.NODE_ENV === 'production') {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function receive() {
      if (this.readyState === 4 && this.status === 200) {
        soldIds = JSON.parse(this.responseText).soldIds;
      }
    };

    request.open('GET', endpoint);
    request.send();
  } else {
    soldIds = [2223];
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

      hexIndex++;
    }
  }

  this.tick = () => {
    const { scaling } = camera;
    const hexagonWidth = 2 * hexRadius * scaling;
    const offset = {
      x: camera.translation[0] * scaling,
      y: camera.translation[1] * scaling,
    };

    context.drawImage(
      img,
      offset.x,
      offset.y,
      columns * scaling,
      rows * scaling,
    );

    hexagons.forEach(({ column, row }, index) => {
      if (soldIds.includes(index)) {
        return;
      }
      const a = hexagonWidth / 4;
      const b = Math.sqrt(3) * a;
      let x = column * hexagonWidth + camera.translation[0] * scaling;
      const y = row * hexagonWidth + camera.translation[1] * scaling;
      if (row % 2 !== 0) {
        x -= hexagonWidth / 2;
      }
      context.beginPath();
      context.moveTo(x + 0, y + -2 * a);
      context.lineTo(x + b, y + -a);
      context.lineTo(x + b, y + a);
      context.lineTo(x + 0, y + 2 * a);
      context.lineTo(x + -b, y + a);
      context.lineTo(x + -b, y + -a);
      context.lineTo(x + 0, y + -2 * a);
      context.closePath();
      context.fillStyle = '#ffac8c';
      context.fill();
      // context.fillText(index, x, y);
    });
  };
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
