import React from "react";
import styled from "styled-components";
import { getPath } from "../finder/finder";
import Row from "./Row";
import Cell from "./Cell";
import EnterMaze from "./EnterMaze";
import Navigation from "./Navigation";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ColumnMaze = styled.div`
  flex: 1;
`;

const ColumnActions = styled.div`
  flex: 1;
  margin-left: 30px;
`;

const ContainerMaze = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Text = styled.h2`
  font-size: 18px;
  color: ${({ success }) => (success ? "#2FD781" : "rgb(219, 64, 53)")};
`;

const userDirectionByAction = {
  forward: {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right"
  },
  around: {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left"
  },
  left: {
    top: "left",
    bottom: "right",
    left: "bottom",
    right: "top"
  },
  right: {
    top: "right",
    bottom: "left",
    left: "top",
    right: "bottom"
  }
};

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
      user: null,
      way: null,
      matrix: null,
      exits: null,
      step: 0,
      showHint: false
    };
  }

  hideHint = () => {
    this.hintTimer = setTimeout(() => {
      this.setState({ showHint: false });
    }, 1000);
  };

  updateMatrix = value => {
    const { user, way, matrix, exits } = this.getStateByMatrix(value);

    this.setState(
      {
        user,
        way,
        matrix,
        exits,
        showHint: true
      },
      this.hideHint
    );
  };

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

  isNoExitsMaze = () => this.state.way === "noexits";

  getStateByMatrix = matrix => {
    const maxX = matrix[0].length - 1;
    const maxY = matrix.length - 1;
    const normalizeMatrix = [];
    const user = {};
    const exits = [];
    matrix.forEach((row, oY) => {
      normalizeMatrix[oY] = row.map((item, oX) => {
        if (item === " " && (oY === 0 || oY === maxY)) {
          exits.push([oX, oY]);
        }
        if (
          item === " " &&
          (oY !== 0 && oY !== maxY && (oX === 0 || oX === maxX))
        ) {
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

    return {
      matrix: normalizeMatrix,
      way: getPath(normalizeMatrix, { x: user.x, y: user.y }, exits),
      user,
      exits
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
              isWay={
                !this.isNoExitsMaze() &&
                this.checkCellByWay(positionX, positionY)
              }
              userDirection={this.state.user.direction}
              isUser
            />
          ) : (
            <Cell
              key={`x-${positionX}`}
              isWall={Boolean(cellData)}
              isWay={
                !this.isNoExitsMaze() &&
                this.checkCellByWay(positionX, positionY)
              }
            />
          )
        )}
      </Row>
    ));

  getUserPositionByAction = (action, user) => {
    if (action !== "forward") {
      return {
        x: user.x,
        y: user.y
      };
    }

    if (user.direction === "top") {
      return {
        x: user.x,
        y: user.y - 1
      };
    }

    if (user.direction === "bottom") {
      return {
        x: user.x,
        y: user.y + 1
      };
    }

    if (user.direction === "left") {
      return {
        x: user.x - 1,
        y: user.y
      };
    }

    if (user.direction === "right") {
      return {
        x: user.x + 1,
        y: user.y
      };
    }
  };

  handleClickAction = action => () => {
    const user = { ...this.state.user };
    const updateUser = {
      ...user,
      direction: userDirectionByAction[action][user.direction],
      ...this.getUserPositionByAction(action, user)
    };
    const updateWay = getPath(
      this.state.matrix,
      { x: updateUser.x, y: updateUser.y },
      this.state.exits
    );

    clearTimeout(this.hintTimer);

    this.setState(
      {
        user: updateUser,
        way: updateWay,
        showHint: true
      },
      this.hideHint
    );
  };

  canUserMovingByPosition = (user, matrix) => {
    const config = {
      top: !matrix[user.y - 1][user.x],
      bottom: !matrix[user.y + 1][user.x],
      right: !matrix[user.y][user.x + 1],
      left: !matrix[user.y][user.x - 1]
    };
    return config[user.direction];
  };

  getNextStep = (user, way) =>
    way && way !== "noexits" ? this.getSnapshotUserSteps(user, way)[0] : [];

  render() {
    const { matrix, user, way, showHint } = this.state;
    const nextStep = this.getNextStep(user, way);
    return (
      <Wrapper>
        <EnterMaze updateMatrix={this.updateMatrix} />
        {matrix && (
          <Container>
            <ColumnMaze>
              <ContainerMaze>
                {matrix.length > 0 && this.renderMatrix(matrix)}
              </ContainerMaze>
            </ColumnMaze>
            <ColumnActions>
              {!this.isNoExitsMaze() ? (
                way.length > 1 ? (
                  <Navigation
                    handleClickAction={this.handleClickAction}
                    canUserMovingByPosition={this.canUserMovingByPosition(
                      user,
                      matrix
                    )}
                    nextStepType={nextStep.type}
                    showHint={showHint}
                  />
                ) : (
                  <Text success>Congratulations!</Text>
                )
              ) : (
                <Text>No exits from maze</Text>
              )}
            </ColumnActions>
          </Container>
        )}
      </Wrapper>
    );
  }
}
