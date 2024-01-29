/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { HabitatType } from '../HabitatType'
import { Info } from 'phosphor-react'
// import { YearSelection } from '../YearSelection'

interface HabitatSelectionProps {
  setCalculationValue: any
  setInfoButtonBox?: any
  dataFields: any
  yearSelected: any
  setYearSelected: any
}

export function HabitatSelection({
  setCalculationValue,
  setInfoButtonBox,
  dataFields,
  yearSelected,
  setYearSelected,
}: HabitatSelectionProps) {
  const calcClasses = dataFields.habitats

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
          <h1>Seabed Types</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Seabed Types',
                'Habitats and seabed types are presented as defined by two publications: \
                Benoist, N.M.A., Morris, K.J., Bett, B.J., Durden, J.M., Huvenne, V.A.I., \
                Le Bas, T.P., Wynn, R.B., Ware, S.J., Ruhl, H.A., 2019. Monitoring mosaic \
                biotopes in a marine conservation zone by autonomous underwater vehicle. \
                Conservation Biology 33 (5), 1174-1186. doi: 10.1111/cobi.13312 \n \
                Possible habitat types are defined as: "hard", >=50% seafloor cover by \
                bedrock, boulder, cobbles; "intermediate", >=10% seafloor cover by bedrock, \
                boulder, cobbles; "coarse", >90% seafloor cover by gravelly sand, granules, \
                pebbles, shells; "sand", >90% seafloor cover by sand. \n \
                Possible substratum types are defined as: "hard", >=50% seafloor cover by \
                bedrock, boulder, cobbles; "+hard", >=10% seafloor cover by bedrock, \
                boulder, cobbles; "coarse", >=50% seafloor cover by gravelly sand, \
                granules, pebbles, shells; "+coarse", >=10% seafloor cover by gravelly \
                sand, granules, pebbles, shells; "sand", >=50% seafloor cover by sand; \
                "+sand", >=10% seafloor cover by sand \n \
                Marine Habitat Classification for Britain (https://mhc.jncc.gov.uk/) \n \
                From which habitat classes include circalittoral and sublittoral types: \
                Circalittoral fine mud, Sublittoral mixed sediment, Circalittoral sandy mud, \
                Circalittoral mixed sediment, Offshore circalittoral sand, Offshore \
                circalittoral coarse sediment, Offshore circalittoral mixed sediment \n \
                Note: Habitats as classified by Benoist *et al*. 2019 have been approximately \
                mapped to the Marine Habitat Classification for Britain.',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {/* <YearSelection
          yearSelected={yearSelected}
          setYearSelected={setYearSelected}
          allYearToogle={true}
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
            <HabitatType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              childs={calcClass.calcNames}
              setCalculationValue={setCalculationValue}
              setInfoButtonBox={setInfoButtonBox}
              yearSelected={yearSelected}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
