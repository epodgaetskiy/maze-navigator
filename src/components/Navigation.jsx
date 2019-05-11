import React from "react";

export default class Navigation extends React.PureComponent {
  render() {
    const { snapshotUserStep, handleClickAction } = this.props;
    return (
      <div style={{ marginLeft: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            disabled={snapshotUserStep.type !== "forward"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Go {snapshotUserStep.numberRepeatingSteps || "n"}{" "}
            {`step${snapshotUserStep.numberRepeatingSteps > 1 ? "s" : ""}`}{" "}
            forward
          </button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            disabled={snapshotUserStep.type !== "around"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn around
          </button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            disabled={snapshotUserStep.type !== "left"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn left
          </button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            disabled={snapshotUserStep.type !== "right"}
            onClick={handleClickAction(snapshotUserStep.action)}
          >
            Turn right
          </button>
        </div>
      </div>
    );
  }
}
