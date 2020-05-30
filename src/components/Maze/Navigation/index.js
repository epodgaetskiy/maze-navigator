import React from "react";
import { actionByCurrentUserDirection } from "../../../helpers/configActions";
import {
  Container,
  ContainerTop,
  ContainerBottom,
  ButtonAction,
} from "./styled";

export class Navigation extends React.PureComponent {
  state = {
    showHint: false,
  };

  componentDidMount() {
    setTimeout(this.onShowHint, 1000);
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.showHint) {
      this.onShowHint();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hintTimer);
  }

  onShowHint = () => {
    clearTimeout(this.hintTimer);
    this.setState(
      {
        showHint: true,
      },
      this.hideHint
    );
  };

  hideHint = () => {
    this.hintTimer = setTimeout(() => {
      this.setState({
        showHint: false,
      });
    }, 1000);
  };

  checkHighlight = (action) => {
    const { nextStep } = this.props;
    const { showHint } = this.state;
    return nextStep.type === action && showHint;
  };

  validNextMoving = (action) => {
    const { userDirection, canUserMovingByPosition } = this.props;
    return action !== "forward" || canUserMovingByPosition[userDirection];
  };

  getNextAction = (directionType) => {
    const { userDirection } = this.props;
    const action = actionByCurrentUserDirection[directionType][userDirection];
    return action;
  };

  getButtonActionProps = (directionType) => {
    const { updateAction } = this.props;
    const action = this.getNextAction(directionType);
    return {
      onClick: () => updateAction(action),
      disabled: !this.validNextMoving(action),
      highlight: this.checkHighlight(action),
    };
  };

  render() {
    return (
      <Container>
        <ContainerTop>
          <ButtonAction type="button" {...this.getButtonActionProps("top")}>
            {"^"}
          </ButtonAction>
        </ContainerTop>
        <ContainerBottom>
          <ButtonAction type="button" {...this.getButtonActionProps("left")}>
            {"<"}
          </ButtonAction>
          <ButtonAction type="button" {...this.getButtonActionProps("bottom")}>
            {"v"}
          </ButtonAction>
          <ButtonAction type="button" {...this.getButtonActionProps("right")}>
            {">"}
          </ButtonAction>
        </ContainerBottom>
      </Container>
    );
  }
}
