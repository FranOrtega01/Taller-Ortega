import styled from "styled-components";

export const Inner = styled.div`
  position: relative;
  transition: all ease-in-out 0.3s;
`;

export const Label = styled.label`
  position: absolute;
  z-index: 100;
  padding: 0 5px;
  left: 7px;
  line-height: 8px;
  transition: all ease-in-out 0.3s;
  transition-property: top, font-size;
  pointer-events: none;

  ${({ $hasFocus }) =>
    $hasFocus
      ? "top: -7px;font-size:12px!important;background: white;"
      : "top:11px;"}
`;