import styled from "styled-components";

export const Inner = styled.div`
  position: relative;
  transition: all ease-in-out 0.3s;
`;

export const Label = styled.label`
  position: absolute;
  z-index: 100;
  padding: 0 5px;
  line-height: 8px;
  transition: all ease-in-out 0.3s;
  transition-property: top, left, font-size;
  pointer-events: none;
  background: white;

  ${({ $hasFocus, $hasPrefix }) => `
    top: ${$hasFocus ? "-7px" : "11px"};
    left: ${$hasPrefix ? ($hasFocus ? "7px" : "21px") : "7px"};
    font-size: ${$hasFocus ? "12px!important" : "inherit"};
  `}
`;