import styled, { keyframes } from 'styled-components'

const breatheAnimation = keyframes`
  0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
`
export const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 9998;
  width: 6.25rem;
  height: 6.25rem;
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 5rem;
  height: 5rem;
  div {
    transform-origin: 2.5rem 2.5rem;
    animation-name: ${breatheAnimation};
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  div:after {
    content: ' ';
    display: block;
    position: absolute;
    top: 0.1875rem;
    left: 2.3125rem;
    width: 0.375rem;
    height: 1.125rem;
    border-radius: 20%;
    background: ${(props) => props.theme['yellow-700']};
  }
  div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
`
