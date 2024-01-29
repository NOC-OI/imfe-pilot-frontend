import styled from 'styled-components'

export const FullPagePopupContainer = styled.div`
  position: fixed;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  color: ${(props) => props.theme.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  svg {
    cursor: pointer;
    padding-bottom: 1rem;
    height: 2rem;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
  a {
    color: ${(props) => props.theme.white};
    text-decoration: none;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }

  h2 {
    background: -webkit-linear-gradient(
      315deg,
      ${(props) => props.theme['blue-500']} 0%,
      ${(props) => props.theme['blue-300']} 74%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`
