import styled from "styled-components";

export const Button = styled.button`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  color: rgb(51, 51, 51);
  white-space: normal;
  border-radius: 4px;
  outline: 0px;
  border-width: 1px;
  border-style: solid;
  text-decoration: none;
  padding: 10px 12px 11px;
  background: linear-gradient(rgb(253, 253, 253), rgb(241, 241, 241));
  border-color: rgb(204, 204, 204);

  &:hover {
    color: rgb(51, 51, 51);
    border-color: rgb(187, 187, 187);
    background: linear-gradient(rgb(255, 255, 255), rgb(249, 249, 249));
  }

  &:disabled {
    pointer-events: none;
    cursor: default;
    color: rgb(196, 196, 196);
    background: rgb(248, 248, 248);
    border-color: rgb(230, 230, 230);
  }
`;
