import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AreaSelectorContainer,
  Button,
  ButtonSelection,
  LatLonLimitsContainer,
} from './styles'
import { faGlobe, faObjectUngroup } from '@fortawesome/free-solid-svg-icons'
import * as L from 'leaflet'

interface AreaSelectorProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
}

export function AreaSelector({
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
}: AreaSelectorProps) {
  function handleWorldClick() {
    setSelectedArea(false)
  }
  function handleMapSelectClick() {
    setSelectedArea(true)
  }

  function updateLatLonValue(e: any) {
    const newLatLonLimits = latLonLimits
    const changedValue = e.target.name
    let newMinLat = parseFloat(newLatLonLimits[2].lat)
    let newMinLon = parseFloat(newLatLonLimits[0].lng)
    let newMaxLat = parseFloat(newLatLonLimits[0].lat)
    let newMaxLon = parseFloat(newLatLonLimits[2].lng)
    if (changedValue === 'minLat') {
      if (e.target.value) {
        newMinLat = parseFloat(e.target.value)
        if (newMinLat >= newMaxLat) {
          newMaxLat = newMinLat + 1
        }
      }
    } else if (changedValue === 'minLon') {
      if (e.target.value) {
        newMinLon = parseFloat(e.target.value)
        if (newMinLon >= newMaxLon) {
          newMaxLon = newMinLon + 1
        }
      }
    } else if (changedValue === 'maxLat') {
      if (e.target.value) {
        newMaxLat = parseFloat(e.target.value)
        if (newMinLat >= newMaxLat) {
          newMinLat = newMaxLat - 1
        }
      }
    } else if (changedValue === 'maxLon') {
      if (e.target.value) {
        newMaxLon = parseFloat(e.target.value)
        if (newMinLon >= newMaxLon) {
          newMinLon = newMaxLon - 1
        }
      }
    }
    setLatLonLimits([
      new L.LatLng(newMaxLat, newMinLon),
      new L.LatLng(newMaxLat, newMaxLon),
      new L.LatLng(newMinLat, newMaxLon),
      new L.LatLng(newMinLat, newMinLon),
    ])
  }

  const isSelectedAreaSelected = !selectedArea

  function LatLonLimits() {
    return (
      <LatLonLimitsContainer>
        <label>
          <p>Min Lat (DD°):</p>
          <input
            onBlur={updateLatLonValue}
            disabled={isSelectedAreaSelected}
            type={'number'}
            name={'minLat'}
            placeholder={'45.20'}
            min={-89.99}
            max={88.99}
            defaultValue={latLonLimits[2].lat}
          />
        </label>
        <label>
          <p>Max Lat (DD°):</p>
          <input
            onBlur={updateLatLonValue}
            disabled={isSelectedAreaSelected}
            type={'number'}
            name={'maxLat'}
            placeholder={'53.50'}
            min={-88.99}
            max={89.99}
            defaultValue={latLonLimits[0].lat}
          />
        </label>
        <label>
          <p>Min Lon (DD°):</p>
          <input
            onBlur={updateLatLonValue}
            disabled={isSelectedAreaSelected}
            type={'number'}
            name={'minLon'}
            min={-179.99}
            max={178.99}
            placeholder={'-10.10'}
            defaultValue={latLonLimits[0].lng}
          />
        </label>
        <label>
          <p>Max Lon (DD°):</p>
          <input
            onBlur={updateLatLonValue}
            disabled={isSelectedAreaSelected}
            type={'number'}
            name={'maxLon'}
            min={-178.99}
            max={179.99}
            placeholder={'2.20'}
            defaultValue={latLonLimits[2].lng}
          />
        </label>
      </LatLonLimitsContainer>
    )
  }

  return (
    <AreaSelectorContainer>
      <h1>SELECT AREA</h1>
      <ButtonSelection>
        <div>
          <Button
            onClick={handleWorldClick}
            className={!selectedArea ? 'active-button' : ''}
          >
            <FontAwesomeIcon title="All the World" icon={faGlobe} />
          </Button>
          <Button
            onClick={handleMapSelectClick}
            className={selectedArea ? 'active-button' : ''}
          >
            <FontAwesomeIcon
              title="Draw a polygon on the map"
              icon={faObjectUngroup}
            />
          </Button>
        </div>
        <LatLonLimits />
      </ButtonSelection>
    </AreaSelectorContainer>
  )
}
