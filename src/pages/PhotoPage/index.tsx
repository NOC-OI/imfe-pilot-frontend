import { PhotoPageContainer } from './styles'
import { useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { SideBar } from '../TileServer/styles'
import { useParams } from 'react-router'
import { MapHomeSimple } from '../../components/MapHomeSimple'

export function PhotoPage() {
  // const [selectedArea, setSelectedArea] = useState(false)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [showPhotos, setShowPhotos] = useState<object[]>([])

  const [contrast, setContrast] = useState<boolean>(false)
  const [layerAction, setLayerAction] = useState('')
  const { id } = useParams()

  console.log(showPhotos, setContrast, layerAction)
  return (
    <PhotoPageContainer>
      <SideBar>
        <SideSelection
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          setShowPhotos={setShowPhotos}
        />
      </SideBar>
      <MapHomeSimple
        photoId={id}
        contrast={contrast}
        actualLayer={actualLayer}
        setActualLayer={setActualLayer}
      />
    </PhotoPageContainer>
  )
}
