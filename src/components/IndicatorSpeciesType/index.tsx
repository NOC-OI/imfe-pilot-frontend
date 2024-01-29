import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
// import { LayerTypeContainer } from '../DataExplorationType/styles'
import { IndicatorSpeciesTypeOptions } from '../IndicatorSpeciesTypeOptions'
import { Loading } from '../Loading'
import { CalcTypeContainer } from '../BiodiversityType/styles'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface IndicatorSpeciesTypeProps {
  title: any
  content: any
  childs: any
  setCalculationValue: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
  NBNSpecies: any
  loading: any
  setLoading: any
}

export function IndicatorSpeciesType({
  title,
  content,
  childs,
  setCalculationValue,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
  NBNSpecies,
  loading,
  setLoading,
}: IndicatorSpeciesTypeProps) {
  const [subLayers, setSubLayers] = useState([])

  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    if (!loading) {
      setIsActive((isActive) => !isActive)
      setSubLayers((subLayers) =>
        Object.keys(subLayers).length === 0 ? childs : [],
      )
    }
  }
  return (
    <CalcTypeContainer>
      <div>
        <header
          id="general-types"
          className={loading ? 'opacity-40 cursor-not-allowed' : ''}
          onClick={handleShowLayers}
        >
          <ReactMarkdown
            children={title}
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            linkTarget={'_blank'}
          />
          <span title="expand">
            {isActive ? (
              <ArrowCircleUp size={24} />
            ) : (
              <ArrowCircleDown size={24} />
            )}
          </span>
        </header>
      </div>
      <div>
        {subLayers.map((subLayer: any) => {
          return (
            <IndicatorSpeciesTypeOptions
              key={`${content}_${subLayer.name}`}
              subLayer={subLayer}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
              setLoading={setLoading}
              setCalculationValue={setCalculationValue}
              NBNSpecies={NBNSpecies}
            />
          )
        })}
      </div>
      {loading && <Loading />}
    </CalcTypeContainer>
  )
}
