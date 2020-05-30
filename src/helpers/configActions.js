export const userDirectionByAction = {
  forward: {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
  },
  around: {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  },
  left: {
    top: "left",
    bottom: "right",
    left: "bottom",
    right: "top",
  },
  right: {
    top: "right",
    bottom: "left",
    left: "top",
    right: "bottom",
  },
};

export const actionByCurrentUserDirection = {
  top: {
    top: "forward",
    bottom: "around",
    left: "right",
    right: "left",
  },
  bottom: {
    top: "around",
    bottom: "forward",
    left: "left",
    right: "right",
  },
  left: {
    top: "left",
    bottom: "right",
    left: "forward",
    right: "around",
  },
  right: {
    top: "right",
    bottom: "left",
    left: "around",
    right: "forward",
  },
};
