import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CardDiscription,
  CardImage,
  CardPhoto,
  CardPhotoActive,
  PhotoListContainer,
} from './styles'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

interface PhotoListProps {
  showPhotos: any
  activePhoto: any
  setActivePhoto: any
  mapBounds: any
  infoButtonBox?: any
}

export function PhotoList({
  showPhotos,
  activePhoto,
  setActivePhoto,
  mapBounds,
  infoButtonBox,
}: PhotoListProps) {
  const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

  const BASIC_BUCKET_URL = `${JOSBaseUrl}haig-fras/output`

  function handleClickCard(showPhoto: any) {
    setActivePhoto(showPhoto)
  }
  const [localPhotoList, setLocalPhotoList] = useState(showPhotos)
  function reorderPhotos() {
    const shuffled = showPhotos.sort(() => 0.5 - Math.random())
    const n = shuffled.length > 10 ? 10 : shuffled.length
    const newList: any = []
    let count: number = 0
    let count2: number = 0
    if (activePhoto) {
      count++
      newList.push(activePhoto)
    }
    const lat = [mapBounds._southWest.lat, mapBounds._northEast.lat]
    const lng = [mapBounds._southWest.lng, mapBounds._northEast.lng]
    shuffled.every((el: any) => {
      if (count >= n) {
        return false // "break"
      }
      if (el.filename !== activePhoto.filename) {
        if (el.show) {
          count2++
          if (
            el.latitude > lat[0] &&
            el.latitude < lat[1] &&
            el.longitude > lng[0] &&
            el.longitude < lng[1]
          ) {
            newList.push(el)
            count++
          }
        }
      }
      return true
    })
    if (count2 === 0) {
      return []
    }
    return newList
  }

  useEffect(() => {
    if (showPhotos) {
      const newList = reorderPhotos()
      setLocalPhotoList(newList)
    }
  }, [mapBounds])

  useEffect(() => {
    const newList = reorderPhotos()
    setLocalPhotoList(newList)
  }, [showPhotos])
  const styleValue = {
    marginLeft: '-21rem',
  }

  return (
    <PhotoListContainer
      style={Object.keys(infoButtonBox).length > 0 ? styleValue : {}}
    >
      {localPhotoList.map((showPhoto: any) => {
        if (showPhoto.active) {
          return (
            <CardPhotoActive
              key={showPhoto.id}
              onClick={() => handleClickCard(showPhoto)}
            >
              <CardImage>
                <img src={`${BASIC_BUCKET_URL}/${showPhoto.filename}_1.png`} />
              </CardImage>
              <div>
                <CardDiscription>
                  <h2>{showPhoto.id}</h2>
                  <a
                    href={`/photos/${showPhoto.layerName.replace(' ', '-')}_${
                      showPhoto.id
                    }`}
                    title={'Show Image on Map'}
                    target={'_blank'}
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </a>
                </CardDiscription>
              </div>
            </CardPhotoActive>
          )
        } else {
          return (
            <CardPhoto
              key={showPhoto.id}
              onClick={() => handleClickCard(showPhoto)}
            >
              <CardImage>
                <img src={`${BASIC_BUCKET_URL}/${showPhoto.filename}_1.png`} />
              </CardImage>
              <div>
                <CardDiscription>
                  <h2>{showPhoto.id}</h2>
                  <a
                    href={`/photos/${showPhoto.layerName.replace(' ', '-')}_${
                      showPhoto.id
                    }`}
                    title={'Show Image on Map'}
                    target={'_blank'}
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </a>
                </CardDiscription>
              </div>
            </CardPhoto>
          )
        }
      })}
    </PhotoListContainer>
  )
}
