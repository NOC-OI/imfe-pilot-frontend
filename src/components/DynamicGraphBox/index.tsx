import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RangeArea, RangeValue } from './styles'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useState } from 'react'
import Plot from 'react-plotly.js'

interface DynamicGraphBoxProps {
  dynamicGraphData: any
  setDynamicGraphData: any
  surveyDesignCircleValues: any
  setSurveyDesignCircleValues: any
  fileSurveyDesign: any
  setFileSurveyDesign: any
}

export function DynamicGraphBox({
  dynamicGraphData,
  setDynamicGraphData,
  surveyDesignCircleValues,
  setSurveyDesignCircleValues,
  fileSurveyDesign,
  setFileSurveyDesign,
}: DynamicGraphBoxProps) {
  const [column, setColumn] = useState(
    dynamicGraphData.name.biodiversity
      ? dynamicGraphData.name.biodiversity[
          Object.keys(dynamicGraphData.name.biodiversity)[0]
        ]
      : 'Density',
  )

  const [hoverValue, setHoverValue] = useState(['--', '--'])
  function handleChangeFile(e: any) {
    setFileSurveyDesign(e.target.value)
  }
  function handleChangeColumn(e: any) {
    setColumn(e.target.value)
  }

  function handleClose() {
    setSurveyDesignCircleValues([])
    setDynamicGraphData(null)
  }

  function getCircleLimits(areas: any) {
    const radius = [
      Math.sqrt(areas[0] / Math.PI),
      Math.sqrt(areas[1] / Math.PI),
    ]
    setSurveyDesignCircleValues(radius)
  }

  function handleChangeSurveyDesignCircleValues(e: any) {
    if (e['xaxis.range']) {
      getCircleLimits(e['xaxis.range'])
    }
  }

  useEffect(() => {
    const minValue = Math.min(...dynamicGraphData.data['cum.Area_m2.mean'])
    const maxValue = Math.max(...dynamicGraphData.data['cum.Area_m2.mean'])
    getCircleLimits([minValue, maxValue])
  }, [])

  function showValue(e: any) {
    const newHoverValue = Math.log10(e.yvals[0]).toFixed(2)
    setHoverValue([
      e.xvals[0].toFixed(0),
      newHoverValue,
      Math.log10(
        dynamicGraphData.data[`cum.${column}.sd`][e.points[0].pointNumber],
      ).toFixed(2),
    ])
  }

  function generateStdData(
    stdColumn: string,
    meanColumn: string,
    operation: string,
  ) {
    if (operation === 'plus') {
      return dynamicGraphData.data[meanColumn].map(
        (value: number, idx: number) => {
          return value + dynamicGraphData.data[stdColumn][idx]
        },
      )
    } else {
      return dynamicGraphData.data[meanColumn].map(
        (value: number, idx: number) => {
          return value - dynamicGraphData.data[stdColumn][idx]
        },
      )
    }
  }

  const displayGraph = useMemo(
    () => (
      <Plot
        data={[
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: dynamicGraphData.data[`cum.${column}.mean`],
            mode: 'lines',
            marker: { color: 'red' },
            // hovertemplate: '<i>X</i>: %{x:.0f}' + '<br><b>Y</b>: %{y:.3f}<br>',
            hoverinfo: 'x+y',
          },
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: generateStdData(
              `cum.${column}.sd`,
              `cum.${column}.mean`,
              'plus',
            ),
            line: { width: 0 },
            marker: { color: '444' },
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'none',
          },
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: generateStdData(
              `cum.${column}.sd`,
              `cum.${column}.mean`,
              'minus',
            ),
            fill: 'tonexty',
            fillcolor: 'rgba(68, 68, 68, 0.3)',
            line: { width: 0 },
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'none',
          },
        ]}
        layout={{
          width: 300,
          height: 400,
          hovermode: 'closest',
          showlegend: false,
          // title: ,
          margin: { l: 50, r: 20, t: 20, b: 0 },
          xaxis: {
            rangeslider: {},
            hoverformat: '.0f',
            range: [
              Math.min(...dynamicGraphData.data['cum.Area_m2.mean']),
              column === 'Density'
                ? Math.max(...dynamicGraphData.data[`cum.Area_m2.mean`])
                : dynamicGraphData.data['cum.Area_m2.mean'][
                    dynamicGraphData.data[`cum.${column}.mean`].indexOf(
                      Math.max(...dynamicGraphData.data[`cum.${column}.mean`]),
                    )
                  ],
            ],
            title: {
              // text: 'Seabed area (m2)',
              // font: {
              //   family: 'Courier New, monospace',
              //   size: 18,
              //   color: '#7f7f7f'
              // }
            },
          },
          yaxis: {
            autorange: true,
            fixedrange: false,
            hoverformat: '.0f',
            type: ['Density', 'Hill1', 'Hill2'].includes(column) ? '-' : 'log',
            title: {
              text:
                column === 'Density'
                  ? 'Density (counts/m2)'
                  : `${Object.keys(dynamicGraphData.name.biodiversity).find(
                      (key) =>
                        dynamicGraphData.name.biodiversity[key] === column,
                    )}`,
              // font: {
              //   family: 'Courier New, monospace',
              //   size: 18,
              //   color: '#7f7f7f'
              // }
            },
          },
        }}
        onRelayout={handleChangeSurveyDesignCircleValues}
        onHover={showValue}
        config={{ responsive: true, displayModeBar: false }}
      />
    ),
    [column, dynamicGraphData],
  )

  return (
    <InfoButtonBoxContainer id="dynamic-graph">
      <div className="flex justify-end pb-3">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <p className="font-bold text-center pb-3 text-lg">
        {dynamicGraphData.name.name}
      </p>
      <div
        className="flex justify-around w-full pb-2 gap-2"
        id="select-habitat"
      >
        <label className="w-70 text-sm" htmlFor={`select_habitat`}>
          Habitat type:
        </label>
        <select
          onChange={handleChangeFile}
          className="w-50"
          id={`select_habitat`}
          name={`select_habitat`}
          defaultValue={fileSurveyDesign}
        >
          {dynamicGraphData.name.habitat.map((value: string) => {
            return (
              <option key={value} value={value}>
                {value.toUpperCase()}
              </option>
            )
          })}
        </select>
      </div>
      {dynamicGraphData.name.biodiversity ? (
        <div
          className="flex justify-around w-full pt-2 gap-2"
          id="select-biodiversity"
        >
          <label className="w-35 text-sm" htmlFor={`select_biodiversity`}>
            Biodiversity Calculation:
          </label>
          <select
            id={`select_biodiversity`}
            className="w-50"
            onChange={handleChangeColumn}
            name={`select_biodiversity`}
          >
            {Object.keys(dynamicGraphData.name.biodiversity).map(
              (value: string) => {
                return (
                  <option
                    key={value}
                    value={dynamicGraphData.name.biodiversity[value]}
                  >
                    {value}
                  </option>
                )
              },
            )}
          </select>
        </div>
      ) : null}
      {hoverValue[0] !== '--' ? (
        <div className="flex justify-center p-4">
          <RangeValue id="hover-value" className="text-center text-sm">
            <p className="bg-blue-500">
              Seabed Area: {hoverValue[0]} m2 / Value: {hoverValue[1]} +-
              {hoverValue[2]}
            </p>
          </RangeValue>
        </div>
      ) : (
        <div className="flex justify-center p-8"></div>
      )}
      {displayGraph}
      <RangeArea>
        <RangeValue className="text-center text-sm pl-10">
          <div id="range-value" className=" text-center bg-blue-500">
            <p>
              {(
                surveyDesignCircleValues[0] *
                surveyDesignCircleValues[0] *
                Math.PI
              ).toFixed(0)}{' '}
              m2
            </p>
            <p>
              {Math.round(
                (surveyDesignCircleValues[0] *
                  surveyDesignCircleValues[0] *
                  Math.PI) /
                  7.2898,
              )}{' '}
              images
            </p>
          </div>
        </RangeValue>
        <RangeValue className="text-center text-sm pr-5 ">
          <div id="range-value" className="text-center bg-red-500">
            <p>
              {(
                surveyDesignCircleValues[1] *
                surveyDesignCircleValues[1] *
                Math.PI
              ).toFixed(0)}{' '}
              m2
            </p>
            <p>
              {Math.round(
                (surveyDesignCircleValues[1] *
                  surveyDesignCircleValues[1] *
                  Math.PI) /
                  7.2898,
              )}{' '}
              images
            </p>
          </div>
        </RangeValue>
      </RangeArea>
      <div className="pt-4 text-center">
        <p className="text-center p-4">Seabed area (m2)</p>
      </div>
    </InfoButtonBoxContainer>
  )
}
