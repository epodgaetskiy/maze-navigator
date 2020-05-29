import React from "react";
import { getShortestWay } from "../../finder/finder";
import {
  Wrapper,
  Container,
  ColumnMaze,
  ColumnActions,
  ContainerMaze,
  Text,
} from "./styled";
import Navigation from "../Maze/Navigation";
import { SetupMaze } from "../SetupMaze";
import { Matrix } from "../Maze/Matrix";

const WALL_SYMBOL = "#";
const WALL_VALUE = 1;

const PASS_SYMBOL = " ";
const PASS_VALUE = 0;

const userDirectionByAction = {
  forward: {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
  },
  around: {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  },
  left: {
    top: "left",
    bottom: "right",
    left: "bottom",
    right: "top",
  },
  right: {
    top: "right",
    bottom: "left",
    left: "top",
    right: "bottom",
  },
};

const actionByCurrentUserDirection = {
  top: {
    top: "forward",
    bottom: "around",
    left: "right",
    right: "left",
  },
  bottom: {
    top: "around",
    bottom: "forward",
    left: "left",
    right: "right",
  },
  left: {
    top: "left",
    bottom: "right",
    left: "forward",
    right: "around",
  },
  right: {
    top: "right",
    bottom: "left",
    left: "around",
    right: "forward",
  },
};

const MAZE_STATUS = {
  SETUP: "setup",
  WALK: "walk",
};

export class App extends React.Component {
  state = {
    mazeStatus: MAZE_STATUS.SETUP,
    user: null,
    way: null,
    matrix: null,
    exits: null,
    step: 0,
    showHint: false,
  };

  hideHint = () => {
    this.hintTimer = setTimeout(() => {
      this.setState({ showHint: false });
    }, 1000);
  };

  updateMatrix = (value) => {
    const { user, way, matrix, exits } = this.getStateByMatrix(value);

    this.setState(
      {
        user,
        way,
        matrix,
        exits,
        showHint: true,
        mazeStatus: MAZE_STATUS.WALK,
      },
      this.hideHint
    );
  };

  getDirectionUserBySymbol = (symbol) => {
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

  getStateByMatrix = (matrix) => {
    const maxX = matrix[0].length - 1;
    const maxY = matrix.length - 1;
    const normalizeMatrix = [];
    const user = {};
    const exits = [];
    matrix.forEach((row, oY) => {
      normalizeMatrix[oY] = row.map((item, oX) => {
        if (item === PASS_SYMBOL && (oY === 0 || oY === maxY)) {
          exits.push([oX, oY]);
        }
        if (
          item === PASS_SYMBOL &&
          oY !== 0 &&
          oY !== maxY &&
          (oX === 0 || oX === maxX)
        ) {
          exits.push([oX, oY]);
        }
        switch (item) {
          case WALL_SYMBOL:
            return WALL_VALUE;
          case PASS_SYMBOL:
            return PASS_VALUE;
          default:
            user.x = oX;
            user.y = oY;
            user.direction = this.getDirectionUserBySymbol(item);
            return PASS_VALUE;
        }
      });
    });

    return {
      matrix: normalizeMatrix,
      way: getShortestWay(normalizeMatrix, { x: user.x, y: user.y }, exits),
      user,
      exits,
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
                direction: needMoving,
              },
              currentStep,
            }
          : {
              user: {
                ...user,
                x: way[currentStep + 1][0],
                y: way[currentStep + 1][1],
              },
              currentStep: currentStep + 1,
            },
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
        numberRepeatingSteps,
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

  getUserPositionByAction = (action, user) => {
    if (action !== "forward") {
      return {
        x: user.x,
        y: user.y,
      };
    }

    if (user.direction === "top") {
      return {
        x: user.x,
        y: user.y - 1,
      };
    }

    if (user.direction === "bottom") {
      return {
        x: user.x,
        y: user.y + 1,
      };
    }

    if (user.direction === "left") {
      return {
        x: user.x - 1,
        y: user.y,
      };
    }

    if (user.direction === "right") {
      return {
        x: user.x + 1,
        y: user.y,
      };
    }
  };

  handleClickAction = (action) => () => {
    const user = { ...this.state.user };
    const updateUser = {
      ...user,
      direction: userDirectionByAction[action][user.direction],
      ...this.getUserPositionByAction(action, user),
    };
    const updateWay = getShortestWay(
      this.state.matrix,
      { x: updateUser.x, y: updateUser.y },
      this.state.exits
    );

    clearTimeout(this.hintTimer);

    this.setState(
      {
        user: updateUser,
        way: updateWay,
        showHint: true,
      },
      this.hideHint
    );
  };

  canUserMovingByPosition = (user, matrix) => {
    const config = {
      top: !matrix[user.y - 1][user.x],
      bottom: !matrix[user.y + 1][user.x],
      right: !matrix[user.y][user.x + 1],
      left: !matrix[user.y][user.x - 1],
    };
    return config[user.direction];
  };

  getNextStep = (user, way) =>
    way && way !== "noexits" ? this.getSnapshotUserSteps(user, way)[0] : [];

  checkExitsMaze = (way) => way?.length > 0;

  render() {
    const { matrix, user, way, showHint, mazeStatus } = this.state;
    const nextStep = this.getNextStep(user, way);
    const hasWayout = this.checkExitsMaze(way);
    return (
      <Wrapper>
        <SetupMaze updateMatrix={this.updateMatrix} />
        {mazeStatus === MAZE_STATUS.WALK && (
          <Container>
            <ColumnMaze>
              <ContainerMaze>
                <Matrix matrix={matrix} way={way} user={user} />
              </ContainerMaze>
            </ColumnMaze>
            <ColumnActions>
              {hasWayout ? (
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