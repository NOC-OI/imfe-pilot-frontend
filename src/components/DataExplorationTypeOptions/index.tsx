import { useState } from 'react'
import { LayerTypeOptionsContainer } from './styles'
import {
  faChartSimple,
  faCircleInfo,
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

interface DataExplorationTypeOptionsProps {
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
  getPolyline: any
  setGetPolyline: any
}

export function DataExplorationTypeOptions({
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
  getPolyline,
  setGetPolyline,
}: DataExplorationTypeOptionsProps) {
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
    newSelectedLayer.opacity = defaultOpacity
    newSelectedLayer.zoom = true
    setSelectedLayers({
      ...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer,
    })
  }

  function removeMapLayer(layerInfo: any) {
    setLayerAction('remove')
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

  // function handleClickAnnotations() {
  //   setShowAnnotations((showAnnotations) => !showAnnotations)
  // }

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
      const newParams = subLayers[subLayer].params
      newParams.request = 'GetLegendGraphic'
      newParams.layer = newParams.layers
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

  function handleGenerateGraph() {
    setGetPolyline((getPolyline: any) => !getPolyline)
    setActualLayer([subLayers[subLayer].url])
  }
  console.log(subLayer)
  console.log(subLayers[subLayer].protected)
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
            value={JSON.stringify({
              subLayer: `${content}_${subLayer}`,
              dataInfo: subLayers[subLayer],
            })}
            type="checkbox"
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
            {subLayer
              .replace('Jncc', 'JNCC')
              .replace('Nbn', 'NBN')
              .replace('Auv', 'AUV')}
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
            {subLayers[subLayer].data_type !== 'Photo' ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={handleClickLegend}
              />
            ) : null}
            {subLayers[subLayer].data_type === 'COG' ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                onClick={handleGenerateGraph}
                className={getPolyline ? 'active' : ''}
              />
            ) : null}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              title="Zoom to the layer"
              onClick={handleClickZoom}
            />
            {/* {subLayers[subLayer].data_type !== 'Photo' ? ( */}
            <FontAwesomeIcon
              icon={faSliders}
              title="Change Opacity"
              onClick={handleClickSlider}
            />
            {/* ) : null} */}
            {/* {subLayers[subLayer].data_type !== 'Photo' ? (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={handleClickSlider}
              />
            ) : (
              <FontAwesomeIcon
                icon={faSliders}
                title="Select by Annotations"
                onClick={handleClickAnnotations}
              />
            )} */}
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
