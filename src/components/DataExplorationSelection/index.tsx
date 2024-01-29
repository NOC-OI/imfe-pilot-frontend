/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from './styles'
import { DataExplorationType } from '../DataExplorationType'
import { Info } from 'phosphor-react'

interface DataExplorationSelectionProps {
  selectedLayers: Object
  setSelectedLayers: any
  actualLayer: string[]
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  setShowPhotos?: any
  isLogged?: any
  getPolyline?: any
  setGetPolyline?: any
}

export function DataExplorationSelection({
  selectedLayers,
  setSelectedLayers,
  actualLayer,
  setActualLayer,
  layerAction,
  setLayerAction,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  setShowPhotos,
  isLogged,
  getPolyline,
  setGetPolyline,
}: DataExplorationSelectionProps) {
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
          <h1>Data Exploration</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Data Exploration',
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
            <DataExplorationType
              key={layerClass}
              content={layerClass}
              childs={listLayers[layerClass].layerNames}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              setShowPhotos={setShowPhotos}
              isLogged={isLogged}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
