import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './styles'

export function DefaulLayout() {
  return (
    <LayoutContainer>
      <Outlet />

    </LayoutContainer>
  )
}
