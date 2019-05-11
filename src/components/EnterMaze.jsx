import React from "react";

const separateSymbol = "↵";

export default class EnterMaze extends React.PureComponent {
  state = {
    matrixValue: ""
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
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
      <div>
        <div>
          <textarea
            name="matrixValue"
            onChange={this.onChange}
            rows={10}
            style={{ width: "300px" }}
          />
        </div>
        <button type="button" onClick={this.calculateMaze}>
          Calculate maze
        </button>
      </div>
    );
  }
}
