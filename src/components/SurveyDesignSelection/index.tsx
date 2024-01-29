import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { SurveyDesignType } from '../SurveyDesignType'

interface SurveyDesignSelectionProps {
  setInfoButtonBox?: any
  dynamicGraphData: any
  setDynamicGraphData: any
  fileSurveyDesign: any
  setFileSurveyDesign: any
  dataFields: any
  setDynamicTableData: any
  yearSelected: any
  setYearSelected: any
}

export function SurveyDesignSelection({
  setInfoButtonBox,
  dynamicGraphData,
  setDynamicGraphData,
  fileSurveyDesign,
  setFileSurveyDesign,
  dataFields,
  setDynamicTableData,
  yearSelected,
  setYearSelected,
}: SurveyDesignSelectionProps) {
  const calcClasses = dataFields.surveyDesign

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
          <h1>Survey Design</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Survey Design',
                'The digital twin allows users to design future surveys based on the data we have collected to maximize the cost-effectiveness of future surveys. Generation of interactive statistics enabling users to determine the ideal number of sample units. ',
                { layers: ['Seabed Images_2012 AUV Image Survey'] },
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {calcClasses.map((calcClass: any) => {
          return (
            <SurveyDesignType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              hideYears={calcClass.hideYears}
              childs={calcClass.calcNames}
              setInfoButtonBox={setInfoButtonBox}
              dynamicGraphData={dynamicGraphData}
              setDynamicGraphData={setDynamicGraphData}
              fileSurveyDesign={fileSurveyDesign}
              setFileSurveyDesign={setFileSurveyDesign}
              setDynamicTableData={setDynamicTableData}
              yearSelected={yearSelected}
              setYearSelected={setYearSelected}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
