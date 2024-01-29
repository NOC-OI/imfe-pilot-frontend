import {
  SideSelectionContainer,
  SideSelectionLink,
  SideSelectionLinkFinal,
} from './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleQuestion,
  faCircleUser,
  faCompassDrafting,
  faFishFins,
  faLayerGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Biodiversity } from '../../assets/biodiversity'
import { Species } from '../../assets/species'

interface SideSelectionProps {
  selectedSidebarOption?: string
  setSelectedSidebarOption?: any
  selectedLayers?: any
  setSelectedLayers?: any
  setActualLayer?: any
  setLayerAction?: any
  setShowPhotos?: any
  setShowPopup?: any
  setShowLogin?: any
  isLogged?: any
  loading?: any
}

export function SideSelection({
  selectedSidebarOption,
  setSelectedSidebarOption,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  setLayerAction,
  setShowPhotos,
  setShowPopup,
  setShowLogin,
  isLogged,
  loading,
}: SideSelectionProps) {
  const navigate = useNavigate()

  async function handleShowSelection(e: any) {
    if (
      window.location.pathname === '/3d' ||
      window.location.pathname.slice(0, 7) === '/photos'
    ) {
      navigate('/')
    } else {
      const oldSelectedSidebarOption = selectedSidebarOption
      if (oldSelectedSidebarOption === e.currentTarget.id) {
        setSelectedSidebarOption('')
      } else {
        setSelectedSidebarOption(e.currentTarget.id)
      }
    }
  }

  useEffect(() => {
    if (window.location.pathname !== '/3d') {
      if (selectedSidebarOption === 'Data Exploration') {
        const photoList: any[] = []
        Object.keys(selectedLayers).forEach((layer: string) => {
          if (selectedLayers[layer].data_type === 'Photo') {
            selectedLayers[layer].photos.forEach((photo: any) => {
              photoList.push(photo)
            })
          }
        })
        setShowPhotos([])
      } else {
        setShowPhotos([])
      }
    }
  }, [selectedSidebarOption])

  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setSelectedLayers({})
    setLayerAction('remove')
  }

  function handleGoToBathymetry() {
    if (window.location.pathname !== '/3d') {
      navigate('/3d')
    } else {
      setSelectedSidebarOption((selectedSidebarOption: string) =>
        selectedSidebarOption ? '' : '3D',
      )
    }
  }

  function handleToogleFullPagePopup() {
    setShowPopup((showPopup: any) => !showPopup)
  }

  function handleToogleLoginPopup() {
    setShowLogin((showLogin: any) => !showLogin)
  }
  return (
    <div>
      <SideSelectionContainer className={loading ? 'pointer-events-none' : ''}>
        <SideSelectionLink
          title={'Seabed Types'}
          onClick={handleShowSelection}
          id={'Seabed Types'}
          className={selectedSidebarOption === 'Seabed Types' ? 'active' : ''}
        >
          <Species />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Species of Interest'}
          onClick={handleShowSelection}
          id={'Species of Interest'}
          className={
            selectedSidebarOption === 'Species of Interest' ? 'active' : ''
          }
        >
          <FontAwesomeIcon icon={faFishFins} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Biodiversity'}
          onClick={handleShowSelection}
          id={'Biodiversity'}
          className={selectedSidebarOption === 'Biodiversity' ? 'active' : ''}
        >
          <Biodiversity />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Survey Design'}
          onClick={handleShowSelection}
          id={'Survey Design'}
          className={selectedSidebarOption === 'Survey Design' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faCompassDrafting} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Data Exploration'}
          onClick={handleShowSelection}
          id={'Data Exploration'}
          className={
            selectedSidebarOption === 'Data Exploration' ? 'active' : ''
          }
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'3D Data Exploration'}
          onClick={handleGoToBathymetry}
          id={'3D Data Exploration'}
          className={selectedSidebarOption === '3D' ? 'active' : ''}
        >
          <Icon icon="bi:badge-3d-fill" />
        </SideSelectionLink>
        <SideSelectionLink title={'Clean map'} onClick={handleEraseLayers}>
          <FontAwesomeIcon icon={faTrash} />
        </SideSelectionLink>
        <SideSelectionLinkFinal>
          <SideSelectionLink title={'Information about the application'}>
            <FontAwesomeIcon
              icon={faCircleQuestion}
              onClick={handleToogleFullPagePopup}
            />
          </SideSelectionLink>
          <SideSelectionLink title={isLogged ? 'Logout' : 'Login'}>
            <FontAwesomeIcon
              icon={faCircleUser}
              onClick={handleToogleLoginPopup}
            />
          </SideSelectionLink>
        </SideSelectionLinkFinal>
      </SideSelectionContainer>
    </div>
  )
}
