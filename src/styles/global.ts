import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border -box;
  }

  :focus{
    outline: 0;
    box-shadow: 0 0 0 2px ${(props) => props.theme['yellow-400']}
  }
  body{
    height: 100vh;
    width: 100vw;
    overflow-y: hidden;
    color: ${(props) => props.theme.black};
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }
  @media (max-width: 768px){
    html{
      font-size: 70%;
    }
  }
  @media (max-width: 1700px){
    html{
      font-size: 90%;
    }
  }


`
