/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { IndicatorSpeciesType } from '../IndicatorSpeciesType'
import { useEffect, useState } from 'react'

interface IndicatorSpeciesSelectionProps {
  setCalculationValue: any
  setInfoButtonBox?: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
  dataFields: any
  NBNSpecies: any
  setNBNSpecies: any
}

export function IndicatorSpeciesSelection({
  setCalculationValue,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
  dataFields,
  NBNSpecies,
  setNBNSpecies,
}: IndicatorSpeciesSelectionProps) {
  const calcClasses = dataFields.indicatorSpecies
  const [loading, setLoading] = useState<boolean>(false)

  function handleClickLayerInfo(title: String, content: string) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  async function getNBNSpecies() {
    setLoading(true)
    const APIBaseUrl = process.env.VITE_API_URL
    const url = `${APIBaseUrl}v1/calc/?filenames=layers%3Aseabed_images%3Anbn%3Anbn&extension=csv&calc=unique&calc_columns=Scientific%20name&drop_columns=Unnamed%3A%200%2Cfilename%2CRightsholder%2CTaxon%20author%2CBasis%20of%20record%2CDataset%20name%2Clatitude%2Clongitude%2CimageUrl%2CClass%2CPhylum%2CKingdom&lat_lon_columns=latitude%2Clongitude&exclude_index=false&all_columns=true`
    async function getCalculationResults() {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      const data = await response.json()
      setNBNSpecies(data)
      setLoading(false)
    }
    await getCalculationResults()
  }

  useEffect(() => {
    if (!NBNSpecies) {
      getNBNSpecies()
    }
  }, [NBNSpecies])
  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <div>
          <h1>Species of Interest</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Species of Interest',
                '**Species of conservation interest** \n \
                These are species of general interest for conservation in the area: \
                Pentapora foliacea, Cartilagenous fish \n \
                **Other Species** \n \
                National Biodiversity Network (NBN) Atlas species occurrence data \
                were extracted from https://nbnatlas.org',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {/* <AreaSelector
          setCalculationValue={setCalculationValue}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          latLonLimits={latLonLimits}
          setLatLonLimits={setLatLonLimits}
          setInfoButtonBox={setInfoButtonBox}
        /> */}
        {calcClasses.map((calcClass: any) => {
          return (
            <IndicatorSpeciesType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              childs={calcClass.calcNames}
              setCalculationValue={setCalculationValue}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
              NBNSpecies={NBNSpecies}
              loading={loading}
              setLoading={setLoading}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
