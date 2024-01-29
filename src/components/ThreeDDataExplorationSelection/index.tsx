/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { ThreeDDataExplorationType } from '../ThreeDDataExplorationType'

interface ThreeDDataExplorationSelectionProps {
  selectedLayers: Object
  setSelectedLayers: any
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  isLogged?: any
  threeD: any
  setThreeD: any
}

export function ThreeDDataExplorationSelection({
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  isLogged,
  threeD,
  setThreeD,
}: ThreeDDataExplorationSelectionProps) {
  function handleClickLayerInfo(title: String, content: string) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <div>
          <h1>3D Data Exploration</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                '3D Data Exploration',
                'A GIS tool to explore the available data layers \
                for the region. \n \
                A description of all data used is available in the \
                [Asset Register](https://catalogue-imfe.ceh.ac.uk/pimfe/documents).',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {Object.keys(listLayers).map((layerClass: any) => {
          return (
            <ThreeDDataExplorationType
              key={layerClass}
              content={layerClass}
              childs={listLayers[layerClass].layerNames}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              isLogged={isLogged}
              threeD={threeD}
              setThreeD={setThreeD}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
