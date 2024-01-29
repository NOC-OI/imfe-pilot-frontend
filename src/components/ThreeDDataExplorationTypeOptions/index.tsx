import { useState } from 'react'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import {
  faCircleInfo,
  faCube,
  faList,
  faLock,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Annotations } from '../Annotations'
import { colors, eunis } from '../../data/mbTilesEmodnetLegend'
import { getUser } from '../../lib/auth'
import { organisms } from '../../data/organisms'
import { GetTileLayer } from '../MapHome/addGeoraster'
import { oceanR } from '../MapHome/jsColormaps'

const defaultOpacity = 0.7

interface ThreeDDataExplorationTypeOptionsProps {
  content: any
  subLayer: any
  activeOpacity: any
  setActiveOpacity: any
  setActualLayer: any
  subLayers: any
  setLayerLegend: any
  layerAction: any
  setLayerAction: any
  selectedLayers: any
  setSelectedLayers: any
  setInfoButtonBox: any
  isLogged?: any
  threeD: any
  setThreeD: any
}

export function ThreeDDataExplorationTypeOptions({
  content,
  subLayer,
  activeOpacity,
  setActiveOpacity,
  setActualLayer,
  subLayers,
  setLayerLegend,
  layerAction,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
}: ThreeDDataExplorationTypeOptionsProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState(
    activeOpacity === `${content}_${subLayer}`,
  )

  const [showAnnotations, setShowAnnotations] = useState<boolean>(false)

  let user: any | null = null
  if (isLogged) {
    user = getUser()
  }

  function changeMapZoom(layerInfo: any) {
    setLayerAction('zoom')
    const newSelectedLayer = selectedLayers[layerInfo.subLayer]
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return { [layerInfo.subLayer]: newSelectedLayer, ...copy }
    })
  }
  function changeMapOpacity(layerInfo: any, opacity: number) {
    setLayerAction('opacity')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = opacity
    newSelectedLayer.zoom = true
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return { [layerInfo.subLayer]: newSelectedLayer, ...copy }
    })
  }
  async function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    if (newSelectedLayer.data_type === 'Photo') {
      newSelectedLayer.opacity = 0.3
    } else {
      newSelectedLayer.opacity = defaultOpacity
    }
    newSelectedLayer.zoom = true
    if (layerInfo.dataInfo.data_type === '3D') {
      setSelectedLayers({
        ...selectedLayers,
        [layerInfo.subLayer]: newSelectedLayer,
      })
      setSelectedLayers((selectedLayers: any) => {
        const copy = { ...selectedLayers }
        Object.keys(copy).forEach((layer) => {
          if (copy[layer].data_type === '3D') {
            delete copy[layer]
          }
        })
        return {
          [`${content}_${subLayer}`]: newSelectedLayer,
          ...copy,
        }
      })
    } else {
      setSelectedLayers({
        ...selectedLayers,
        [layerInfo.subLayer]: newSelectedLayer,
      })
    }
  }

  function removeMapLayer(layerInfo: any) {
    setLayerAction('remove')
    setThreeD((threeD: any) => {
      return threeD?.subLayer === layerInfo.subLayer ? null : threeD
    })
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return copy
    })
  }

  function verifyIfWasSelectedBefore(content: String, subLayer: string) {
    return !!selectedLayers[`${content}_${subLayer}`]
  }

  function getPreviousOpacityValue(content: String, subLayer: string) {
    return selectedLayers[`${content}_${subLayer}`].opacity
  }

  function handleClickLayerInfo(content: String, subLayer: string) {
    setInfoButtonBox({
      title: `${content} - ${subLayer}`,
      content: selectedLayers[`${content}_${subLayer}`].content,
    })
  }

  async function handleChangeMapLayer(e: any) {
    const layerInfo = JSON.parse(e.target.value)
    setActualLayer([layerInfo.subLayer])
    if (layerInfo.dataInfo.data_type === 'Photo') {
      if (e.target.checked) {
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          layerInfo.dataInfo.show.push(photo.filename)
        })
        layerInfo.dataInfo.plotLimits = true
        await addMapLayer(layerInfo)
      } else {
        setShowAnnotations(false)
        removeMapLayer(layerInfo)
      }
    } else {
      if (e.target.checked) {
        await addMapLayer(layerInfo)
      } else {
        setOpacityIsClicked(false)
        setActiveOpacity(null)
        removeMapLayer(layerInfo)
      }
    }
  }

  async function handleAddTerrainLayer() {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: `${content}_${subLayer}`,
        dataInfo: subLayers[subLayer],
      }),
    )
    setThreeD((threeD) => {
      return threeD?.subLayer === layerInfo.subLayer ? null : layerInfo
    })
  }

  async function handleChangeMapLayerRadio(e: any) {
    const layerInfo = JSON.parse(e.target.value)
    setActualLayer([layerInfo.subLayer])
    if (e.target.checked) {
      setOpacityIsClicked(false)
      setActiveOpacity(null)
      removeMapLayer(layerInfo)
    } else {
      await addMapLayer(layerInfo)
    }
  }

  function handleClickZoom() {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: `${content}_${subLayer}`,
        dataInfo: subLayers[subLayer],
      }),
    )
    setActiveOpacity(opacityIsClicked ? layerInfo.subLayer : null)
    setActualLayer([layerInfo.subLayer])
    changeMapZoom(layerInfo)
  }

  async function handleClickLegend() {
    if (subLayers[subLayer].data_type === 'wms') {
      const newParams = {
        service: 'wms',
        request: 'GetLegendGraphic',
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        width: 20,
        height: 20,
        layer: subLayers[subLayer].params.layers,
      }
      async function getURILegend(newParams: any) {
        const layerUrl = `${subLayers[subLayer].url}?`
        const response = await fetch(layerUrl + new URLSearchParams(newParams))
        const url = response.url
        setLayerLegend({ layerName: subLayer, url })
      }
      await getURILegend(newParams)
    } else if (subLayers[subLayer].data_type === 'MBTiles') {
      setLayerLegend({ layerName: subLayer, legend: [colors, eunis] })
    } else if (subLayers[subLayer].data_type === 'COG') {
      const getCOGLayer = new GetTileLayer(subLayers[subLayer], subLayer, true)
      await getCOGLayer.getStats().then(function () {
        const minValue = getCOGLayer.stats.b1.percentile_2
        const maxValue = getCOGLayer.stats.b1.percentile_98
        const difValues = maxValue - minValue
        const times = 30
        const cogColors = []
        const cogColorsValues = []
        for (let i = 0; i < times; i++) {
          cogColors.push(oceanR((1 / (times - 1)) * i))
          cogColorsValues.push(minValue + (difValues / (times - 1)) * i)
        }
        setLayerLegend({
          layerName: subLayer,
          dataDescription: ['Depth', '(m)'],
          legend: [cogColors, cogColorsValues],
          dataType: subLayers[subLayer].data_type,
        })
      })
    }
  }

  function handleClickSlider() {
    setOpacityIsClicked((opacityIsClicked) => !opacityIsClicked)
  }

  function handleChangeOpacity(e: any) {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: `${content}_${subLayer}`,
        dataInfo: subLayers[subLayer],
      }),
    )
    setActiveOpacity(layerInfo.subLayer)
    setActualLayer([layerInfo.subLayer])
    changeMapOpacity(layerInfo, e.target.value)
  }
  return (
    <LayerTypeOptionsContainer>
      <div
        id="type-option"
        className={
          user?.access
            ? ''
            : subLayers[subLayer].protected
            ? 'cursor-not-allowed'
            : ''
        }
      >
        <label
          key={`${content}_${subLayer}`}
          htmlFor={`${content}_${subLayer}`}
        >
          <input
            onChange={handleChangeMapLayer}
            onClick={
              subLayers[subLayer].data_type === '3D'
                ? handleChangeMapLayerRadio
                : null
            }
            value={JSON.stringify({
              subLayer: `${content}_${subLayer}`,
              dataInfo: subLayers[subLayer],
            })}
            type={subLayers[subLayer].data_type === '3D' ? 'radio' : 'checkbox'}
            checked={verifyIfWasSelectedBefore(content, subLayer)}
            id={`${content}_${subLayer}`}
            disabled={user?.access ? false : !!subLayers[subLayer].protected}
            className={
              user?.access
                ? ''
                : subLayers[subLayer].protected
                ? 'cursor-not-allowed'
                : ''
            }
          />
          <p
            className={
              user?.access
                ? ''
                : subLayers[subLayer].protected
                ? 'cursor-not-allowed'
                : ''
            }
          >
            {subLayer}
          </p>
          {user?.access ? null : subLayers[subLayer].protected ? (
            <FontAwesomeIcon
              icon={faLock}
              title={'You are not authorized to access this information.'}
              className="pb-0.5"
              style={{ cursor: 'help' }}
            />
          ) : null}
        </label>
        {verifyIfWasSelectedBefore(content, subLayer) ? (
          <div id="layer-edit">
            <FontAwesomeIcon
              id="info-subsection-button"
              icon={faCircleInfo}
              title={'Show Layer Info'}
              onClick={() => handleClickLayerInfo(content, subLayer)}
            />
            {!['Photo'].includes(subLayers[subLayer].data_type) ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={handleClickLegend}
              />
            ) : null}
            {['COG'].includes(subLayers[subLayer].data_type) && (
              <FontAwesomeIcon
                icon={faCube}
                title="Add 3D terrain to the Map"
                onClick={handleAddTerrainLayer}
                className={
                  threeD?.subLayer === `${content}_${subLayer}`
                    ? 'active'
                    : 'aaa'
                }
              />
            )}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              title="Zoom to the layer"
              onClick={handleClickZoom}
            />
            <FontAwesomeIcon
              icon={faSliders}
              title="Change Opacity"
              onClick={handleClickSlider}
            />
          </div>
        ) : null}
      </div>
      {showAnnotations && (
        <Annotations
          key={`${content}_${subLayer}`}
          subLayer={subLayer}
          content={content}
          layerAction={layerAction}
          setLayerAction={setLayerAction}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          setActualLayer={setActualLayer}
          organisms={organisms}
        />
      )}
      {opacityIsClicked && verifyIfWasSelectedBefore(content, subLayer) && (
        <input
          type="range"
          step={0.1}
          min={0}
          max={1}
          value={getPreviousOpacityValue(content, subLayer)}
          onChange={handleChangeOpacity}
        />
      )}
    </LayerTypeOptionsContainer>
  )
}
