import React from "react";
import { Container, Textarea, ButtonCalculate } from "./styled";

const DEFAULT_MATRIX = `##########
#        #
#  ##### #
#  #   # #
#  #v# # #
#  ### # #
#      # #
######## #
`;

export class EnterMaze extends React.PureComponent {
  state = {
    matrixValue: DEFAULT_MATRIX,
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  calculateMaze = () => {
    let index = 0;
    const updateMatrixValue = this.state.matrixValue
      .split("")
      .reduce((acc, item) => {
        if (item !== "\n") {
          if (!acc[index]) acc[index] = [];
          acc[index].push(item);
        } else {
          index++;
        }
        return acc;
      }, []);
    this.props.updateMatrix(updateMatrixValue);
  };

  render() {
    return (
      <Container>
        <Textarea
          name="matrixValue"
          value={this.state.matrixValue}
          onChange={this.onChange}
        />
        <ButtonCalculate type="button" onClick={this.calculateMaze}>
          Calculate maze
        </ButtonCalculate>
      </Container>
    );
  }
}
