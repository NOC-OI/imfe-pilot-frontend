import styled from 'styled-components'

export const InfoBoxContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 5vh;
  width: 6.5rem;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
  height: max-content;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;

  h1 {
    font-size: 1rem;
    line-height: 1.6;
    text-align: center;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    line-height: 1.6;
  }
`
