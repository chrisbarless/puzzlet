const { buildGrid } = require('./hexagon-grid.js');

test('buildGrid', () => {
  const hexagons = buildGrid();
  expect(hexagons.size).toBe(5765);
});
