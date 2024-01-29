import { useEffect, useState } from 'react'
import { CalcTypeOptionsContainer } from '../BiodiversityType/styles'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { CheckCircle } from 'phosphor-react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

interface IndicatorSpeciesTypeOptionsProps {
  subLayer: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
  setLoading: any
  setCalculationValue: any
  NBNSpecies: any
}

export function IndicatorSpeciesTypeOptions({
  subLayer,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
  setLoading,
  setCalculationValue,
  NBNSpecies,
}: IndicatorSpeciesTypeOptionsProps) {
  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  const animatedComponents = makeAnimated()

  async function fetchDatatoUpdateCalculationBox(result: any) {
    setLoading(true)
    setCalculationValue(null)
    const APIBaseUrl = process.env.VITE_API_URL
    const url = `${APIBaseUrl}${subLayer.url}`
    async function getCalculationResults() {
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
      data[subLayer.name] = data[deleteKey]
      delete data[deleteKey]
      subLayer.result = data
      setCalculationValue(subLayer)
      setLoading(false)
    }
    await getCalculationResults()
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
  function reorderPhotos(photos: any) {
    const shuffled = photos.sort(() => 0.5 - Math.random())
    const n = shuffled.length > 700 ? 700 : shuffled.length
    const newList: any = []
    let count: number = 0
    shuffled.every((el: any) => {
      if (count >= n) {
        return false // "break"
      }
      newList.push(el)
      count++
      return true
    })
    return newList
  }
  async function handleChangeMapLayer(
    subLayer: any,
    updateCalculationBox: any,
    condition: string,
  ) {
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
          if (condition === 'notZero') {
            if (photo[subLayer.tableName] > 0) {
              layerInfo.dataInfo.show.push(photo.filename)
            }
          } else if (condition === 'equal') {
            if (subLayer.tableName === 'Start date') {
              const newDate = dayjs(photo[subLayer.tableName], 'DD/MM/YYYY')
              if (subLayer.name === '*Filter by Year*') {
                if (
                  newDate.year() >= selectedOption[0] &&
                  newDate.year() <= selectedOption[1]
                ) {
                  layerInfo.dataInfo.show.push(photo.filename)
                }
              } else {
                if (selectedOption.includes(newDate.month())) {
                  layerInfo.dataInfo.show.push(photo.filename)
                }
              }
            } else {
              if (selectedOption.includes(photo[subLayer.tableName])) {
                layerInfo.dataInfo.show.push(photo.filename)
              }
            }
          }
        })
        if (layerInfo.dataInfo.show.length > 700) {
          layerInfo.dataInfo.show = reorderPhotos(layerInfo.dataInfo.show)
        }
        newSelectedLayers.push(layerInfo)
      })
    })
    setActualLayer(newActualLayers)
    changeMapLayer(newSelectedLayers)
    if (updateCalculationBox) {
      await fetchDatatoUpdateCalculationBox(subLayer)
    }
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

  const [selectedOption, setSelectedOption] = useState([])

  const handleChange = (option: any) => {
    const options = []
    option.forEach((op: any) => {
      options.push(op.value)
    })
    setSelectedOption(options)
  }

  const handleChangeDate = (option: any) => {
    const options = []
    options.push(option[0].$y)
    options.push(option[1].$y)
    setSelectedOption(options)
  }
  const { RangePicker } = DatePicker

  const monthOptions = [
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 8 },
    { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 12 },
  ]

  return (
    <CalcTypeOptionsContainer>
      {subLayer.type === 'selector' ? (
        <div className="pt-1 flex w-11/12 justify-center">
          {subLayer.tableName === 'Start date' ? (
            subLayer.name === '*Filter by Year*' ? (
              <div className="flex w-full p-1">
                <RangePicker
                  placeholder={[
                    NBNSpecies['Start date'][0].slice(0, 4),
                    NBNSpecies['Start date'][1].slice(0, 4),
                  ]}
                  picker="year"
                  format={'YYYY'}
                  onChange={handleChangeDate}
                  onBlur={handleChangeDate}
                />
              </div>
            ) : (
              <div className="flex w-full">
                <Select
                  className="w-full p-1"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  placeholder={subLayer.name}
                  options={monthOptions}
                  onChange={handleChange}
                  maxMenuHeight={100}
                />
              </div>
            )
          ) : (
            <Select
              className="w-full p-1"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              placeholder={subLayer.name}
              options={NBNSpecies[subLayer.tableName]}
              onChange={handleChange}
              maxMenuHeight={100}
            />
          )}
          {selectedOption.length > 0 ? (
            <div title={subLayer.name}>
              <CheckCircle
                size={30}
                className="pl-1 pt-2 cursor-pointer"
                onClick={async () => {
                  await handleChangeMapLayer(subLayer, false, 'equal')
                }}
              />
            </div>
          ) : (
            <div title={'You need to select an option.'}>
              <CheckCircle
                size={30}
                className="pl-1 pt-2 opacity-40 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <label
            id="type-option"
            key={`${subLayer.name}_${subLayer}`}
            htmlFor={subLayer.name}
            onClick={async () => {
              await handleChangeMapLayer(subLayer, true, 'notZero')
            }}
          >
            <ReactMarkdown
              children={subLayer.name}
              remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              linkTarget={'_blank'}
            />
          </label>
        </div>
      )}
    </CalcTypeOptionsContainer>
  )
}
