import React from "react";
import styled, { css } from "styled-components";
import IconNav from "../images/icon-nav.png";

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

const Container = styled.div`
  position: relative;
  background: ${({ isWay, isWall }) =>
    isWay ? "yellow" : isWall ? "#2FD781" : "#E5E7EA"};
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

export default class Cell extends React.PureComponent {
  render() {
    return (
      <Container
        userDirection={this.props.userDirection}
        isWall={this.props.isWall}
        isUser={this.props.isUser}
        isWay={this.props.isWay}
      />
    );
  }
}
