import styled from 'styled-components'

export const LayerTypeContainer = styled.div`
  margin: 0.5rem;
  margin-left: 3rem;
  border-radius: 16px;
  padding: 0.375rem;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`
