import styled from 'styled-components'

export const ToogleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 2rem;
  height: 1rem;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  span:before {
    position: absolute;
    content: '';
    height: 0.875rem;
    width: 0.875rem;
    left: 0.175rem;
    bottom: 0.087rem;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ${(props) => props.theme['blue-300']} !important;
  }

  input:focus + span {
    box-shadow: 0 0 1px ${(props) => props.theme['blue-300']} !important;
  }

  input:checked + span:before {
    -webkit-transform: translateX(0.75rem);
    -ms-transform: translateX(0.75rem);
    transform: translateX(0.75rem);
  }
`
