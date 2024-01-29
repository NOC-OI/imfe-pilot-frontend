import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Pane,
  ScaleControl,
  ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'
import { InfoBox } from '../InfoBox'
import { GetCOGLayer, GetTifLayer, GetTileLayer } from './addGeoraster'
import { Loading } from '../Loading'
import { callBetterWMS } from './addBetterWMS'
import { GetGeoblazeValue } from './getGeoblazeValue'
import { GetMBTiles } from './addMBTiles'
import { GetPhotoMarker } from './addPhotoMarker'
import * as turf from '@turf/turf'
import chroma from 'chroma-js'
import LeafletRuler from '../LeafletRuler'

interface DisplayPositionProps {
  map: any
  depth: any
}

interface keyable {
  [key: string]: any
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
  selectedLayers: keyable
  actualLayer: string[]
  layerAction: String
  setLayerAction: any
  showPhotos: any
  setShowPhotos: any
  activePhoto: any
  setActivePhoto: any
  mapBounds: any
  setMapBounds: any
  selectedSidebarOption: any
  getPolyline: any
  setGraphData: any
  setShowFlash: any
  setFlashMessage: any
  surveyDesignCircleValues: any
  setSurveyDesignCircleValues: any
}

function MapHome1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  showPhotos,
  setShowPhotos,
  activePhoto,
  setActivePhoto,
  mapBounds,
  setMapBounds,
  selectedSidebarOption,
  getPolyline,
  setGraphData,
  setShowFlash,
  setFlashMessage,
  surveyDesignCircleValues,
}: MapProps) {
  const colorScale = chroma
    .scale(['#f00', '#0f0', '#00f', 'gray'])
    .mode('hsl')
    .colors(30)
  const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL
  const [map, setMap] = useState<any>(null)

  const [depth, setDepth] = useState({})

  const defaultView = [50.3, -8.1421]
  const [mapCenter, setMapCenter] = useState(
    new L.LatLng(defaultView[0], defaultView[1]),
  )
  const defaultWMSBounds = [
    [50.020174, -8.58279],
    [50.578429, -7.70616],
  ]

  // if (map) {
  //   console.log(Object.keys(map._layers).length)
  //   console.log(map._layers)
  // }

  const [loading, setLoading] = useState<boolean>(false)

  const activeIcon = L.icon({
    iconUrl: '/marker-icon_red.png',
    iconSize: [25, 25],
  })
  const smallIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconSize: [0.1, 0.1],
  })

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

  useEffect(() => {
    if (map) {
      if (
        ['Data Exploration', 'Species of Interest'].includes(
          selectedSidebarOption,
        )
      ) {
        map.options.minZoom = 3
      } else {
        map.setView(new L.LatLng(defaultView[0], defaultView[1]), 10.5)
        map.options.minZoom = 10
      }
    }
  }, [selectedSidebarOption])

  useEffect(() => {
    if (map) {
      map.on('moveend', function () {
        setMapBounds(map.getBounds())
        setMapCenter(map.getCenter())
      })
    }
  }, [map])

  async function getWMSLayer(layerName: any, actual: any) {
    const params: keyable = {
      service: 'wms',
      request: 'GetMap',
      version: '1.3.0',
      layers: layerName.params.layers,
      format: 'image/png',
      transparent: true,
      width: 20,
      height: 20,
      attribution: actual,
    }
    if (layerName.params.style) {
      params.style = layerName.params.style
    }
    const layer = callBetterWMS(layerName.url, params)
    return layer
  }

  async function changeIcons(photo: any) {
    map.eachLayer(function (mapLayer: any) {
      if (mapLayer.options.dataType === 'marker') {
        if (mapLayer.options.filename === photo.filename) {
          mapLayer.setIcon(activeIcon)
          if (!photo.notCenter) {
            map.setView(
              new L.LatLng(mapLayer._latlng.lat, mapLayer._latlng.lng),
              map._zoom,
            )
          }
        } else {
          const icon = L.divIcon({
            html: `<div class='all-icon'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="24"
                  stroke="black"
                  fill="${mapLayer.options.color}"
                />
              </svg>
            </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })
          mapLayer.setIcon(icon)
        }
      }
    })
  }

  function reorderPhotos(photos: any) {
    const shuffled = photos.sort(() => 0.5 - Math.random())
    const n = shuffled.length > 700 ? 700 : shuffled.length
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
            el.coordinates[1] > lat[0] &&
            el.coordinates[1] < lat[1] &&
            el.coordinates[0] > lng[0] &&
            el.coordinates[0] < lng[1]
          ) {
            newList.push(el.filename)
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

  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      let bounds
      if (layerName.data_type === 'wms') {
        layer = await getWMSLayer(layerName, actual)
        layer.setOpacity(0.7)
        bounds = defaultWMSBounds
      } else if (layerName.data_type === 'COG') {
        if (window.location.pathname === '/notileserver') {
          const getCOGLayer = new GetCOGLayer(layerName, actual)
          await getCOGLayer.parseGeo().then(function () {
            layer = getCOGLayer.layer
            // const nE = layer.getBounds().getNorthEast()
            // const sW = layer.getBounds().getSouthWest()
            // bounds = [
            //   [nE.lat, nE.lng],
            //   [sW.lat, sW.lng],
            // ]
            bounds = defaultWMSBounds
          })
        } else {
          const getCOGLayer = new GetTileLayer(layerName, actual, true)
          await getCOGLayer.getTile().then(function () {
            if (getCOGLayer.error) {
              setFlashMessage({
                messageType: 'error',
                content: getCOGLayer.error,
              })
              setShowFlash(true)
              return
            }
            layer = getCOGLayer.layer
            // bounds = [
            //   [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
            //   [getCOGLayer.bounds[1], getCOGLayer.bounds[2]],
            // ]
            bounds = defaultWMSBounds
          })
        }
      } else if (layerName.data_type === 'Photo') {
        // bounds = defaultWMSBounds
        const markers: any = []
        const color = colorScale[Math.floor(Math.random() * 30)]
        const color1 = colorScale[Math.floor(Math.random() * 30)]

        const shuffledPhotos = reorderPhotos(layerName.photos)
        await layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([
              photo.coordinates[0] + 0.003,
              photo.coordinates[1] + 0.003,
            ]),
          )
          markers.push(
            turf.point([
              photo.coordinates[0] - 0.003,
              photo.coordinates[1] - 0.003,
            ]),
          )
          if (shuffledPhotos.includes(photo.filename)) {
            const getPhotoMarker = new GetPhotoMarker(photo, actual, color)
            await getPhotoMarker.getMarker().then(async function () {
              map.addLayer(getPhotoMarker.layer)
              if (getPhotoMarker.layer) {
                getPhotoMarker.layer.on('click', async function (e) {
                  L.popup()
                    .setLatLng(e.latlng)
                    .setContent(getPhotoMarker.popupText)
                    .openOn(map)
                  photo.notCenter = true
                  setActivePhoto(photo)
                })
                if (layerName.show.includes(getPhotoMarker.fileName)) {
                  getPhotoMarker.layer.setOpacity(1)
                  getPhotoMarker.layer.setZIndexOffset(9999)
                } else {
                  getPhotoMarker.layer.setOpacity(0)
                  getPhotoMarker.layer.setIcon(smallIcon)
                  getPhotoMarker.layer.setZIndexOffset(-9999)
                }
              }
            })
          }
        })
        const turfConvex = turf.convex(turf.featureCollection(markers))
        const turfBbox = turf.bbox(turfConvex)
        bounds = [
          [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
          [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
        ]
        if (layerName.plotLimits) {
          const myStyle = {
            color1,
            fillColor: color1,
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.7,
          }
          if (turfConvex) {
            const turflayer = L.geoJson(turfConvex, {
              style: myStyle,
            })
            turflayer.options.attribution = actual
            turflayer.addTo(map)
          }
        }
      } else if (layerName.data_type === 'Photo-Limits') {
        const markers: any = []
        layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([
              photo.coordinates[0] + 0.003,
              photo.coordinates[1] + 0.003,
            ]),
          )
          markers.push(
            turf.point([
              photo.coordinates[0] - 0.003,
              photo.coordinates[1] - 0.003,
            ]),
          )
        })
        const color = colorScale[Math.floor(Math.random() * 30)]
        const myStyle = {
          color,
          fillColor: color,
          weight: 3,
          opacity: 0.7,
        }

        const turfConvex = turf.convex(turf.featureCollection(markers))

        if (turfConvex) {
          layer = L.geoJson(turfConvex, {
            style: myStyle,
          })
        }
      } else if (layerName.data_type === 'MBTiles') {
        const getMBTilesLayer = new GetMBTiles(layerName, actual)
        await getMBTilesLayer.getLayer().then(async function () {
          layer = getMBTilesLayer.layer
          if (layer) {
            layer.on('click', async function (e: any) {
              const strContent: string[] = []
              Object.keys(e.layer.properties).forEach((c) => {
                strContent.push(
                  `<p>${c}: ${
                    e.layer.properties[c] === ' ' ? '--' : e.layer.properties[c]
                  }<p>`,
                )
              })
              L.popup({ maxWidth: 200 })
                .setLatLng(e.latlng)
                .setContent(strContent.join(''))
                .openOn(map)
            })
          }
        })
      }
      if (layerName.data_type !== 'Photo') {
        layer.options.attribution = actual
        map.addLayer(layer, true)
        if (layerName.data_type === 'COG' && layerName.get_value) {
          map.on('mousemove', function (evt: { originalEvent: any }) {
            if (selectedLayers[actual]) {
              const latlng = map.mouseEventToLatLng(evt.originalEvent)
              const tileSize = { x: 256, y: 256 }
              const pixelPoint = map
                .project(latlng, Math.floor(map.getZoom()))
                .floor()
              const coords = pixelPoint.unscaleBy(tileSize).floor()
              coords.z = Math.floor(map.getZoom()) // { x: 212, y: 387, z: 10 }
              const getGeoblazeValue = new GetGeoblazeValue(
                layer,
                latlng,
                coords,
                layerName,
              )
              getGeoblazeValue.getGeoblaze().then(function () {
                const dep = getGeoblazeValue.dep
                const depthName = actual.split('_')[1]
                if (dep) {
                  if (dep > 0.0) {
                    setDepth((depth: any) => {
                      const copy = { ...depth }
                      copy[depthName] = dep.toFixed(2)
                      return {
                        ...copy,
                      }
                    })
                  }
                } else {
                  setDepth((depth: any) => {
                    const copy = { ...depth }
                    delete copy[depthName]
                    return {
                      ...copy,
                    }
                  })
                }
              })
            }
          })
        }

        layer && bringLayerToFront(layer)
      }
      if (layerName.data_type !== 'Photo') {
        bounds = defaultWMSBounds
      }
      map.fitBounds(bounds)
    })
    setLoading(false)
  }

  useEffect(() => {
    if (activePhoto) {
      const newShowPhotos = [...showPhotos]
      newShowPhotos.forEach((photo, i) => {
        if (activePhoto.filename === photo.filename) {
          newShowPhotos[i].active = true
        } else {
          newShowPhotos[i].active = false
        }
      })
      changeIcons(activePhoto)
      setShowPhotos([])
    }
  }, [activePhoto])

  function removeLayerFromMap(): void {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (activePhoto.layerName === layer.options.attribution) {
          setActivePhoto('')
        }
        setLayerAction('')
      }
    })
    setLoading(false)
  }
  useEffect(() => {
    if (map) {
      const actualLayer = 'bathymetry'
      let layerExist = false
      map.eachLayer(function (layer: any) {
        if (actualLayer.includes(layer.options.attribution)) {
          layerExist = true
          return false
        }
      })
      if (!layerExist) {
        setLoading(true)

        const url = `${JOSBaseUrl}haig-fras/frontend/images/bathymetry.tif`

        const fetchData = async () => {
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
                  setDepth((depth: any) => {
                    const copy = { ...depth }
                    copy.Depth = dep.toFixed(2)
                    return {
                      ...copy,
                    }
                  })
                } else {
                  setDepth((depth: any) => {
                    const copy = { ...depth }
                    copy.Depth = null
                    return {
                      ...copy,
                    }
                  })
                }
              })
            })
            setLoading(false)
          })
        }
        fetchData()
      }
    }
  }, [map])

  async function addLayerIntoMap() {
    await generateSelectedLayer()
    setLayerAction('')
  }

  // useEffect(() => {
  //   if (map) {
  //     map.eachLayer(function (layer: any) {
  //       if (layer.options.attribution === 'polygon') {
  //         map.removeLayer(layer)
  //       }
  //     })
  //     const polygon = L.polygon(latLonLimits, {
  //       attribution: 'polygon',
  //       color: '#ff96bc',
  //       weight: 2,
  //       opacity: 0.7,
  //     })
  //     polygon.addTo(map)
  //   }
  // }, [latLonLimits])

  // useEffect(() => {
  //   if (selectedArea) {
  //     const polygon = L.polygon(latLonLimits, {
  //       attribution: 'polygon',
  //       color: '#ff96bc',
  //       weight: 2,
  //       opacity: 0.7,
  //     })
  //     polygon.addTo(map)
  //   } else {
  //     if (map) {
  //       map.eachLayer(function (layer: any) {
  //         if (layer.options.attribution === 'polygon') {
  //           map.removeLayer(layer)
  //         }
  //       })
  //     }
  //   }
  // }, [selectedArea])

  function removeNormalLayerFromMap(attribution: string) {
    map.eachLayer(function (layer: any) {
      if (layer.options.attribution === attribution) {
        map.removeLayer(layer)
      }
    })
  }
  function addCircleLayerIntoMap() {
    const circle1 = L.circle(
      [mapCenter.lat, (mapCenter.lng + mapBounds._northEast.lng) / 2],
      surveyDesignCircleValues[1],
      {
        attribution: 'circle',
        color: '#ffd3c9',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.7,
      },
    )
    circle1.addTo(map)
    const circle2 = L.circle(
      [mapCenter.lat, (mapCenter.lng + mapBounds._northEast.lng) / 2],
      surveyDesignCircleValues[0],
      {
        attribution: 'circle',
        color: '#ff96bc',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.7,
      },
    )
    circle2.addTo(map)
  }

  useEffect(() => {
    if (surveyDesignCircleValues.length > 0) {
      removeNormalLayerFromMap('circle')
      addCircleLayerIntoMap()
    } else {
      if (map) {
        removeNormalLayerFromMap('circle')
      }
    }
  }, [surveyDesignCircleValues])

  useEffect(() => {
    if (map) {
      if (surveyDesignCircleValues.length > 0) {
        removeNormalLayerFromMap('circle')
        addCircleLayerIntoMap()
      }
    }
  }, [mapCenter])

  async function changeMapZoom() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        if (selectedLayers[layer.options.attribution].data_type !== 'Photo') {
          // const newBounds = [
          //   [layer.options.limits[3], layer.options.limits[0]],
          //   [layer.options.limits[1], layer.options.limits[2]],
          // ]
          map.fitBounds(defaultWMSBounds)
          bringLayerToFront(layer)
          // map.fitBounds(newBounds)
        } else {
          if (!layer.options.dataType) {
            bringLayerToFront(layer)
            map.fitBounds(defaultWMSBounds)
          }
        }
        setLayerAction('')
        return false
      }
    })
  }

  function changeMapOpacity() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        if (!layer.options.dataType) {
          if (layer.options.opacity) {
            layer.setOpacity(selectedLayers[layer.options.attribution].opacity)
          } else {
            const newStyle = layer.options.style
            newStyle.fillOpacity =
              selectedLayers[layer.options.attribution].opacity
            layer.setStyle(newStyle)
          }
        }
      }
    })
  }

  function changeMapMarkerShow() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (activePhoto.layerName === layer.options.attribution) {
          setActivePhoto('')
        }
      }
    })
    const markersAll: any = []
    actualLayer.forEach(async (actual) => {
      const color = colorScale[Math.floor(Math.random() * 30)]
      const markers: any = []
      await selectedLayers[actual].photos.map(async (photo: any) => {
        markersAll.push(
          turf.point([photo.coordinates[0], photo.coordinates[1]]),
        )
        markers.push(
          turf.point([
            photo.coordinates[0] + 0.003,
            photo.coordinates[1] + 0.003,
          ]),
        )
        markers.push(
          turf.point([
            photo.coordinates[0] - 0.003,
            photo.coordinates[1] - 0.003,
          ]),
        )
        const getPhotoMarker = new GetPhotoMarker(photo, actual, color)
        await getPhotoMarker.getMarker().then(async function () {
          if (getPhotoMarker.layer) {
            if (selectedLayers[actual].show.includes(getPhotoMarker.fileName)) {
              map.addLayer(getPhotoMarker.layer)
              // @ts-ignore
              getPhotoMarker.layer.on('click', async function (e) {
                L.popup()
                  .setLatLng(e.latlng)
                  .setContent(getPhotoMarker.popupText)
                  .openOn(map)
                photo.notCenter = true
                setActivePhoto(photo)
              })
              getPhotoMarker.layer.setOpacity(1)
              // getPhotoMarker.layer.setIcon(inactiveIcon)
              getPhotoMarker.layer.setZIndexOffset(9999)
            }
          }
        })
      })
      if (selectedLayers[actual].plotLimits) {
        const turfConvex = turf.convex(turf.featureCollection(markers))
        const color1 = colorScale[Math.floor(Math.random() * 30)]
        const myStyle = {
          color1,
          fillColor: color1,
          weight: 3,
          opacity: 0.7,
          fillOpacity: 0.7,
        }
        if (turfConvex) {
          const turflayer = L.geoJson(turfConvex, {
            style: myStyle,
          })
          turflayer.options.attribution = actual
          turflayer.addTo(map)
        }
      }
    })
    const turfConvexAll = turf.convex(turf.featureCollection(markersAll))
    const turfBbox = turf.bbox(turfConvexAll)
    const bounds = [
      [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
      [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
    ]
    map.fitBounds(bounds)
  }

  useEffect(() => {
    if (map) {
      map.closePopup()
    }
    if (layerAction === 'remove') {
      setLoading(true)
      removeLayerFromMap()
      setLayerAction('')
    } else if (layerAction === 'add') {
      setLoading(true)
      addLayerIntoMap()
      setLayerAction('')
    } else if (layerAction === 'zoom') {
      changeMapZoom()
      setLayerAction('')
    } else if (layerAction === 'opacity') {
      changeMapOpacity()
      setLayerAction('')
    } else if (layerAction === 'marker-changes') {
      changeMapMarkerShow()
      setLayerAction('')
    }
  }, [selectedLayers])

  const icon = L.icon({
    iconUrl: '/marker-icon_old.png',
    iconSize: [27, 45],
  })
  function handleSetLatlng(e: any) {
    let counter = 0
    const lineLayer: any[] = []
    Object.keys(map._layers).forEach((layer) => {
      if (map._layers[layer].options.attribution) {
        if (map._layers[layer].options.attribution === 'draw-polyline1') {
          if (lineLayer.length === 0) {
            lineLayer.push(map._layers[layer]._latlng)
            counter += 1
          }
        }
        if (map._layers[layer].options.attribution === 'draw-polyline2') {
          if (lineLayer.length === 1) {
            lineLayer.push(map._layers[layer]._latlng)
            counter += 1
          }
        }
      }
    })
    if (counter === 0) {
      const markerLayer = L.marker(e.latlng, {
        attribution: 'draw-polyline1',
        icon,
      })
        .addTo(map)
        .bindPopup('Point <br/>' + e.latlng)
      lineLayer.push(markerLayer.getLatLng())
    } else if (counter === 1) {
      const markerLayer = L.marker(e.latlng, {
        attribution: 'draw-polyline2',
        icon,
      })
        .addTo(map)
        .bindPopup('Point <br/>' + e.latlng)

      if (lineLayer.length === 1) {
        lineLayer.push(markerLayer.getLatLng())
      }
      L.polyline([lineLayer[0], lineLayer[1]], {
        color: 'red',
        attribution: 'draw-polyline3',
      }).addTo(map)
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
      map.off('click', handleSetLatlng)
      setGraphData(lineLayer)
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
      map.off('click', handleSetLatlng)
    }
  }

  useEffect(() => {
    if (map) {
      if (getPolyline) {
        setFlashMessage({
          messageType: 'warning',
          content: 'Select two points in the map to make a graph',
        })
        setShowFlash(true)
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.scrollWheelZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()
        map.on('click', handleSetLatlng)
      } else {
        map.dragging.enable()
        map.touchZoom.enable()
        map.doubleClickZoom.enable()
        map.scrollWheelZoom.enable()
        map.boxZoom.enable()
        map.keyboard.enable()
        map.off('click', handleSetLatlng)
        setGraphData(null)
        Object.keys(map._layers).forEach((layer) => {
          if (map._layers[layer].options) {
            if (map._layers[layer].options.attribution) {
              if (map._layers[layer].options.attribution === 'draw-polyline1') {
                map.removeLayer(map._layers[layer])
              } else if (
                map._layers[layer].options.attribution === 'draw-polyline2'
              ) {
                map.removeLayer(map._layers[layer])
              } else if (
                map._layers[layer].options.attribution === 'draw-polyline3'
              ) {
                map.removeLayer(map._layers[layer])
              }
            }
          }
        })
      }
    }
  }, [getPolyline])

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={new L.LatLng(defaultView[0], defaultView[1])}
        zoom={10.5}
        zoomSnap={0.1}
        maxZoom={30}
        minZoom={10}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <ZoomControl position="topright" />
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
        <ScaleControl position="topright" />
        <LeafletRuler />
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
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.actualLayer === nextMap.actualLayer &&
    prevMap.selectedArea === nextMap.selectedArea &&
    prevMap.latLonLimits === nextMap.latLonLimits &&
    prevMap.showPhotos === nextMap.showPhotos &&
    prevMap.activePhoto === nextMap.activePhoto &&
    prevMap.getPolyline === nextMap.getPolyline &&
    prevMap.surveyDesignCircleValues === nextMap.surveyDesignCircleValues
  )
}

export const MapHome = React.memo(MapHome1, mapPropsAreEqual)
