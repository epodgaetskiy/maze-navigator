import React from "react";
import styled, { css } from "styled-components";
import { Button } from "../ui/Button";

const ButtonContainer = styled.div`
  margin-bottom: 15px;
`;

const ButtonAction = styled(Button)`
  transition: all 0.25s;
  ${({ highlight }) =>
    highlight &&
    css`
      && {
        transform: scale(1.2);
      }
    `}
`;

export default class Navigation extends React.PureComponent {
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

  handleClickAction = (action) => () => {
    this.props.updateAction(action);
  };

  render() {
    const { showHint } = this.state;
    const { canUserMovingByPosition, nextStep } = this.props;
    return (
      <>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={this.handleClickAction("forward")}
            disabled={!canUserMovingByPosition}
            highlight={nextStep.type === "forward" && showHint}
          >
            Go 1 step forward
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={this.handleClickAction("around")}
            highlight={nextStep.type === "around" && showHint}
          >
            Turn around
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={this.handleClickAction("left")}
            highlight={nextStep.type === "left" && showHint}
          >
            Turn left
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={this.handleClickAction("right")}
            highlight={nextStep.type === "right" && showHint}
          >
            Turn right
          </ButtonAction>
        </ButtonContainer>
      </>
    );
  }
}
