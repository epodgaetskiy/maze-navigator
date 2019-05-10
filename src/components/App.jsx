import React from "react";
import Row from "./Row";
import Cell from "./Cell";
import { getPath } from "../finder/finder";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const initialMatrix = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "#", "#", "#", "#", "#", " ", "#"],
  ["#", " ", " ", "#", " ", " ", " ", "#", " ", "#"],
  ["#", " ", " ", "#", "v", " ", " ", "#", " ", "#"],
  ["#", " ", " ", "#", "#", "#", " ", "#", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", "#", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", " ", "#"]
];

const actionByCurrentUserDirection = {
  top: {
    top: "forward",
    bottom: "around",
    left: "right",
    right: "left"
  },
  bottom: {
    top: "around",
    bottom: "forward",
    left: "left",
    right: "right"
  },
  left: {
    top: "left",
    bottom: "right",
    left: "forward",
    right: "around"
  },
  right: {
    top: "right",
    bottom: "left",
    left: "around",
    right: "forward"
  }
};

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      ...this.getInitialState(),
      step: 0
    };

    this.snapshotUserSteps = this.getSnapshotUserSteps();
  }

  getDirectionUserBySymbol = symbol => {
    switch (symbol) {
      case ">":
        return "right";
      case "<":
        return "left";
      case "^":
        return "top";
      case "v":
        return "bottom";
      default:
        return "bottom";
    }
  };

  // getSteps = (way, initialUserDirection) =>
  //   way.reduce((acc, [currentX, currentY], index, paths) => {
  //     if (
  //       currentX === paths[index + 1][0] &&
  //       currentY === paths[index + 1][1] + 1
  //     ) {
  //       acc[index] = {
  //         action: actionByUserDirection["top"][initialUserDirection],
  //         nextPosition: {
  //           x: paths[index + 1][0],
  //           y: paths[index + 1][1]
  //         }
  //       };
  //     }
  //     return acc;
  //   }, {});

  getInitialState = () => {
    const matrix = [];
    const user = {};
    const exits = [];
    initialMatrix.forEach((row, oY) => {
      matrix[oY] = row.map((item, oX) => {
        if (item === " " && (oY === 0 || oY === 7)) {
          exits.push([oX, oY]);
        }
        if (item === " " && (oY !== 0 && oY !== 7 && (oX === 0 || oX === 9))) {
          exits.push([oX, oY]);
        }
        switch (item) {
          case "#":
            return 1;
          case " ":
            return 0;
          default:
            user.x = oX;
            user.y = oY;
            user.direction = this.getDirectionUserBySymbol(item);
            return 0;
        }
      });
    });

    const way = getPath(
      matrix,
      { x: user.x, y: user.y },
      { x: exits[0][0], y: exits[0][1] }
    );
    return {
      matrix,
      user,
      way
    };
  };

  getNeedAction = (currentStep, user, way) => {
    let needMoving = "";
    if (
      way[currentStep][0] === way[currentStep + 1][0] &&
      way[currentStep][1] - 1 === way[currentStep + 1][1]
    ) {
      needMoving = "top";
    }
    if (
      way[currentStep][0] === way[currentStep + 1][0] &&
      way[currentStep][1] + 1 === way[currentStep + 1][1]
    ) {
      needMoving = "bottom";
    }
    if (
      way[currentStep][0] - 1 === way[currentStep + 1][0] &&
      way[currentStep][1] === way[currentStep + 1][1]
    ) {
      needMoving = "left";
    }
    if (
      way[currentStep][0] + 1 === way[currentStep + 1][0] &&
      way[currentStep][1] === way[currentStep + 1][1]
    ) {
      needMoving = "right";
    }

    const actionType = actionByCurrentUserDirection[needMoving][user.direction];
    return {
      type: actionType,
      action:
        actionType !== "forward"
          ? {
              user: {
                ...user,
                direction: needMoving
              },
              currentStep
            }
          : {
              user: {
                ...user,
                x: way[currentStep + 1][0],
                y: way[currentStep + 1][1]
              },
              currentStep: currentStep + 1
            }
    };
  };

  getSnapshotUserSteps = () => {
    const snapshotUserSteps = [];
    let currentStep = 0;
    let user = { ...this.state.user };
    let way = [...this.state.way];

    while (currentStep < way.length - 1) {
      const iteration = this.getNeedAction(currentStep, user, way);
      currentStep = iteration.action.currentStep;
      user = iteration.action.user;
      snapshotUserSteps.push(iteration);
    }

    const getNumberRepeatingForwardAction = (currentIndex, items, n) => {
      if (currentIndex < items.length - 1) {
        if (items[currentIndex + 1].type === "forward") {
          return getNumberRepeatingForwardAction(
            currentIndex + 1,
            items,
            n + 1
          );
        } else {
          return {
            ...items[currentIndex],
            n
          };
        }
      } else {
        return {
          ...items[currentIndex],
          n
        };
      }
    };
    const optimezeSnapshotUserSteps = [];
    let i = 0;
    while (i < snapshotUserSteps.length) {
      if (snapshotUserSteps[i].type !== "forward") {
        optimezeSnapshotUserSteps.push(snapshotUserSteps[i]);
        i = i + 1;
      } else {
        const item = getNumberRepeatingForwardAction(i, snapshotUserSteps, 1);
        optimezeSnapshotUserSteps.push(item);
        i = i + item.n;
      }
    }

    return optimezeSnapshotUserSteps;
  };

  checkCellByUser = (positionX, positionY) =>
    positionX === this.state.user.x && positionY === this.state.user.y;

  checkCellByWay = (positionX, positionY) =>
    this.state.way.reduce((acc, path) => {
      if (path[0] === positionX && path[1] === positionY) {
        acc = true;
      }
      return acc;
    }, false);

  // changeUserDirection = direction => () => {
  //   this.setState(state => ({
  //     user: {
  //       ...state.user,
  //       direction
  //     }
  //   }));
  // };

  // moveUserToNextStep = currentStep => () => {
  //   this.setState(state => ({
  //     user: {
  //       ...state.user,
  //       x: state.way[currentStep + 1][0],
  //       y: state.way[currentStep + 1][1]
  //     },
  //     currentStep: currentStep + 1
  //   }));
  // };

  // getNeedAction = (currentStep, currentUserDirection, way) => {
  //   let needMoving = "";
  //   if (
  //     way[currentStep][0] === way[currentStep + 1][0] &&
  //     way[currentStep][1] - 1 === way[currentStep + 1][1]
  //   ) {
  //     needMoving = "top";
  //   }
  //   if (
  //     way[currentStep][0] === way[currentStep + 1][0] &&
  //     way[currentStep][1] + 1 === way[currentStep + 1][1]
  //   ) {
  //     needMoving = "bottom";
  //   }
  //   if (
  //     way[currentStep][0] - 1 === way[currentStep + 1][0] &&
  //     way[currentStep][1] === way[currentStep + 1][1]
  //   ) {
  //     needMoving = "left";
  //   }
  //   if (
  //     way[currentStep][0] + 1 === way[currentStep + 1][0] &&
  //     way[currentStep][1] === way[currentStep + 1][1]
  //   ) {
  //     needMoving = "right";
  //   }

  //   const actionType =
  //     actionByCurrentUserDirection[needMoving][currentUserDirection];
  //   return {
  //     type: actionType,
  //     action:
  //       actionType !== "forward"
  //         ? this.changeUserDirection(needMoving)
  //         : this.moveUserToNextStep(currentStep)
  //   };
  // };

  renderMatrix = matrix =>
    matrix.map((rowData, positionY) => (
      <Row key={`y-${positionY}`}>
        {rowData.map((cellData, positionX) =>
          this.checkCellByUser(positionX, positionY) ? (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={this.checkCellByWay(positionX, positionY)}
              userDirection={this.state.user.direction}
              isUser
            />
          ) : (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={this.checkCellByWay(positionX, positionY)}
            />
          )
        )}
      </Row>
    ));

  handleClickAction = action => () => {
    this.setState(state => ({
      ...action,
      step: state.step + 1
    }));
  };

  render() {
    const { matrix, step } = this.state;
    console.log(this.snapshotUserSteps);
    console.log(step);
    const snapshotUserStep = this.snapshotUserSteps[step];
    return (
      <Container>
        <div>{matrix.length > 0 && this.renderMatrix(matrix)}</div>
        {snapshotUserStep ? (
          <div style={{ marginLeft: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <button
                type="button"
                disabled={snapshotUserStep.type !== "forward"}
                onClick={this.handleClickAction(snapshotUserStep.action)}
              >
                Go {snapshotUserStep.n}{" "}
                {`step${snapshotUserStep.n > 1 ? "s" : ""}`} forward
              </button>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <button
                type="button"
                disabled={snapshotUserStep.type !== "around"}
                onClick={this.handleClickAction(snapshotUserStep.action)}
              >
                Turn around
              </button>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <button
                type="button"
                disabled={snapshotUserStep.type !== "left"}
                onClick={this.handleClickAction(snapshotUserStep.action)}
              >
                Turn left
              </button>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <button
                type="button"
                disabled={snapshotUserStep.type !== "right"}
                onClick={this.handleClickAction(snapshotUserStep.action)}
              >
                Turn right
              </button>
            </div>
          </div>
        ) : (
          <p style={{ marginLeft: "20px" }}>Congratulations</p>
        )}
      </Container>
    );
  }
}
