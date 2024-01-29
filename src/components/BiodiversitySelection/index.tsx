/* eslint-disable no-multi-str */

import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { BiodiversityType } from '../BiodiversityType'
// import { YearSelection } from '../YearSelection'

interface BiodiversitySelectionProps {
  setCalculationValue: any
  setInfoButtonBox?: any
  selectedLayers?: any
  setSelectedLayers?: any
  setLayerAction?: any
  setActualLayer?: any
  listLayers?: any
  dataFields: any
  yearSelected: any
  setYearSelected: any
  setComparisonGraphData: any
}

export function BiodiversitySelection({
  setCalculationValue,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  setLayerAction,
  setActualLayer,
  listLayers,
  dataFields,
  yearSelected,
  setYearSelected,
  setComparisonGraphData,
}: BiodiversitySelectionProps) {
  const calcClasses = dataFields.biodiversity

  function handleClickLayerInfo(title: String, content: string, link: any) {
    setInfoButtonBox({
      title,
      content,
      link,
    })
  }

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <div>
          <h1>Biodiversity</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Biodiversity',
                'Biodiversity metrics in seabed images captured with the autonomous \
                underwater vehicle were calculated based on replicate photographic sample \
                units within each substratum types that were created by randomly selecting \
                tiles without replacement to meet the target sample unit size (as defined by \
                Benoist *et al*. 2019). \n \
                **Target sample unit size:** 150 m$^2$ \n \
                **Number of sample units in 2012:** \n \
                - hard: 6  \n \
                - hard+coarse: 10  \n \
                - hard+sand: 10 \n \
                - coarse+hard: 29 \n \
                - sand+hard: 6 \n \
                - coarse: 33 \n \
                - sand: 36 \n \
                **Number of sample units in 2015:** \n \
                - coarse - 21\
                ',
                { layers: ['Seabed Images_2012 AUV Image Survey'] },
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {/* <YearSelection
          yearSelected={yearSelected}
          setYearSelected={setYearSelected}
          allYearToogle={false}
        /> */}
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
            <BiodiversityType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              childs={calcClass.calcNames}
              setCalculationValue={setCalculationValue}
              setInfoButtonBox={setInfoButtonBox}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setLayerAction={setLayerAction}
              setActualLayer={setActualLayer}
              listLayers={listLayers}
              yearSelected={yearSelected}
              setComparisonGraphData={setComparisonGraphData}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
