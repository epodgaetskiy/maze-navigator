import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { directionType } from "../../../types";
import IconNav from "../../../images/icon-nav.png";

const getDegByDirection = (direction) => {
  switch (direction) {
    case "top":
      return "0deg";
    case "bottom":
      return "180deg";
    case "left":
      return "270deg";
    case "right":
      return "90deg";
    default:
      return "0deg";
  }
};

const CellStyled = styled.div`
  position: relative;
  background: ${({ isWay, isWall }) => {
    if (isWay) {
      return "yellow";
    }
    return isWall ? "#2FD781" : "#E5E7EA";
  }};
  width: 20px;
  height: 20px;
  border: 1px solid white;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
      ${({ userDirection }) => css`
      rotate(${getDegByDirection(userDirection)})
    `};
    width: 100%;
    height: 100%;
    color: blue;
    font-weight: bold;
    display: ${({ isUser }) => (isUser ? "flex" : "none")};
    align-items: center;
    background-image: url(${IconNav});
    background-size: 100% 100%;
  }
`;

export class Cell extends React.PureComponent {
  static propTypes = {
    isWay: PropTypes.bool.isRequired,
    isWall: PropTypes.bool.isRequired,
    isUser: PropTypes.bool,
    userDirection: directionType,
  };
  render() {
    return <CellStyled {...this.props} />;
  }
}
