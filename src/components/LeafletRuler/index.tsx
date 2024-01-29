import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import './leaflet-ruler.css'
import { ruler } from './leaflet-ruler'

export default function LeafletRuler() {
  const map = useMap()

  useEffect(() => {
    ruler().addTo(map)
  }, [])

  return null
}
