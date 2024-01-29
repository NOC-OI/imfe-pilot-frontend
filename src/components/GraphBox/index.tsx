import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { GetTitilerData } from './getTitilerData'
import { Loading } from '../Loading'
import Plot from 'react-plotly.js'

interface GraphBoxProps {
  graphData: any
  setGraphData: any
  actualLayer: any
  setGetPolyline: any
}

export function GraphBox({
  graphData,
  setGraphData,
  actualLayer,
  setGetPolyline,
}: GraphBoxProps) {
  const [data, setData] = useState<any>({ distance: [], value: [] })

  const [waitState, setWaitState] = useState(false)
  function handleClose() {
    setGetPolyline(false)
    setGraphData(null)
  }

  useEffect(() => {
    setTimeout(() => {
      setWaitState(true)
    }, 3000)
  }, [])

  useEffect(() => {
    const getTitilerData = new GetTitilerData(graphData, actualLayer[0])
    getTitilerData.fetchData().then(async function () {
      setData(getTitilerData.dataGraph)
    })
  }, [])
  return (
    <InfoButtonBoxContainer id="graph-box">
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">Graph</div>

      {!waitState ? (
        <div>
          <p>Generating graph...</p>
          <Loading />
        </div>
      ) : (
        <Plot
          data={[
            {
              x: data.distance,
              y: data.value,
              mode: 'lines',
              marker: { color: 'red' },
              // hovertemplate: '<i>X</i>: %{x:.0f}' + '<br><b>Y</b>: %{y:.3f}<br>',
              hoverinfo: 'x+y',
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
              hoverformat: '.0f',
              title: {
                text: 'Distance (km)',
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
              title: {
                text: '',
                // font: {
                //   family: 'Courier New, monospace',
                //   size: 18,
                //   color: '#7f7f7f'
                // }
              },
            },
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      )}
    </InfoButtonBoxContainer>
  )
}
