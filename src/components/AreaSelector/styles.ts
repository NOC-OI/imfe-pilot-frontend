import styled from 'styled-components'

export const LatLonLimitsContainer = styled.div`
  padding-top: 0.5rem;
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.5rem;
    p {
      width: 6rem;
      font-size: 0.65rem;
    }
    input {
      width: 4rem;
      height: 0.9rem;
      font-size: 0.65rem;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type='number'] {
      appearance: textfield;
    }
    input:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`

export const AreaSelectorContainer = styled.div`
  padding: 0.375rem;
  padding-top: 0.5rem;
  margin: 0.5rem;
  margin-left: 3rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  align-items: center;
  text-align: center;
  padding-right: 2rem;
  border-radius: 16px;
  font-weight: bold;
  h1 {
    padding-bottom: 0.375rem;
    font-size: 1rem;
    font-weight: bold;
  }
`

export const ButtonSelection = styled.div`
  div:first-child {
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* height: 2rem; */
  }
`

export const ActiveButton = styled.button`
  /* height: 2rem; */
  width: max-content;
  color: ${(props) => props.theme.black};
  background: ${(props) => props.theme['yellow-400']};
  border-radius: 8px;
  padding: 0.375rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.white};
  }
`

export const Button = styled.button`
  /* height: 2rem; */
  width: 100%;
  color: ${(props) => props.theme.black};
  border-radius: 9px;
  padding: 0.375rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  cursor: pointer;
  text-align: center;
  &:hover {
    background: ${(props) => props.theme['yellow-400']};
    color: ${(props) => props.theme['gray-500']};
  }
  p {
    font-weight: bold;
  }
`
