import { ThreeDContainer } from './styles'
import { useEffect, useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { SideBar } from '../TileServer/styles'
import { ThreeDMap } from '../../components/ThreeDMap'
import { ThreeDDataExplorationSelection } from '../../components/ThreeDDataExplorationSelection'
import { useNavigate } from 'react-router-dom'
import { FlashMessages } from '../../components/FlashMessages'
import { LoginPopup } from '../../components/LoginPopup'
import { FullPagePopup } from '../../components/FullPagePopup'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { GetLayers } from '../../data/loadLayers'
import { Loading } from '../../components/Loading'
import { getUser } from '../../lib/auth'

export function ThreeD() {
  const navigate = useNavigate()

  const [selectedSidebarOption, setSelectedSidebarOption] =
    useState<string>('3D')
  const [threeD, setThreeD] = useState(null)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')
  const [loading, setLoading] = useState(true)

  const [layerLegend, setLayerLegend] = useState('')
  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  // const [activePhoto, setActivePhoto] = useState('')

  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(getUser())

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })

  useEffect(() => {
    if (flashMessage.messageType) {
      setShowFlash(true)
    }
  }, [isLogged])

  const dealWithLogin = process.env.VITE_LOGIN

  useEffect(() => {
    if (dealWithLogin !== '0') {
      if (!isLogged) {
        navigate('/login')
        setShowFlash(true)
      }
    }
  }, [])

  const fetchData = async () => {
    const rout = window.location.pathname
    const getLayers = new GetLayers(isLogged, rout)
    await getLayers.loadJsonLayers().then(async function () {
      setListLayers((listLayers: any) =>
        listLayers.lenght > 0 ? listLayers : getLayers.data,
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <ThreeDContainer>
      <SideBar>
        <SideSelection
          selectedSidebarOption={selectedSidebarOption}
          setSelectedSidebarOption={setSelectedSidebarOption}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          setShowPopup={setShowPopup}
          setShowLogin={setShowLogin}
          isLogged={isLogged}
          loading={loading}
        />
        {selectedSidebarOption === '3D' && (
          <ThreeDDataExplorationSelection
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            setLayerLegend={setLayerLegend}
            setInfoButtonBox={setInfoButtonBox}
            listLayers={listLayers}
            isLogged={isLogged}
            threeD={threeD}
            setThreeD={setThreeD}
          />
        )}
        {layerLegend ? (
          <DataExplorationLegend
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          />
        ) : null}
        {Object.keys(infoButtonBox).length !== 0 ? (
          <InfoButtonBox
            infoButtonBox={infoButtonBox}
            setInfoButtonBox={setInfoButtonBox}
          />
        ) : null}
      </SideBar>
      <ThreeDMap
        selectedLayers={selectedLayers}
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
        listLayers={listLayers}
        threeD={threeD}
      />
      {showPopup && <FullPagePopup setShowPopup={setShowPopup} />}

      {showLogin && (
        <LoginPopup
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          setShowLogin={setShowLogin}
          setFlashMessage={setFlashMessage}
        />
      )}
      {showFlash && (
        <FlashMessages
          type={flashMessage.messageType}
          message={flashMessage.content}
          duration={5000}
          active={showFlash}
          setActive={setShowFlash}
          position={'bcenter'}
          width={'medium'}
        />
      )}
      {loading ? <Loading /> : null}
    </ThreeDContainer>
  )
}
