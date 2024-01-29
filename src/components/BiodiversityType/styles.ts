import styled from 'styled-components'

export const CalcTypeContainer = styled.div`
  margin: 0.5rem;
  margin-left: 3rem;
  border-radius: 16px;
  padding: 0.375rem;
  font-weight: bold;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    p {
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
    svg {
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
    span:first-child {
      padding-right: 0.25rem;
      svg {
        padding-bottom: 0.375rem;
        width: 1rem;
        height: 1rem;
      }
    }
  }
`

export const CalcTypeOptionsContainer = styled.div`
  font-size: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: normal;
  svg {
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
  label {
    display: flex;
    align-items: center;
    padding-right: 0.675rem;
    white-space: nowrap;
    padding: 0.375rem;
    cursor: pointer;
    input {
      vertical-align: middle;
      padding-right: 0.25rem;
      ::selection {
        background-color: ${(props) => props.theme['blue-500']} !important;
      }

      ::-moz-selection {
        background-color: ${(props) => props.theme['blue-500']} !important;
      }
    }
    p {
      vertical-align: middle;
      padding-left: 0.25rem;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
  }
`
