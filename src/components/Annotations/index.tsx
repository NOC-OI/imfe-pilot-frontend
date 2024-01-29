import { useEffect, useState } from 'react'
import { AnnotationsContainer } from './styles'

interface keyable {
  [key: string]: any
}

interface AnnotationsProps {
  subLayer: any
  content: any
  layerAction: any
  setLayerAction: any
  selectedLayers: keyable
  setSelectedLayers: any
  setActualLayer: any
  organisms: any
}

export function Annotations({
  subLayer,
  content,
  layerAction,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  organisms,
}: AnnotationsProps) {
  const [annotations, setAnnotations] = useState<string[]>(organisms)
  const [annotationsAll, setAnnotationsAll] = useState<boolean>(true)

  useEffect(() => {
    if (layerAction) {
      const newSelectedLayer = selectedLayers[`${content}_${subLayer}`]
      newSelectedLayer.show = []
      newSelectedLayer.photos.forEach((photo: any) => {
        if (annotations.length > 0) {
          annotations.every((annotation: any) => {
            if (photo[annotation] === 1) {
              photo.show = true
              return false
            } else {
              photo.show = false
              return true
            }
          })
        } else {
          photo.show = false
        }
        if (photo.show) {
          newSelectedLayer.show.push(photo.filename)
        }
      })
      setSelectedLayers((selectedLayers: any) => {
        const copy = { ...selectedLayers }
        delete copy[`${content}_${subLayer}`]
        return {
          [`${content}_${subLayer}`]: newSelectedLayer,
          ...copy,
        }
      })
    }
  }, [annotations])

  function handleChangePhotos(e: any) {
    setLayerAction('marker-changes')
    if (e.target.value === 'SELECT ALL') {
      if (e.target.checked) {
        setAnnotations(organisms)
        setAnnotationsAll(true)
      } else {
        setAnnotations([])
        setAnnotationsAll(false)
      }
    } else {
      if (e.target.checked) {
        setAnnotations([e.target.value, ...annotations])
      } else {
        setAnnotations((annotations: any) =>
          annotations.filter(function (el: any) {
            return el !== e.target.value
          }),
        )
      }
    }
    setActualLayer([`${content}_${subLayer}`])
  }

  return (
    <AnnotationsContainer>
      <div key={`${content}_${subLayer}_ALL`}>
        <input
          onChange={handleChangePhotos}
          value={'SELECT ALL'}
          type="checkbox"
          checked={annotationsAll}
        />
        <p>{'ALL'}</p>
      </div>
      {organisms.map((organism: any) => {
        return (
          <div key={`${content}_${subLayer}_${organism}`}>
            <input
              onChange={handleChangePhotos}
              value={organism}
              type="checkbox"
              checked={annotations.includes(organism)}
            />
            <p>{organism}</p>
          </div>
        )
      })}
    </AnnotationsContainer>
  )
}
