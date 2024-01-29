import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LayerLegendContainer } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { ColorBar } from '../ColorBar'

interface LayerLegendProps {
  layerLegend: any
  setLayerLegend: any
}

export function DataExplorationLegend({
  layerLegend,
  setLayerLegend,
}: LayerLegendProps) {
  function handleClose() {
    setLayerLegend('')
  }

  return (
    <LayerLegendContainer id="legend-box">
      <div className="flex justify-end pb-1">
        <FontAwesomeIcon
          contentStyleType={'regular'}
          icon={faCircleXmark}
          onClick={handleClose}
        />
      </div>
      <div>
        <h1>{layerLegend.layerName}</h1>
        <div>
          {layerLegend.url ? (
            <img src={layerLegend.url} />
          ) : layerLegend.dataType ? (
            <ColorBar layerLegend={layerLegend} />
          ) : (
            layerLegend.legend[0].map((color: any, idx: any) => {
              return (
                <div className="flex p-1">
                  <div
                    style={{ backgroundColor: color }}
                    className="rounded w-4"
                  ></div>
                  <p>{layerLegend.legend[1][idx]}</p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </LayerLegendContainer>
  )
}
