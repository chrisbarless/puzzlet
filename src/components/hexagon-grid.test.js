import Hexagons, { Grid } from './hexagon-grid';

describe('Hexagon Grid', () => {
  it('Builds a grid of hexagons', () => {
    // expect([...hexagons.length]).toBe(5765);
  });

  it('Gets a hex by x,y', () => {
    const grid = new Grid();
    expect(grid.getHexByPosition([0, 0]).bitNumber).toEqual(1);
  });
});
