import 'leaflet/dist/leaflet'
import './canvasField'
import * as L from 'leaflet'

export class GetCanvasLayer {
  constructor(text) {
    this.text = text
    this.s = null
    this.layer = null
  }

  async getLayer() {
    this.s = L.ScalarField.fromASCIIGrid(this.text)
    this.layer = L.canvasLayer.scalarField(this.s)
  }
}
