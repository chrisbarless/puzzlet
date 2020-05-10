import { Grid } from './hexagon-grid';

describe('Hexagon Grid', () => {
  it('Builds a grid of hexagons', () => {
    // expect([...hexagons.length]).toBe(5765);
  });

  it('Gets a hex by x,y', () => {
    const grid = new Grid();
    expect(grid.getHexByPosition([0, 0]).bitNumber).toEqual(1);
    expect(grid.getHexByPosition([1, 0]).bitNumber).toEqual(2);
    expect(grid.getHexByPosition([0, 1]).bitNumber).toEqual(96);
    expect(grid.getHexByPosition([94, 60]).bitNumber).toEqual(5765);
  });
});
