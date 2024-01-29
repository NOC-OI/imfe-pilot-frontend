import styled from 'styled-components'

export const ResiumContainer = styled.div`
  /* div:first-child {
    div:first-child {
      height: 500px;
    }
  } */
`
export const ZoomGroup = styled.div`
  background: #303336;
  border: 1px solid #444;
  color: #edffff;
  fill: #edffff;
  border-radius: 4px;
  margin: 2px 3px;
  &:hover {
    box-shadow: 0 0 8px #fff;
  }
`
export const ZoomButton = styled.div`
  padding: 0.25rem 0.675rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #ffffff;
    fill: #ffffff;
    background-color: #48b;
    border-color: #aaeeff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #aaeeff;
  }
`
export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;
    a {
      width: 3rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${(props) => props.theme['gray-100']};
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      cursor: pointer;

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-700']};
      }

      &.active {
        color: ${(props) => props.theme['green-700']};
      }
    }
  }
`
