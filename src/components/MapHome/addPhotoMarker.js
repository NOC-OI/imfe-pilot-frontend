import 'leaflet/dist/leaflet'
import * as L from 'leaflet'
import { organisms } from '../../data/organisms'
import { Entity, Cartesian3 } from 'cesium'

export class GetPhotoMarker {
  constructor(layerName, actualLayer, color, files) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.layer = null
    this.popupText = ''
    this.fileName = null
    this.color = color
  }

  createPopup() {
    let imageUrl = ''
    if (this.layerName.imageUrl) {
      imageUrl = this.layerName.imageUrl
      if (imageUrl.slice(-12) !== 'no_image.png') {
        this.imageExtension = 'completeLink'
      }
    } else if (this.layerName.assets?.thumbnail) {
      imageUrl = this.layerName.assets.thumbnail.href
    }

    return `
    <b style="font-size: 1rem;">${this.actualLayer}</b><br><br>
    ${
      this.layerName.filename
        ? `<b>ID</b>: <em>${this.layerName.filename}</em><br>`
        : ''
    }
    ${
      this.layerName['Scientific name']
        ? `<b>SCIENTIFIC NAME</b>: <em>${this.layerName['Scientific name']}</em><br>`
        : ''
    }
    ${
      this.layerName.Area_seabed_m2
        ? `<b>AREA OF SURVEY</b>: <em>${this.layerName.Area_seabed_m2.toFixed(
            2,
          )}m²</em><br>`
        : ''
    }
    ${
      this.layerName.Habitat
        ? `<b>HABITAT</b>: <em>${this.layerName.Habitat}</em><br>`
        : ''
    }
    ${
      this.layerName['EUNIS.Habitat']
        ? `<b>HABITAT</b>: <em>${this.layerName['EUNIS.Habitat']}</em><br>`
        : ''
    }
    ${
      this.layerName.UKMarineHabitat
        ? `<b>UK Marine HABITAT</b>: <em>${this.layerName.UKMarineHabitat}</em><br>`
        : ''
    }
    ${
      this.layerName.Substratum
        ? `<b>Substratum</b>: <em>${this.layerName.Substratum}</em><br>`
        : ''
    }
    ${
      this.layerName.Caption
        ? `<b>Caption</b>: <em>${this.layerName.Caption}</em><br>`
        : ''
    }
    ${
      this.layerName.coordinates
        ? `<b>Lat</b>: <em>${this.layerName.coordinates[1]}</em><br><b>Long</b>: <em>${this.layerName.coordinates[0]}</em><br>`
        : ''
    }
    ${
      this.layerName['Start date']
        ? `<b>Ocurrence Day</b>: <em>${this.layerName['Start date']}</em><br>`
        : ''
    }
    ${
      this.layerName.Kingdom
        ? `<b>Kingdom</b>: <em>${this.layerName.Kingdom}</em><br>`
        : ''
    }
    ${
      this.layerName.Phylum
        ? `<b>Phylum</b>: <em>${this.layerName.Phylum}</em><br>`
        : ''
    }
    ${
      this.layerName.Class
        ? `<b>Class</b>: <em>${this.layerName.Class}</em><br>`
        : ''
    }
    ${
      this.layerName.Order
        ? `<b>Order</b>: <em>${this.layerName.Order}</em><br>`
        : ''
    }
    ${
      this.layerName.Family
        ? `<b>Family</b>: <em>${this.layerName.Family}</em><br>`
        : ''
    }
    ${
      this.layerName.Genus
        ? `<b>Genus</b>: <em>${this.layerName.Genus}</em><br>`
        : ''
    }
    ${
      this.layerName['Taxon author']
        ? `<b>Taxon author</b>: <em>${this.layerName['Taxon author']}</em><br>`
        : ''
    }
    ${
      this.layerName.Rightshoulder
        ? `<b>Right shoulder</b>: <em>${this.layerName.Rightshoulder}</em><br>`
        : ''
    }
    ${
      this.layerName['Basis of record']
        ? `<b>Basis of record</b>: <em>${this.layerName['Basis of record']}</em><br>`
        : ''
    }
    ${
      this.layerName['Dataset name']
        ? `<b>Dataset name</b>: <em>${this.layerName['Dataset name']}</em><br>`
        : ''
    }
    ${
      imageUrl &&
      `<a
          href="${imageUrl}"
          title="Show Image"
          target="_blank"
          style="display: flex; justify-content: center;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clip-rule="evenodd"
            />
          </svg>
        </a>`
    }
    `
  }

  async getMarker() {
    this.layer = {}
    const icon = L.divIcon({
      html: `<div class='all-icon'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="24"
            stroke="black"
            fill="${this.color}"
          />
        </svg>
      </div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })
    this.layer = L.marker(
      [this.layerName.coordinates[1], this.layerName.coordinates[0]],
      {
        riseOnHover: true,
        autoPanOnFocus: false,
        icon,
      },
    )

    const organismList = []
    organisms.forEach((organism) => {
      if (this.layerName[organism] === 1) {
        organismList.push(organism)
      }
    })

    this.popupText = this.createPopup()

    this.layer.options.attribution = this.actualLayer
    this.layer.options.organismList = organismList
    this.layer.options.filename = this.layerName.filename
    this.layer.options.layerName = this.layerName
    this.layer.options.popupText = this.popupText
    this.layer.options.color = this.color
    this.fileName = this.layerName.filename
    this.layer.options.dataType = 'marker'
  }

  async getMarker3D() {
    const position = Cartesian3.fromDegrees(
      this.layerName.coordinates[0],
      this.layerName.coordinates[1],
    )
    this.popupText = this.createPopup()

    const pointGraphics = { pixelSize: 10, color: this.color }
    this.layer = new Entity({
      position,
      point: pointGraphics,
      id: this.layerName.filename,
      description: this.popupText,
      attribution: this.actualLayer,
      name: this.actualLayer,
    })
  }
}
