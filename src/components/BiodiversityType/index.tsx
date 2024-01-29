import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { CalcTypeContainer, CalcTypeOptionsContainer } from './styles'
import { Loading } from '../Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { allYears } from '../../data/allYears'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown'
interface keyable {
  [key: string]: any
}

interface BiodiversityTypeProps {
  title: string
  content: string
  childs: any
  setCalculationValue: any
  setInfoButtonBox?: any
  selectedLayers: any
  setSelectedLayers: any
  setLayerAction: any
  setActualLayer: any
  listLayers: any
  yearSelected: any
  setComparisonGraphData: any
}

async function handleShowCalcValues(
  title: string,
  params: keyable,
  setCalculationValue: any,
  setLoading: any,
  setIsActiveText: any,
  yearSelected: any,
  activeText: any,
  setComparisonGraphData: any,
) {
  setLoading(true)
  setCalculationValue(null)
  setIsActiveText(activeText)
  const APIBaseUrl = process.env.VITE_API_URL
  let url = `${APIBaseUrl}${params.url}`

  async function getCalculationResults(url: string) {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    const data = await response.json()
    const deleteKey = Object.keys(data)[0]
    data[params.name] = data[deleteKey]
    delete data[deleteKey]
    params.result = data
    if (params.noButton) {
      params.button = false
    } else {
      params.button = true
    }
    params.layers = layers
    setLoading(false)
    return params
  }

  let fileNames = ''
  let layers = {}

  if (title === 'Interannual Monitoring') {
    setComparisonGraphData(null)

    async function getYearsGraphData() {
      const graphData = []
      const promises = []
      Object.keys(params.years).forEach(async (year: string) => {
        fileNames = `${params.years[year].file_names}`
        promises.push(
          getCalculationResults(url.replaceAll('file_names', fileNames)).then(
            (result) => {
              graphData.push({ year, result: result.result })
            },
          ),
        )
        Object.keys(params.years[year].layers).forEach((layer: any) => {
          if (Object.keys(layers).includes(layer)) {
            params.years[year].layers[layer].forEach((subLayer: string) => {
              layers[layer].push(subLayer)
            })
          } else {
            layers[layer] = params.years[year].layers[layer]
          }
        })
      })
      await Promise.all(promises)

      return graphData
    }
    const graphData = await getYearsGraphData()
    setComparisonGraphData(graphData)
  } else {
    fileNames = params.years[allYears[yearSelected]].file_names
    layers = params.years[allYears[yearSelected]].layers
    url = url.replaceAll('file_names', fileNames)
    setCalculationValue(await getCalculationResults(url))
  }
  // if (selectedArea) {
  //   url = `${url}&bbox=${latLonLimits[2].lat},${latLonLimits[0].lng},${latLonLimits[0].lat},${latLonLimits[2].lng}`
  // }
}

export function BiodiversityType({
  title,
  content,
  childs,
  setCalculationValue,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  setLayerAction,
  setActualLayer,
  listLayers,
  yearSelected,
  setComparisonGraphData,
}: BiodiversityTypeProps) {
  const [subCalcs, setSubCalcs] = useState([])

  const [isActive, setIsActive] = useState(false)
  const [isActiveText, setIsActiveText] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  function handleShowCalcOptions() {
    setIsActive((isActive) => !isActive)
    setSubCalcs((subCalcs) => (subCalcs.length === 0 ? childs : []))
  }

  function handleClickLayerInfo(title: string, content: String) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  function changeMapLayer(newSelectedLayers: any) {
    setLayerAction('marker-changes')
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      newSelectedLayers.forEach((layerInfo: any) => {
        delete copy[layerInfo.subLayer]
        layerInfo.dataInfo.opacity = 1
        layerInfo.dataInfo.zoom = true
        layerInfo.dataInfo.plotLimits = true
        copy[layerInfo.subLayer] = layerInfo.dataInfo
      })
      return copy
    })
  }
  async function handleChangeMapLayer(subLayer: any) {
    const newActualLayers: string[] = []
    const newSelectedLayers: { subLayer: string; dataInfo: any }[] = []
    Object.keys(subLayer.layers).forEach((newActualLayer) => {
      subLayer.layers[newActualLayer].forEach((layerClass: any) => {
        newActualLayers.push(`${newActualLayer}_${layerClass}`)
        const layerInfo = {
          subLayer: `${newActualLayer}_${layerClass}`,
          dataInfo: listLayers[newActualLayer].layerNames[layerClass],
        }
        if (verifyIfWasSelectedBefore(`${newActualLayer}_${layerClass}`)) {
          // eslint-disable-next-line dot-notation
          layerInfo.dataInfo['selectedBefore'] = true
        } else {
          // eslint-disable-next-line dot-notation
          layerInfo.dataInfo['selectedBefore'] = false
        }
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          if (photo[subLayer.tableName] > 0) {
            layerInfo.dataInfo.show.push(photo.filename)
          }
        })
        newSelectedLayers.push(layerInfo)
      })
    })
    setActualLayer(newActualLayers)
    changeMapLayer(newSelectedLayers)
  }

  return (
    <CalcTypeContainer>
      <div>
        <header id="general-types">
          <p onClick={handleShowCalcOptions}>{title}</p>
          <div>
            <span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                id="info-subsection-button"
                onClick={() => handleClickLayerInfo(title, content)}
              />
            </span>
            <span title="expand" onClick={handleShowCalcOptions}>
              {isActive ? (
                <ArrowCircleUp size={24} />
              ) : (
                <ArrowCircleDown size={24} />
              )}
            </span>
          </div>
        </header>
      </div>
      <div>
        {subCalcs.map((subCalc: any) => {
          return (
            <CalcTypeOptionsContainer
              key={`${title}_${subCalc.name}_${subCalc.url}`}
            >
              <label>
                {/* <p>{subCalcs[subCalc]['name']}</p> */}
                {Object.keys(subCalc.years).includes(allYears[yearSelected]) ||
                yearSelected === allYears.length - 1 ? (
                  <p
                    id="type-option"
                    className={
                      isActiveText === `${title}_${subCalc.name}_${subCalc.url}`
                        ? 'active-text cursor-pointer'
                        : 'cursor-pointer'
                    }
                    onClick={async () => {
                      await handleShowCalcValues(
                        title,
                        subCalc,
                        setCalculationValue,
                        setLoading,
                        setIsActiveText,
                        yearSelected,
                        `${title}_${subCalc.name}_${subCalc.url}`,
                        setComparisonGraphData,
                      )
                      await handleChangeMapLayer(subCalc)
                    }}
                  >
                    <ReactMarkdown
                      children={subCalc.name}
                      remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                      rehypePlugins={[rehypeKatex]}
                      linkTarget={'_blank'}
                    />
                  </p>
                ) : (
                  <p
                    id="type-option"
                    className={'opacity-40 cursor-not-allowed'}
                  >
                    {subCalc.name}
                  </p>
                )}
              </label>
            </CalcTypeOptionsContainer>
          )
        })}
      </div>
      {loading && <Loading />}
    </CalcTypeContainer>
  )
}
