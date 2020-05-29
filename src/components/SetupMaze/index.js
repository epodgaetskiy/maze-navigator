import React from "react";
import { Container, Textarea, ButtonCalculate } from "./styled";

const NEW_LINE = "\n";

const DEFAULT_MATRIX = `##########
#        #
#  ##### #
#  #   # #
#  #v# # #
#  ### # #
#      # #
######## #
`;

export class SetupMaze extends React.Component {
  state = {
    matrixValue: DEFAULT_MATRIX,
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  normalizeMatrix = (matrix) => {
    let row = 0;

    return matrix.split("").reduce((acc, item) => {
      if (item === NEW_LINE) {
        row++;
        return acc;
      }

      if (!acc[row]) acc[row] = [];
      acc[row].push(item);
      return acc;
    }, []);
  };

  onCalculateMaze = () => {
    const { matrixValue } = this.state;
    const matrix = this.normalizeMatrix(matrixValue);

    this.props.updateMatrix(matrix);
  };

  render() {
    return (
      <Container>
        <Textarea
          name="matrixValue"
          value={this.state.matrixValue}
          onChange={this.onChange}
        />
        <ButtonCalculate type="button" onClick={this.onCalculateMaze}>
          Calculate maze
        </ButtonCalculate>
      </Container>
    );
  }
}
