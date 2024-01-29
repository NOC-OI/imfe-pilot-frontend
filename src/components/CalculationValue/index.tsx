import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CalculationValueContainer,
  CalculationValueImage,
  CalculationValueTitle,
} from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../AreaSelector/styles'
import '../../../index.css'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface CalculationValueProps {
  calculationValue: any
  setCalculationValue: any
  selectedLayers: any
  setSelectedLayers: any
  listLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  setShowPhotos: any
}
const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

const BASIC_BUCKET_URL = `${JOSBaseUrl}haig-fras`

export function CalculationValue({
  calculationValue,
  setCalculationValue,
  selectedLayers,
  setSelectedLayers,
  listLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  setShowPhotos,
}: CalculationValueProps) {
  function handleClose() {
    setCalculationValue('')
  }

  const [activeButton, setActiveButton] = useState('')

  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  function changeMapLayer(newSelectedLayers: any) {
    setLayerAction('marker-changes')
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      newSelectedLayers.forEach((layerInfo: any) => {
        delete copy[layerInfo.subLayer]
        layerInfo.dataInfo.opacity = 1
        layerInfo.dataInfo.plotLimits = true
        layerInfo.dataInfo.zoom = true
        copy[layerInfo.subLayer] = layerInfo.dataInfo
      })
      return copy
    })
  }

  async function handleChangeMapLayer(e: any) {
    setActiveButton(e.currentTarget.id)
    const buttonValue = JSON.parse(e.currentTarget.value)
    const [column, result] = buttonValue.result.split('_')
    const newActualLayers: string[] = []
    const newSelectedLayers: { subLayer: string; dataInfo: any }[] = []
    Object.keys(buttonValue.value.layers).forEach((newActualLayer) => {
      buttonValue.value.layers[newActualLayer].forEach((layerClass: any) => {
        const newLayer = `${newActualLayer}_${layerClass}`
          .replace('Jncc', 'JNCC')
          .replace('Nbn', 'NBN')
          .replace('Auv', 'AUV')
        newActualLayers.push(newLayer)
        const layerInfo = {
          subLayer: newLayer,
          dataInfo:
            listLayers[newActualLayer].layerNames[
              layerClass
                .replace('Jncc', 'JNCC')
                .replace('Nbn', 'NBN')
                .replace('Auv', 'AUV')
            ],
        }
        if (verifyIfWasSelectedBefore(newLayer)) {
          layerInfo.dataInfo.selectedBefore = true
        } else {
          layerInfo.dataInfo.selectedBefore = false
        }
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          if (photo[column] === result) {
            layerInfo.dataInfo.show.push(photo.filename)
          }
        })
        newSelectedLayers.push(layerInfo)
      })
    })
    setActualLayer(newActualLayers)
    changeMapLayer(newSelectedLayers)
  }

  useEffect(() => {
    if (layerAction) {
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach((layer) => {
        if (selectedLayers[layer].data_type === 'Photo') {
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos([])
    }
  }, [selectedLayers])

  return (
    <CalculationValueContainer id="calculate-value">
      <div className="flex justify-end">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      {Object.keys(calculationValue.result).map((column) => {
        return (
          <div key={column}>
            <CalculationValueTitle>
              <ReactMarkdown
                children={column}
                remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                rehypePlugins={[rehypeKatex]}
                linkTarget={'_blank'}
              />
            </CalculationValueTitle>
            {Object.keys(calculationValue.result[column]).map((calc) => {
              return (
                <div key={`${column}_${calc}`}>
                  {calculationValue.result[column][calc].map(
                    (results: any, i: any) => {
                      if (typeof results === 'object') {
                        let name = results[column]
                        if (!name) {
                          name = results[Object.keys(results)[0]]
                        }
                        return (
                          <div
                            className="flex justify-center pb-5"
                            key={`${column}_${calc}_${name}`}
                          >
                            <Button
                              value={JSON.stringify({
                                value: calculationValue,
                                result: `${column}_${name}`,
                              })}
                              onClick={handleChangeMapLayer}
                              id={`${column}_${calc}_${name}`}
                              className={
                                activeButton === `${column}_${calc}_${name}`
                                  ? 'active-button'
                                  : ''
                              }
                              style={
                                !calculationValue.button
                                  ? {
                                      cursor: 'default',
                                    }
                                  : {}
                              }
                              disabled={!calculationValue.button}
                            >
                              {Object.keys(
                                calculationValue.result[column][calc][i],
                              ).map((key) => {
                                const result =
                                  calculationValue.result[column][calc][i][key]
                                if (key === 'filename') {
                                  const extension =
                                    calculationValue.result[column][calc][i]
                                      .fileformat
                                  return (
                                    <CalculationValueImage
                                      key={`${result}.${extension}`}
                                    >
                                      {calculationValue.sampleImage ? (
                                        <img
                                          src={`${JOSBaseUrl}${calculationValue.sampleImage}`}
                                        />
                                      ) : (
                                        <img
                                          src={`${BASIC_BUCKET_URL}/${result}.${extension}`}
                                        />
                                      )}
                                    </CalculationValueImage>
                                  )
                                } else if (key.slice(-5, -1) === 'Imag') {
                                  return (
                                    <CalculationValueImage
                                      key={`${key}_${result}`}
                                    >
                                      {calculationValue.sampleImage ? (
                                        <img
                                          src={`${JOSBaseUrl}${calculationValue.sampleImage}`}
                                        />
                                      ) : (
                                        <img
                                          src={`${BASIC_BUCKET_URL}/${result}`}
                                        />
                                      )}
                                    </CalculationValueImage>
                                  )
                                } else if (key !== 'fileformat') {
                                  return (
                                    <div key={`${key}_${results}`}>
                                      <p className="">
                                        {key !== 'Result' && `${key}: `}
                                        {typeof result === 'number'
                                          ? calculationValue.decimalPlaces
                                            ? result.toFixed(
                                                calculationValue.decimalPlaces,
                                              )
                                            : result.toFixed(0)
                                          : result}
                                      </p>
                                    </div>
                                  )
                                } else {
                                  return null
                                }
                              })}
                            </Button>
                          </div>
                        )
                      } else {
                        return (
                          <div key={results}>
                            <p className="">
                              {typeof results === 'number'
                                ? calculationValue.decimalPlaces
                                  ? results.toFixed(
                                      calculationValue.decimalPlaces,
                                    )
                                  : results.toFixed(0)
                                : results}
                            </p>
                          </div>
                        )
                      }
                    },
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </CalculationValueContainer>
  )
}
