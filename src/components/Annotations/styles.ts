import styled from 'styled-components'

export const AnnotationsContainer = styled.div`
  font-size: 0.65rem;
  display: block !important;
  line-height: 1.5;
  div {
    margin-left: 1rem;
    margin-right: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input[type='checkbox'] {
      vertical-align: middle;
      padding-right: 0.25rem;
      ::selection {
        background-color: ${(props) => props.theme['blue-300']} !important;
        opacity: 0.2;
      }

      ::-moz-selection {
        background-color: ${(props) => props.theme['blue-300']} !important;
        opacity: 0.2;
      }
    }
    p {
      font-style: italic !important;
      vertical-align: middle;
      padding-left: 0.25rem;
    }
  }
  input[type='range'] {
    width: 100%;
  }
`
