import PropTypes from "prop-types";

export const actionType = PropTypes.oneOf([
  "forward",
  "around",
  "left",
  "right",
]);

export const directionType = PropTypes.oneOf([
  "top",
  "bottom",
  "left",
  "right",
]);

export const IUser = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  direction: directionType,
});

export const IMatrix = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.oneOf([0, 1]))
);

export const IWay = PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number));
