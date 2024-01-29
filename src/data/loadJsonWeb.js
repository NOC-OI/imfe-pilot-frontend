import axios from 'axios'

export class GetJsonWeb {
  constructor(isLogged) {
    this.data = {}
    this.sortedData = null
    this.token = isLogged
  }

  async loadJson() {
    const url = process.env.VITE_WEBSITE_JSON_URL

    await axios.get(url).then(async (resp) => {
      this.data = resp.data
    })
  }
}
