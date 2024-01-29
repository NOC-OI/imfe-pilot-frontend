import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Pane,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useState } from 'react'
import { InfoBox } from '../InfoBox'
import { GetTifLayer, GetTileLayer } from '../MapHome/addGeoraster'
import { Loading } from '../Loading'
import { GetGeoblazeValue } from '../MapHome/getGeoblazeValue'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface DisplayPositionProps {
  map: any
  depth: any
}

function DisplayPosition({ map, depth }: DisplayPositionProps) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    map.on('mousemove', (e: any) => {
      setPosition(e.latlng)
    })
  }, [map])
  return <InfoBox position={position} depth={depth} />
}

interface MapProps {
  photoId: any
  contrast: any
  actualLayer: any
  setActualLayer: any
}

function MapHome1({
  photoId,
  contrast,
  actualLayer,
  setActualLayer,
}: MapProps) {
  const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL
  const APIBaseUrl = process.env.VITE_API_URL

  const BASIC_BUCKET_URL = `${JOSBaseUrl}haig-fras/output`

  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState(false)

  const [map, setMap] = useState<any>(null)

  const [depth, setDepth] = useState(null)

  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  if (errorMessage) {
    navigate('/')
  }

  function bringLayerToFront(layer: any) {
    layer.bringToFront()
    const frontLayers = [
      'Coastline',
      'Marine Conservation Zones',
      'Special Areas of Conservation',
    ]
    map.eachLayer(function (mapLayer: any) {
      if (frontLayers.includes(mapLayer.options.attribution)) {
        mapLayer.bringToFront()
      }
    })
  }

  function getPhotoInfo() {
    const photoArray = photoId.split('_')
    const photoNumber = photoArray[photoArray.length - 1]
    photoArray.pop(photoArray.length - 1)
    const photoName = photoArray[photoArray.length - 1]
    photoArray.pop(photoArray.length - 1)
    const photoClass =
      photoArray.length > 1
        ? photoArray[photoArray.length - 1].join('_')
        : photoArray.join('_')
    return [photoNumber, photoName, photoClass.replace('-', ' ')]
  }

  const generateSelectedLayer = async (fitBounds: boolean) => {
    let layer: any
    let bounds
    const photoValues = getPhotoInfo()
    await axios
      .get(
        `${APIBaseUrl}csv?filenames=HF2012_other_data,HF2012_annotation_summary&columns=active:False,local_data_type:Marker-COG,show:True`,
      )
      .then((photos) => {
        photos.data.every((photo: any) => {
          if (photo.id.toString() === photoValues[0]) {
            if (photo.local_data_type === 'Marker-COG') {
              photo.url = `${BASIC_BUCKET_URL}/${photo.filename}_1.tif`
              const getCOGLayer = new GetTileLayer(photo, [photo.url], contrast)
              getCOGLayer.getTile().then(async function () {
                layer = getCOGLayer.layer
                bounds = [
                  [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
                  [getCOGLayer.bounds[1], getCOGLayer.bounds[2]],
                ]
                map.addLayer(layer, true)
                layer && bringLayerToFront(layer)
                if (fitBounds) {
                  map.fitBounds(bounds)
                }
                setLoading(false)
                setActualLayer([photo.url])
              })
            }
            return false
          } else {
            return true
          }
        })
      })
  }

  const fetchData = async (url: string, actualLayer: string) => {
    const getTifLayer = new GetTifLayer(url, [actualLayer])
    await getTifLayer.parseGeo().then(function () {
      map.addLayer(getTifLayer.layer)
      map.on('mousemove', function (evt: { originalEvent: any }) {
        const latlng = map.mouseEventToLatLng(evt.originalEvent)
        const getGeoblazeValue = new GetGeoblazeValue(
          getTifLayer.georaster,
          latlng,
        )
        getGeoblazeValue.getGeoblaze().then(function () {
          const dep = getGeoblazeValue.dep
          if (dep) {
            setDepth(dep[0].toFixed(0))
          } else {
            setDepth(null)
          }
        })
      })
    })
  }

  useEffect(() => {
    const actualLayer: string = 'bathymetry'
    if (map) {
      let layerExist = false
      map.eachLayer(function (layer: any) {
        if (actualLayer.includes(layer.options.attribution)) {
          layerExist = true
          return false
        }
      })
      if (!layerExist) {
        setLoading(true)
        const url = `${JOSBaseUrl}haig-fras/frontend/bathymetry.tif`

        fetchData(url, actualLayer)
        generateSelectedLayer(true)
      }
    }
  }, [map])

  function removeLayerFromMap(): void {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        map.removeLayer(layer)
      }
    })
  }

  useEffect(() => {
    if (map) {
      setLoading(true)

      removeLayerFromMap()

      generateSelectedLayer(false)
    }
  }, [contrast])

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={[50.39415159013279, -7.712108868853798]}
        zoom={5}
        maxZoom={30}
        minZoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <LayersControl>
          <LayersControl.BaseLayer checked name="OSM">
            <Pane name="OSM" style={{ zIndex: -1 }}>
              <TileLayer
                attribution={'© OpenStreetMap'}
                maxZoom={30}
                url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
              />
            </Pane>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA Blue Marble">
            <Pane name="NASA" style={{ zIndex: -1 }}>
              <TileLayer
                url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                attribution="&copy; NASA Blue Marble, image service by OpenGeo"
              />
            </Pane>
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Special Areas of Conservation">
            <WMSTileLayer
              attribution="Special Areas of Conservation"
              url="https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?"
              params={{
                service: 'wms',
                request: 'GetMap',
                version: '1.3.0',
                layers: 'sac_mc_full',
                format: 'image/png',
                transparent: true,
                width: 256,
                height: 256,
              }}
              opacity={1}
              zIndex={9999}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Marine Conservation Zones">
            <WMSTileLayer
              attribution="Marine Conservation Zones"
              url="https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?"
              params={{
                service: 'wms',
                request: 'GetMap',
                version: '1.3.0',
                layers: 'mcz',
                format: 'image/png',
                transparent: true,
                width: 256,
                height: 256,
              }}
              opacity={1}
              zIndex={9998}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    ),
    [map],
  )

  return (
    <div>
      {displayMap}
      {map ? <DisplayPosition map={map} depth={depth} /> : null}
      {loading ? <Loading /> : null}
    </div>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return (
    prevMap.photoId === nextMap.photoId && prevMap.contrast === nextMap.contrast
  )
}

export const MapHomeSimple = React.memo(MapHome1, mapPropsAreEqual)
