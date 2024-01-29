import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Plot from 'react-plotly.js'
import { useMemo } from 'react'

interface ComparisonGraphBoxProps {
  comparisonGraphData: any
  setComparisonGraphData: any
}

interface keyable {
  [key: string]: any
}

export function ComparisonGraphBox({
  comparisonGraphData,
  setComparisonGraphData,
}: ComparisonGraphBoxProps) {
  function handleClose() {
    setComparisonGraphData(null)
  }

  const graphData = useMemo(() => {
    const newGraphData: keyable = {}
    comparisonGraphData.forEach((data) => {
      Object.keys(data.result).forEach((result) => {
        data.result[result].Types.forEach((typeResults) => {
          if (!newGraphData[typeResults.substratum]) {
            newGraphData[typeResults.substratum] = {
              year: [],
              type: '',
              mean: [],
              std: [],
            }
          }
          newGraphData[typeResults.substratum].year.push(data.year.toString())
          newGraphData[typeResults.substratum].type = result
          newGraphData[typeResults.substratum].mean.push(
            Number(
              typeResults[Object.keys(typeResults)[1]].split(' +/- st dev ')[0],
            ),
          )
          newGraphData[typeResults.substratum].std.push(
            Number(
              typeResults[Object.keys(typeResults)[1]].split(' +/- st dev ')[1],
            ),
          )
        })
      })
    })
    return newGraphData
  }, [])

  const sectionTitle = useMemo(() => {
    let results: string
    comparisonGraphData.forEach((data) => {
      Object.keys(data.result).every((result) => {
        results = result
        return false
      })
    })
    return results
  }, [])

  const yLabel = useMemo(() => {
    let results: string
    comparisonGraphData.every((data) => {
      return Object.keys(data.result).every((result) => {
        return data.result[result].Types.every((typeResults) => {
          results = Object.keys(typeResults)[1]
          return false
        })
      })
    })
    return results
  }, [])

  return (
    <InfoButtonBoxContainer id="graph-box">
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">{sectionTitle}</div>
      {Object.keys(graphData).map((substratum) => {
        if (graphData[substratum].year.length > 1) {
          return (
            <div className="block">
              <Plot
                data={[
                  {
                    x: graphData[substratum].year,
                    y: graphData[substratum].mean,
                    error_y: {
                      type: 'data',
                      array: graphData[substratum].std,
                      visible: true,
                      color: 'red',
                    },
                    type: 'scatter',
                    marker: { color: 'green' },
                    hoverinfo: 'x+y',
                  },
                ]}
                layout={{
                  title: { text: substratum.toUpperCase() },
                  width: 300,
                  height: 300,
                  hovermode: 'closest',
                  showlegend: false,
                  xaxis: {
                    hoverformat: '.0f',
                    title: {
                      text: 'Time (years)',
                    },
                  },
                  yaxis: {
                    autorange: true,
                    fixedrange: false,
                    title: {
                      text: yLabel,
                    },
                  },
                }}
                config={{ responsive: true, displayModeBar: false }}
              />
            </div>
          )
        } else {
          return <></>
        }
      })}
    </InfoButtonBoxContainer>
  )
}
