import styled from 'styled-components'

export const LayerTypeOptionsContainer = styled.div`
  font-size: 0.65rem;
  font-weight: normal;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
      display: flex;
      align-items: center;
      padding-right: 0.675rem;
      white-space: nowrap;
      padding: 0.375rem;
      cursor: pointer;
      input[type='checkbox'] {
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
      }
    }
    svg {
      padding-left: 0.375rem;
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
  }
  input[type='range'] {
    width: 100%;
  }
`
