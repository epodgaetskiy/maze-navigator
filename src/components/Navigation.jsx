import React from "react";
import styled, { css } from "styled-components";
import { Button } from "./ui/Button";

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
  render() {
    const {
      handleClickAction,
      canUserMovingByPosition,
      nextStepType,
      showHint,
    } = this.props;
    return (
      <>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={handleClickAction("forward")}
            disabled={!canUserMovingByPosition}
            highlight={nextStepType === "forward" && showHint}
          >
            Go 1 step forward
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={handleClickAction("around")}
            highlight={nextStepType === "around" && showHint}
          >
            Turn around
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={handleClickAction("left")}
            highlight={nextStepType === "left" && showHint}
          >
            Turn left
          </ButtonAction>
        </ButtonContainer>
        <ButtonContainer>
          <ButtonAction
            type="button"
            onClick={handleClickAction("right")}
            highlight={nextStepType === "right" && showHint}
          >
            Turn right
          </ButtonAction>
        </ButtonContainer>
      </>
    );
  }
}
