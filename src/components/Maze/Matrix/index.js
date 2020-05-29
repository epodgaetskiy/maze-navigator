import React from "react";
import { Row } from "./styled";
import { Cell } from "./Cell";

export class Matrix extends React.PureComponent {
  isWayPosition = (way, { x, y }) =>
    way.some((path) => path[0] === x && path[1] === y);

  isUserPosition = (user, { x, y }) => x === user.x && y === user.y;

  render() {
    const { matrix, way, isNoExitsMaze, user } = this.props;

    if (matrix.length === 0) {
      return null;
    }

    return matrix.map((rowData, positionY) => (
      <Row key={`y-${positionY}`}>
        {rowData.map((cellData, positionX) =>
          this.isUserPosition(user, { x: positionX, y: positionY }) ? (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={
                !isNoExitsMaze &&
                this.isWayPosition(way, { x: positionX, y: positionY })
              }
              userDirection={user.direction}
              isUser={this.isUserPosition(user, { x: positionX, y: positionY })}
            />
          ) : (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={
                !isNoExitsMaze &&
                this.isWayPosition(way, { x: positionX, y: positionY })
              }
            />
          )
        )}
      </Row>
    ));
  }
}
