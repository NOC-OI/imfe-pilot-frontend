import $ from 'jquery'
import * as L from 'leaflet'

const BetterWMS = L.TileLayer.WMS.extend({
  onAdd: function (map) {
    L.TileLayer.WMS.prototype.onAdd.call(this, map)
    map.on('click', this.getFeatureInfo, this)
  },

  onRemove: function (map) {
    L.TileLayer.WMS.prototype.onRemove.call(this, map)
    map.off('click', this.getFeatureInfo, this)
  },

  getFeatureInfo: function (evt) {
    const url = this.getFeatureInfoUrl(evt.latlng)
    const showResults = L.Util.bind(this.showGetFeatureInfo, this)

    $.ajax({
      url,
      success: function (data, status, xhr) {
        const err = typeof data === 'string' ? null : data
        showResults(err, evt.latlng, data)
      },
      error: function (xhr, status, error) {
        showResults(error)
      },
    })
  },

  getFeatureInfoUrl: function (latlng) {
    const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom())
    const size = this._map.getSize()
    const crs = L.CRS.EPSG3857
    const sw = crs.project(this._map.getBounds().getSouthWest())
    const ne = crs.project(this._map.getBounds().getNorthEast())

    const params = {
      request: 'GetFeatureInfo',
      service: 'wms',
      crs: 'EPSG:3857',
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: this.wmsParams.version,
      format: this.wmsParams.format,
      bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      info_format: 'text/html',
      opacity: 0.7,
    }

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x)
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y)
    const newUrl = this._url + L.Util.getParamString(params, this._url, true)

    return newUrl
  },

  showGetFeatureInfo: function (err, latlng, content) {
    if (err) {
      return
    }
    let verifyContent = content.split('body')[1]
    verifyContent = verifyContent.replace(/(\r|\n|\s|>|<)/g, '')
    verifyContent = verifyContent.replace('/', '')
    let newContent = content
    if (!verifyContent) {
      newContent = 'No data available'
    }
    L.popup({ maxWidth: 200 })
      .setLatLng(latlng)
      .setContent(newContent)
      .openOn(this._map)
  },
})

export const callBetterWMS = (url, params) => {
  const layer = new BetterWMS(url, params)
  return layer
}
