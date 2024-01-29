import styled from 'styled-components'

export const CalculationValueContainer = styled.div`
  right: 0.5rem;
  top: 5vh;
  width: max-content;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
  overflow-y: auto;
  height: max-content;
  max-height: 90vh;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;
  h1 {
    font-size: 1.5rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  h2 {
    font-size: 1rem;
    line-height: 1.6;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  p {
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: center;
  }
  svg {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`
export const CalculationValueImage = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: max-content;
  max-height: 10rem;
  overflow: hidden;
  img {
    width: 10rem;
    object-fit: cover;
    height: auto;
  }
`

export const CalculationValueTitle = styled.div`
  p {
    font-weight: bold;
    text-align: center;
    font-size: 1rem;
    line-height: 1.6;
    text-align: center;
    padding-bottom: 0.375rem;
    ::first-letter {
      text-transform: uppercase;
    }
  }
`
