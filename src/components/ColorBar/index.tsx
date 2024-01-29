import { ColorBarContainer, ColorBarItem } from './styles'

interface ColorBarProps {
  layerLegend: any
}

export function ColorBar({ layerLegend }: ColorBarProps) {
  return (
    <ColorBarContainer>
      <div className="flex justify-center font-extrabold gap-3">
        <p className="text-lg">{layerLegend.dataDescription[0]}</p>
        <p className="text-lg">{layerLegend.dataDescription[1]}</p>
      </div>
      <div className="flex justify-between font-extrabold">
        <p className="text-lg">
          {Math.min(...layerLegend.legend[1]).toFixed(1)}
        </p>
        <p className="text-lg">
          {Math.max(...layerLegend.legend[1]).toFixed(1)}
        </p>
      </div>
      <div className="flex">
        {layerLegend.legend[0].map((value: string) => (
          <ColorBarItem key={value} style={{ backgroundColor: value }}>
            <p>=</p>
          </ColorBarItem>
        ))}
      </div>
    </ColorBarContainer>
  )
}
