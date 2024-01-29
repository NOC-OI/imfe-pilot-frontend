import styled from 'styled-components'

export const TableContainer = styled.table`
  background: white;
  border-radius: 3px;
  border-collapse: collapse;
  height: 320px;
  margin: auto;
  max-width: max-content;
  padding: 5px;
  width: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  animation: float 5s infinite;
  text-align: center;
  th {
    padding: 0.25rem;
    color: #d5dde5;
    background: #1b1e24;
    border-bottom: 4px solid #9ea7af;
    border-right: 1px solid #343a45;
    font-size: 1rem;
    font-weight: 100;
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    vertical-align: middle;
  }

  th:first-child {
    border-top-left-radius: 3px;
  }

  th:last-child {
    border-top-right-radius: 3px;
    border-right: none;
  }

  tr {
    border-top: 1px solid #c1c3d1;
    border-bottom: 1px solid #c1c3d1;
    color: #666b85;
    font-size: 0.875rem;
    font-weight: normal;
    text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
    td:first-child {
      background: #4e5066;
      color: #d5dde5;
      font-size: 1rem;
    }
  }

  tr:hover td {
    background: #4e5066;
    color: #ffffff;
    border-top: 1px solid #22262e;
  }

  tr:first-child {
    border-top: none;
  }

  tr:last-child {
    border-bottom: none;
  }

  tr:last-child td:first-child {
    border-bottom-left-radius: 3px;
  }

  tr:last-child td:last-child {
    border-bottom-right-radius: 3px;
  }

  td {
    padding: 0.25rem;
    background: #ffffff;
    text-align: center;
    vertical-align: middle;
    font-weight: 300;
    font-size: 0.875rem;
    text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #c1c3d1;
  }

  td:last-child {
    border-right: 0px;
  }
`
