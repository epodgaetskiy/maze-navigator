import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

export default class Row extends React.PureComponent {
  render() {
    return <Container>{this.props.children}</Container>;
  }
}
