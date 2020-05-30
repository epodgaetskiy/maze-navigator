import styled, { css } from "styled-components";
import { Button } from "../../ui/Button";

export const Container = styled.div`
  width: 130px;
`;

export const ContainerTop = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
`;

export const ContainerBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ButtonAction = styled(Button)`
  transition: all 0.25s;
  ${({ highlight }) =>
    highlight &&
    css`
      && {
        transform: scale(1.2);
      }
    `}
`;
