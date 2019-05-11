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

    this.snapshotUserSteps = this.getSnapshotUserSteps(
      this.state.user,
      this.state.way
    );
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

  getNumberRepeatingForwardAction = (
    currentIndex,
    items,
    numberRepeatingSteps
  ) => {
    if (
      currentIndex < items.length - 1 &&
      items[currentIndex + 1].type === "forward"
    ) {
      return this.getNumberRepeatingForwardAction(
        currentIndex + 1,
        items,
        numberRepeatingSteps + 1
      );
    } else {
      return {
        ...items[currentIndex],
        numberRepeatingSteps
      };
    }
  };

  getSnapshotUserSteps = (initialUser, initialWay) => {
    const snapshotUserSteps = [];
    let currentStep = 0;
    let user = { ...initialUser };
    let way = [...initialWay];

    while (currentStep < way.length - 1) {
      const iteration = this.getNeedAction(currentStep, user, way);
      currentStep = iteration.action.currentStep;
      user = iteration.action.user;
      snapshotUserSteps.push(iteration);
    }

    const optimezeSnapshotUserSteps = [];
    let i = 0;
    while (i < snapshotUserSteps.length) {
      if (snapshotUserSteps[i].type !== "forward") {
        optimezeSnapshotUserSteps.push(snapshotUserSteps[i]);
        i = i + 1;
      } else {
        const item = this.getNumberRepeatingForwardAction(
          i,
          snapshotUserSteps,
          1
        );
        optimezeSnapshotUserSteps.push(item);
        i = i + item.numberRepeatingSteps;
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
                Go {snapshotUserStep.numberRepeatingSteps}{" "}
                {`step${snapshotUserStep.numberRepeatingSteps > 1 ? "s" : ""}`}{" "}
                forward
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
