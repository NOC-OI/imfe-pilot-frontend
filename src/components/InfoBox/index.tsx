import { InfoBoxContainer } from './styles'

interface keyable {
  [key: string]: any
}

interface InfoBoxProps {
  position: null | keyable
  depth: keyable
}

export function InfoBox({ position = null, depth = {} }: InfoBoxProps) {
  let lat
  let lng
  if (position === null) {
    lat = '---'
    lng = '---'
  } else {
    let tempLat = position.lat.toFixed(6)
    let latSignal
    if (tempLat >= 0) {
      latSignal = 'N'
    } else {
      latSignal = 'S'
      tempLat = tempLat * -1
    }
    const latDegrees = String(Math.floor(tempLat)).padStart(2, '0')
    const latMinutes = String(Math.floor((tempLat % 1) * 60)).padStart(2, '0')
    const latSeconds = String(
      Math.floor((((tempLat % 1) * 60) % 1) * 60),
    ).padStart(2, '0')
    lat = `${latDegrees}°${latMinutes}'${latSeconds}${latSignal}`

    let tempLng = position.lng.toFixed(6)
    let lngSignal
    if (tempLng >= 0) {
      lngSignal = 'W'
    } else {
      lngSignal = 'E'
      tempLng = tempLng * -1
    }
    const lngDegrees = String(Math.floor(tempLng)).padStart(2, '0')
    const lngMinutes = String(Math.floor((tempLng % 1) * 60)).padStart(2, '0')
    const lngSeconds = String(
      Math.floor((((tempLng % 1) * 60) % 1) * 60),
    ).padStart(2, '0')
    lng = `${lngDegrees}°${lngMinutes}'${lngSeconds}${lngSignal}`
  }
  return (
    <InfoBoxContainer id="infobox-container">
      <h1>Haig Fras</h1>
      <div>
        <p>Lat:</p>
        <span>{lat}</span>
      </div>
      <div>
        <p>Lon:</p>
        <span>{lng}</span>
      </div>
      <div>
        <p>Depth:</p>
        {depth.Shipborne ? (
          <span>{`${depth.Shipborne} m`}</span>
        ) : depth.Emodnet ? (
          <span>{`${depth.Emodnet} m`}</span>
        ) : depth.Gebco ? (
          <span>{`${depth.Gebco} m`}</span>
        ) : depth.Depth ? (
          <span>{`${depth.Depth} m`}</span>
        ) : (
          <span>-- m</span>
        )}
      </div>
    </InfoBoxContainer>
  )
}
