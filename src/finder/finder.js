import PF from "pathfinding";

export const getPath = (matrix, user, exit) => {
  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder();

  return finder.findPath(user.x, user.y, exit.x, exit.y, grid);
};
