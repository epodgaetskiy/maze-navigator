import React from "react";
import styled from "styled-components";
import Button from "./Button";

const NavigationContainer = styled.div``;

const ButtonContainer = styled.div`
  margin-bottom: 15px;
`;

export default class Navigation extends React.PureComponent {
  render() {
    const { snapshotUserStep, handleClickAction } = this.props;
    return (
      <NavigationContainer>
        <ButtonContainer>
          <Button
            type="button"
            disabled={snapshotUserStep.type !== "forward"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Go {snapshotUserStep.numberRepeatingSteps || "n"}{" "}
            {`step${snapshotUserStep.numberRepeatingSteps > 1 ? "s" : ""}`}{" "}
            forward
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            type="button"
            disabled={snapshotUserStep.type !== "around"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn around
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            type="button"
            disabled={snapshotUserStep.type !== "left"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn left
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            type="button"
            disabled={snapshotUserStep.type !== "right"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn right
          </Button>
        </ButtonContainer>
      </NavigationContainer>
    );
  }
}
