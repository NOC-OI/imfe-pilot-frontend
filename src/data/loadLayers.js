import axios from 'axios'

export class GetLayers {
  constructor(isLogged, rout) {
    this.data = {}
    this.rout = rout
    this.sortedData = null
    this.token = isLogged
    this.protectedAssets = {}
  }

  sortListLayers() {
    const sortedList = []
    this.data.forEach((listLayer) => {
      sortedList.push(listLayer.layerClass)
    })
    sortedList.sort()
    const newSortedList = []
    sortedList.forEach((sorted) => {
      this.data.forEach((listLayer) => {
        if (sorted === listLayer.layerClass) {
          newSortedList.push(listLayer)
        }
      })
    })
    return newSortedList
  }

  async logSignedUrl(protectedAssets) {
    const APIBaseUrl = process.env.VITE_API_URL

    const objectString = encodeURIComponent(JSON.stringify(protectedAssets))

    await fetch(
      `${APIBaseUrl}v1/user/aws?token=${this.token.token}&assets=${objectString}`,
    )
      .then(async (response) => await response.json())
      .then(async (jsonData) => {
        Object.keys(jsonData).forEach((layerClass) => {
          Object.keys(jsonData[layerClass]).forEach((layerType) => {
            this.data[layerClass].layerNames[layerType].signed_url =
              jsonData[layerClass][layerType].signed_url
          })
        })
      })
  }

  async loadJsonLayers() {
    let url
    if (this.rout === '/3d') {
      url = process.env.VITE_LAYERS3D_JSON_URL
    } else {
      url = process.env.VITE_LAYERS_JSON_URL
    }

    await axios.get(url).then(async (resp) => {
      this.data = await resp.data
      Object.keys(this.data).forEach((layerClass) => {
        Object.keys(this.data[layerClass].layerNames).forEach((layerName) => {
          if (this.data[layerClass].layerNames[layerName].protected) {
            if (!this.protectedAssets[layerClass]) {
              this.protectedAssets[layerClass] = {}
            }
            this.protectedAssets[layerClass][layerName] = {
              url: this.data[layerClass].layerNames[layerName].url
                .split('/')
                .slice(4)
                .join('/'),
            }
          }
        })
      })
      if (this.token) {
        await this.logSignedUrl(this.protectedAssets)
      }
    })
  }
}
