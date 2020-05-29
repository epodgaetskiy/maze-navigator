import PF from "pathfinding";

const PASS_VALUE = 0;

export class Finder {
  constructor(matrix) {
    this.grid = new PF.Grid(matrix);
    this.AStarFinder = new PF.AStarFinder();
    this.exits = this.calculateExits(matrix);
  }

  calculateExits(matrix) {
    const exits = [];
    const maxX = matrix[0].length - 1;
    const maxY = matrix.length - 1;

    matrix.forEach((row, oY) => {
      row.forEach((value, oX) => {
        if (value === PASS_VALUE) {
          if (
            ((oX === 0 || oX === maxX) && oY !== 0 && oY !== maxY) ||
            ((oY === 0 || oY === maxY) && oX !== 0 && oX !== maxX)
          ) {
            exits.push([oX, oY]);
          }
        }
      });
    });

    return exits;
  }

  getExists() {
    return this.exits;
  }

  getShortestWay(point) {
    try {
      const pathes = this.exits.map((exit) =>
        this.AStarFinder.findPath(
          point.x,
          point.y,
          exit[0],
          exit[1],
          this.grid.clone()
        )
      );

      if (pathes.length === 0) {
        return [];
      }

      const shortestWay = {
        way: pathes[0],
        length: pathes[0].length,
      };

      for (let i = 1; i < pathes.length; i++) {
        const currentPathLength = pathes[i].length;
        if (currentPathLength < shortestWay.length) {
          shortestWay.way = pathes[i];
          shortestWay.length = currentPathLength;
        }
      }
      return shortestWay.way;
    } catch (e) {
      return {
        error: e.message,
      };
    }
  }
}
