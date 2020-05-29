import PF from "pathfinding";

export const getShortestWay = (matrix, user, exits) => {
  try {
    const grid = new PF.Grid(matrix);
    const finder = new PF.AStarFinder();
    const pathes = exits.map((exit) =>
      finder.findPath(user.x, user.y, exit[0], exit[1], grid.clone())
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
};
