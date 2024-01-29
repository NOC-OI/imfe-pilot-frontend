import React from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.VITE_MAPBOX_API_KEY

export class MapboxGL extends React.PureComponent {
  constructor(props) {
    super(props)
    this.mapContainer = React.createRef()
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      zoom: 6,
      center: [-6, 48.5],
      pitch: 70,
      bearing: 41,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
    })

    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-bathymetry-v2',
        tileSize: 512,
      })
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 10 })
    })
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    )
  }
}
