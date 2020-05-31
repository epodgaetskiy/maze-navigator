import React from "react";
import { Container, Textarea, ButtonCalculate } from "./styled";

const NEW_LINE = "\n";

const getMatrix = (matrix) => {
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

const DEFAULT_MATRIX = `#########################################
#v    #       #     #         # #   #   #
##### # ##### # ### # # ##### # # # ### #
# #   #   #   #   #   # #     #   #   # #
# # # ### # ########### # ####### # # # #
#   #   # # #       #   # #   #   # #   #
####### # # # ##### # ### # # # #########
#   #     # #     # #   #   # # #       #
# # ####### ### ### ##### ### # ####### #
# #             #   #     #   #   #   # #
# ############### ### ##### ##### # # # #
#               #     #   #   #   # #   #
##### ####### # ######### # # # ### #####
#   # #   #   # #         # # # #       #
# # # # # # ### # # ####### # # ### ### #
# # #   # # #     #   #     # #     #   #
# # ##### # # ####### # ##### ####### # #
# #     # # # #   # # #     # #       # #
# ##### ### # ### # # ##### # # ### ### #
#     #     #     #   #     #   #   #   #
####################################### #
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

  onCalculateMaze = () => {
    const { matrixValue } = this.state;
    const matrix = getMatrix(matrixValue);

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
          Start game
        </ButtonCalculate>
      </Container>
    );
  }
}
