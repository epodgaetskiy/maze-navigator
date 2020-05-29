import React from "react";
import { Row } from "./styled";
import { Cell } from "./Cell";

export class Matrix extends React.PureComponent {
  checkCellByWay = (way, { x, y }) =>
    way.reduce((acc, path) => {
      if (path[0] === x && path[1] === y) {
        acc = true;
      }
      return acc;
    }, false);

  checkCellByUser = (user, { x, y }) => x === user.x && y === user.y;

  render() {
    const { matrix, way, isNoExitsMaze, user } = this.props;

    if (matrix.length === 0) {
      return null;
    }

    return matrix.map((rowData, positionY) => (
      <Row key={`y-${positionY}`}>
        {rowData.map((cellData, positionX) =>
          this.checkCellByUser(user, { x: positionX, y: positionY }) ? (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={
                !isNoExitsMaze &&
                this.checkCellByWay(way, { x: positionX, y: positionY })
              }
              userDirection={user.direction}
              isUser
            />
          ) : (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={
                !isNoExitsMaze &&
                this.checkCellByWay(way, { x: positionX, y: positionY })
              }
            />
          )
        )}
      </Row>
    ));
  }
}
