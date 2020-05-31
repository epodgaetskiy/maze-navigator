import React from "react";
import PropTypes from "prop-types";
import { directionType, actionType } from "../../../types";
import { actionByCurrentUserDirection } from "../../../helpers/configActions";
import { KEY_CODES } from "../../../constants/keyCodes";
import {
  Container,
  ContainerTop,
  ContainerBottom,
  ButtonAction,
} from "./styled";

export class Navigation extends React.PureComponent {
  static propTypes = {
    canUserMovingByPosition: PropTypes.object.isRequired,
    updateAction: PropTypes.func.isRequired,
    userDirection: directionType,
    nextStep: PropTypes.shape({
      type: actionType,
    }),
  };

  state = {
    showHint: false,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.moveOnKeydown);
    setTimeout(this.onShowHint, 1000);
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.showHint) {
      this.onShowHint();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.moveOnKeydown);
    clearTimeout(this.hintTimer);
  }

  onMove = (directionType) => {
    const action = this.getNextAction(directionType);
    if (this.validNextMoving(action)) {
      this.props.updateAction(action);
    }
  };

  moveOnKeydown = (event) => {
    switch (event.which) {
      case KEY_CODES.ARROW_UP:
        this.onMove("top");
        break;
      case KEY_CODES.ARROW_DOWN:
        this.onMove("bottom");
        break;
      case KEY_CODES.ARROW_LEFT:
        this.onMove("left");
        break;
      case KEY_CODES.ARROW_RIGHT:
        this.onMove("right");
        break;
      default:
    }
  };

  onShowHint = () => {
    clearTimeout(this.hintTimer);
    this.setState(
      {
        showHint: true,
      },
      this.onHideHint
    );
  };

  onHideHint = () => {
    this.hintTimer = setTimeout(() => {
      this.setState({
        showHint: false,
      });
    }, 1000);
  };

  checkHighlight = (action) => {
    return this.props.nextStep.type === action && this.state.showHint;
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
