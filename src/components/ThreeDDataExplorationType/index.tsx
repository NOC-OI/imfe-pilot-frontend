import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { CalcTypeContainer } from '../BiodiversityType/styles'
import { ThreeDDataExplorationTypeOptions } from '../ThreeDDataExplorationTypeOptions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube } from '@fortawesome/free-solid-svg-icons'

interface keyable {
  [key: string]: any
}

interface ThreeDDataExplorationTypeProps {
  content: String
  childs: Object
  selectedLayers: keyable
  setSelectedLayers: any
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  setLayerLegend: any
  setInfoButtonBox?: any
  isLogged?: any
  threeD: any
  setThreeD: any
}

export function ThreeDDataExplorationType({
  content,
  childs,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  setLayerLegend,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
}: ThreeDDataExplorationTypeProps) {
  const [subLayers, setSubLayers] = useState<keyable>({})

  const [activeOpacity, setActiveOpacity] = useState(null)

  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
    setSubLayers((subLayers) =>
      Object.keys(subLayers).length === 0 ? childs : {},
    )
  }

  return (
    <CalcTypeContainer>
      <div>
        <header id="general-types" onClick={handleShowLayers}>
          <div className="flex">
            <p>{content}</p>
            {content === 'Bathymetry' ? (
              threeD ? (
                <FontAwesomeIcon
                  className="pl-3 active"
                  icon={faCube}
                  title="Terrain layer active"
                />
              ) : (
                <FontAwesomeIcon
                  className="pl-3"
                  icon={faCube}
                  title="Terrain layer available"
                />
              )
            ) : null}
          </div>
          <span title="expand">
            {isActive ? (
              <ArrowCircleUp size={24} />
            ) : (
              <ArrowCircleDown size={24} />
            )}
          </span>
        </header>
      </div>
      <div>
        {Object.keys(subLayers).map((subLayer) => {
          if (subLayers[subLayer].data_type !== 'MBTiles') {
            return (
              <ThreeDDataExplorationTypeOptions
                key={`${content}_${subLayer}`}
                subLayer={subLayer}
                content={content}
                activeOpacity={activeOpacity}
                setActiveOpacity={setActiveOpacity}
                setActualLayer={setActualLayer}
                subLayers={subLayers}
                setLayerLegend={setLayerLegend}
                layerAction={layerAction}
                setLayerAction={setLayerAction}
                selectedLayers={selectedLayers}
                setSelectedLayers={setSelectedLayers}
                setInfoButtonBox={setInfoButtonBox}
                isLogged={isLogged}
                threeD={threeD}
                setThreeD={setThreeD}
              />
            )
          } else {
            return <div key={`${content}_${subLayer}`}></div>
          }
        })}
      </div>
    </CalcTypeContainer>
  )
}
