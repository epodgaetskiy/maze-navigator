import styled from "styled-components";
import { Button } from "../ui/Button";

export const Container = styled.div`
  width: 600px;
  margin-bottom: 30px;
`;

export const Textarea = styled.textarea`
  margin-bottom: 15px;
  display: flex;
  width: 100%;
  min-height: 400px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 20px;
  color: rgb(51, 51, 51);
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset;
  resize: vertical;
  margin: 0px;
  padding: 9px 12px;
  border-radius: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  transition: border 0.2s linear 0s, box-shadow 0.2s linear 0s;

  &:focus {
    box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset,
      rgba(82, 168, 236, 0.6) 0px 0px 8px;
    border-color: rgba(82, 168, 236, 0.8);
    outline: 0px;
  }
`;

export const ButtonCalculate = styled(Button)`
  width: 100%;
`;
