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
`;

const ContainerActions = styled.div`
  margin-left: 30px;
`;

const Text = styled.h2`
  font-size: 18px;
  color: ${({ success }) => (success ? "#2FD781" : "rgb(219, 64, 53)")};
`;

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
      step: 0
    };

    this.snapshotUserSteps = [];
  }

  updateMatrix = value => {
    const { user, way, matrix } = this.getStateByMatrix(value);
    this.snapshotUserSteps =
      way !== "noexits" ? this.getSnapshotUserSteps(user, way) : [];
    this.setState({
      user,
      way,
      matrix,
      step: 0
    });
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
      user
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

  handleClickAction = action => () => {
    this.setState(state => ({
      ...action,
      step: state.step + 1
    }));
  };

  render() {
    const { matrix, step } = this.state;
    return (
      <Wrapper>
        <EnterMaze updateMatrix={this.updateMatrix} />
        {matrix && (
          <Container>
            <div>{matrix.length > 0 && this.renderMatrix(matrix)}</div>
            <ContainerActions>
              {!this.isNoExitsMaze() ? (
                this.snapshotUserSteps[step] ? (
                  <Navigation
                    snapshotUserStep={this.snapshotUserSteps[step]}
                    handleClickAction={this.handleClickAction}
                  />
                ) : (
                  <Text success>Congratulations!</Text>
                )
              ) : (
                <Text>No exits from maze</Text>
              )}
            </ContainerActions>
          </Container>
        )}
      </Wrapper>
    );
  }
}