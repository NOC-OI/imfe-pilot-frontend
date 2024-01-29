import styled from 'styled-components'

export const InfoButtonBoxContainer = styled.div`
  right: 0.5rem;
  top: 5vh;
  width: max-content;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
  max-height: 90vh;
  height: max-content;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;
  white-space: pre-line;
  h1 {
    font-size: 0.85rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  svg {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`

export const InfoButtonBoxContent = styled.div`
  max-height: calc(80vh - 3.5rem);
  overflow-y: auto;
  overflow-x: hidden;
  p {
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: justify;
    padding-bottom: 0.5rem;
  }
`

export const RangeValue = styled.div`
  text-align: center;
  div {
    display: block !important;
    border-radius: 8px;
    text-align: center;
  }
  p {
    text-align: center;
    /* box-shadow: 10px 10px 10px rgba(0, 0, 0, 1); */
    width: max-content;
    font-size: 0.875rem;
    padding: 0.25rem;
    border-radius: 8px;
  }
`

export const RangeArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0;
`
