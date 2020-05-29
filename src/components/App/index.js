import React from "react";
import {
  WALL_SYMBOL,
  WALL_VALUE,
  PASS_SYMBOL,
  PASS_VALUE,
  USER_SYMBOL,
} from "../../constants/symbols";
import { Finder } from "../../finder/finder";
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
  constructor() {
    super();

    this.state = {
      mazeStatus: MAZE_STATUS.SETUP,
      user: null,
      way: null,
      matrix: null,
      exits: null,
      step: 0,
    };
  }

  updateMatrix = (value) => {
    const { user, way, matrix, exits } = this.getStateByMatrix(value);

    this.setState(
      {
        user,
        way,
        matrix,
        exits,
        mazeStatus: MAZE_STATUS.WALK,
      },
      this.hideHint
    );
  };

  getDirectionUserBySymbol = (symbol) => {
    switch (symbol) {
      case USER_SYMBOL.RIGHT:
        return "right";
      case USER_SYMBOL.LEFT:
        return "left";
      case USER_SYMBOL.TOP:
        return "top";
      case USER_SYMBOL.BOTTOM:
        return "bottom";
      default:
        return "bottom";
    }
  };

  getUserFromMatrix = (matrix) => {
    const user = {};
    const isUserSymbol = (symbol) =>
      symbol === USER_SYMBOL.TOP ||
      symbol === USER_SYMBOL.BOTTOM ||
      symbol === USER_SYMBOL.LEFT ||
      symbol === USER_SYMBOL.RIGHT;

    matrix.forEach((row, oY) => {
      row.forEach((symbol, oX) => {
        if (isUserSymbol(symbol)) {
          user.x = oX;
          user.y = oY;
          user.direction = this.getDirectionUserBySymbol(symbol);
        }
      });
    });

    return user;
  };

  getNormalizeMatrix = (matrix) => {
    const normalizeMatrix = [];
    matrix.forEach((row, oY) => {
      normalizeMatrix[oY] = row.map((item, oX) => {
        switch (item) {
          case WALL_SYMBOL:
            return WALL_VALUE;
          case PASS_SYMBOL:
            return PASS_VALUE;
          default:
            return PASS_VALUE;
        }
      });
    });
    return normalizeMatrix;
  };

  getStateByMatrix = (matrix) => {
    const user = this.getUserFromMatrix(matrix);
    const normalizeMatrix = this.getNormalizeMatrix(matrix);
    this.finder = new Finder(normalizeMatrix);

    return {
      matrix: normalizeMatrix,
      way: this.finder.getShortestWay(user),
      user,
      exits: this.finder.getExists(),
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

  updateAction = (action) => {
    const user = { ...this.state.user };
    const updateUser = {
      ...user,
      direction: userDirectionByAction[action][user.direction],
      ...this.getUserPositionByAction(action, user),
    };
    const updateShortestWay = this.finder.getShortestWay({
      x: updateUser.x,
      y: updateUser.y,
    });

    this.setState({
      user: updateUser,
      way: updateShortestWay,
    });
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

  getNextStep = (user, way) => this.getSnapshotUserSteps(user, way)[0];

  checkExitsMaze = (way) => way?.length > 0;

  render() {
    const { matrix, user, way, mazeStatus } = this.state;
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
                    updateAction={this.updateAction}
                    canUserMovingByPosition={this.canUserMovingByPosition(
                      user,
                      matrix
                    )}
                    nextStep={this.getNextStep(user, way)}
                  />
                ) : (
                  <Text status="success">Congratulations!</Text>
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
