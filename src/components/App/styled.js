import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const ColumnMaze = styled.div`
  flex: 1;
`;

export const ColumnActions = styled.div`
  flex: 1;
  margin-left: 30px;
`;

export const ContainerMaze = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Text = styled.h2`
  font-size: 18px;
  color: ${({ success }) => (success ? "#2FD781" : "rgb(219, 64, 53)")};
`;
