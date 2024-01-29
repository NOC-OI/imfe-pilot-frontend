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
  z-index: 9999;
  width: 6.25rem;
  height: 6.25rem;
`

export const LoadingSpinner = styled.div`
  color: official;
  display: inline-block;
  position: relative;
  width: 5rem;
  height: 5rem;
  div {
    transform-origin: 2.5rem 2.5rem;
    animation-name: ${breatheAnimation} 1.2s linear infinite;
    &:after {
      content: ' ';
      display: block;
      position: absolute;
      top: 0.1875rem;
      left: 2.3125rem;
      width: 0.375rem;
      height: 1.125rem;
      border-radius: 20%;
      background: #d49511;
    }
    &:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -1.1s;
    }
    &:nth-child(2) {
      transform: rotate(30deg);
      animation-delay: -1s;
    }
    &:nth-child(3) {
      transform: rotate(60deg);
      animation-delay: -0.9s;
    }
    &:nth-child(4) {
      transform: rotate(90deg);
      animation-delay: -0.8s;
    }
    &:nth-child(5) {
      transform: rotate(120deg);
      animation-delay: -0.7s;
    }
    &:nth-child(6) {
      transform: rotate(150deg);
      animation-delay: -0.6s;
    }
    &:nth-child(7) {
      transform: rotate(180deg);
      animation-delay: -0.5s;
    }
    &:nth-child(8) {
      transform: rotate(210deg);
      animation-delay: -0.4s;
    }
    &:nth-child(9) {
      transform: rotate(240deg);
      animation-delay: -0.3s;
    }
    &:nth-child(10) {
      transform: rotate(270deg);
      animation-delay: -0.2s;
    }
    &:nth-child(11) {
      transform: rotate(300deg);
      animation-delay: -0.1s;
    }
    &:nth-child(12) {
      transform: rotate(330deg);
      animation-delay: 0s;
    }
  }
`
