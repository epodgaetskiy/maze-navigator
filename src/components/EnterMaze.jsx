import React from "react";

export default class EnterMaze extends React.PureComponent {
  state = {
    matrixValue: "",
    countRows: 0,
    countColumns: 0
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  calculateMaze = () => {};

  render() {
    return (
      <div>
        <div>
          <label htmlFor="countRows">Enter count of rows</label>
          <input
            id="countRows"
            type="text"
            name="countRows"
            onChange={this.onChange}
          />
        </div>
        <div>
          <label htmlFor="countColumns">Enter count of columns</label>
          <input
            id="countColumns"
            type="text"
            name="countColumns"
            onChange={this.onChange}
          />
        </div>
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
