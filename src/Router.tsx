import { Route, Routes } from 'react-router-dom'
import { DefaulLayout } from './layouts/DefaultLayout/index'
import { ThreeD } from './pages/ThreeD'
import { TileServer } from './pages/TileServer'
import { PhotoPage } from './pages/PhotoPage'
import { LoginPage } from './pages/Login'
import { Auth } from './pages/Auth'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaulLayout />}>
        <Route path="/" element={<TileServer />} />
        <Route path="/3d" element={<ThreeD />} />
        <Route path="/photos/:id" element={<PhotoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  )
}
