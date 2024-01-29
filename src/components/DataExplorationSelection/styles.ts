import styled from 'styled-components'

export const LayerSelectionContainer = styled.div`
  margin-left: -2.3rem;
  height: 90vh;
  width: 22rem;
  background-color: ${(props) => props.theme.white};
  z-index: 9998;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  padding-bottom: 0.75rem;
`

export const LayerSelectionTitle = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme['blue-500']};
  background-image: linear-gradient(
    315deg,
    ${(props) => props.theme['blue-500']} 0%,
    ${(props) => props.theme['blue-300']} 74%
  );
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin: 0;
  text-align: center;
  div {
    position: relative;
    svg {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
  }
  h1 {
    padding: 0.375rem;
    padding-right: 2rem;
    margin-left: 3rem;
    font-size: 1.5rem;
    font-weight: bold;
    /* text-transform: capitalize; */
  }
`

export const LayerTypes = styled.div`
  height: calc(90vh - 2.5rem + 0.75rem);
  overflow-y: auto;
`

export const WithAreaLayerTypes = styled.div`
  height: calc(
    90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem - 0.5rem - 2rem -
      3.55rem
  );
  overflow-y: auto;
`
