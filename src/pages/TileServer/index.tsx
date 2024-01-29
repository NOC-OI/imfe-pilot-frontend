import { useEffect, useState } from 'react'
import { DataExplorationSelection } from '../../components/DataExplorationSelection'
import { MapHome } from '../../components/MapHome'
import { SideSelection } from '../../components/SideSelection'
import { TileServerContainer, SideBar } from './styles'
import { CalculationValue } from '../../components/CalculationValue'
import { PhotoList } from '../../components/PhotoList'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { HabitatSelection } from '../../components/HabitatSelection'
import { BiodiversitySelection } from '../../components/BiodiversitySelection'
import { IndicatorSpeciesSelection } from '../../components/IndicatorSpeciesSelection'
import { SurveyDesignSelection } from '../../components/SurveyDesignSelection'
import { FullPagePopup } from '../../components/FullPagePopup'
import { LoginPopup } from '../../components/LoginPopup'
import { FlashMessages } from '../../components/FlashMessages'
import { useNavigate } from 'react-router-dom'
import { GraphBox } from '../../components/GraphBox'
import { DynamicGraphBox } from '../../components/DynamicGraphBox'
import { GetJsonWeb } from '../../data/loadJsonWeb'
import { DynamicTableBox } from '../../components/DynamicTableBox'
import { GetLayers } from '../../data/loadLayers'
import { Loading } from '../../components/Loading'
import { ComparisonGraphBox } from '../../components/ComparisonGraphBox'
import { getUser } from '../../lib/auth'

export function TileServer() {
  const navigate = useNavigate()

  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>('')

  // const [selectedArea, setSelectedArea] = useState(false)

  // const [latLonLimits, setLatLonLimits] = useState([
  //   new L.LatLng(50.55, -8.21),
  //   new L.LatLng(50.55, -7.35),
  //   new L.LatLng(50.07, -7.35),
  //   new L.LatLng(50.07, -8.21),
  // ])

  const [surveyDesignCircleValues, setSurveyDesignCircleValues] = useState([])

  const [graphData, setGraphData] = useState(null)

  const [comparisonGraphData, setComparisonGraphData] = useState(null)

  const [dynamicGraphData, setDynamicGraphData] = useState(null)

  const [dynamicTableData, setDynamicTableData] = useState(null)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [yearSelected, setYearSelected] = useState(0)

  const [calculationValue, setCalculationValue] = useState('')

  const [showPhotos, setShowPhotos] = useState<object[]>([])

  const [layerLegend, setLayerLegend] = useState('')
  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [activePhoto, setActivePhoto] = useState('')

  const [fileSurveyDesign, setFileSurveyDesign] = useState('coarse')

  const [mapBounds, setMapBounds] = useState({
    _northEast: { lat: -89, lng: 179 },
    _southWest: { lat: -89, lng: 179 },
  })

  const [getPolyline, setGetPolyline] = useState(false)

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(true)
  const [loading, setLoading] = useState(true)

  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(getUser())

  const [NBNSpecies, setNBNSpecies] = useState(null)

  const [calClasses, setCalcClasses] = useState({})
  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })
  const fetchData = async () => {
    const getWeb = new GetJsonWeb()
    await getWeb.loadJson().then(async function () {
      setCalcClasses(getWeb.data)
    })
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

  return (
    <TileServerContainer>
      <SideBar>
        <SideSelection
          selectedSidebarOption={selectedSidebarOption}
          setSelectedSidebarOption={setSelectedSidebarOption}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          setShowPhotos={setShowPhotos}
          setShowPopup={setShowPopup}
          setShowLogin={setShowLogin}
          isLogged={isLogged}
          loading={loading}
        />
        {selectedSidebarOption === 'Data Exploration' && (
          <DataExplorationSelection
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            setLayerLegend={setLayerLegend}
            setInfoButtonBox={setInfoButtonBox}
            listLayers={listLayers}
            setShowPhotos={setShowPhotos}
            isLogged={isLogged}
            getPolyline={getPolyline}
            setGetPolyline={setGetPolyline}
          />
        )}
        {selectedSidebarOption === 'Seabed Types' && (
          <HabitatSelection
            setCalculationValue={setCalculationValue}
            setInfoButtonBox={setInfoButtonBox}
            dataFields={calClasses}
            yearSelected={yearSelected}
            setYearSelected={setYearSelected}
          />
        )}
        {selectedSidebarOption === 'Species of Interest' && (
          <IndicatorSpeciesSelection
            setCalculationValue={setCalculationValue}
            setInfoButtonBox={setInfoButtonBox}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
            setShowPhotos={setShowPhotos}
            dataFields={calClasses}
            NBNSpecies={NBNSpecies}
            setNBNSpecies={setNBNSpecies}
          />
        )}
        {selectedSidebarOption === 'Biodiversity' && (
          <BiodiversitySelection
            setCalculationValue={setCalculationValue}
            setInfoButtonBox={setInfoButtonBox}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            setLayerAction={setLayerAction}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
            dataFields={calClasses}
            yearSelected={yearSelected}
            setYearSelected={setYearSelected}
            setComparisonGraphData={setComparisonGraphData}
          />
        )}
        {selectedSidebarOption === 'Survey Design' && (
          <SurveyDesignSelection
            setInfoButtonBox={setInfoButtonBox}
            dynamicGraphData={dynamicGraphData}
            setDynamicGraphData={setDynamicGraphData}
            fileSurveyDesign={fileSurveyDesign}
            setFileSurveyDesign={setFileSurveyDesign}
            dataFields={calClasses}
            setDynamicTableData={setDynamicTableData}
            yearSelected={yearSelected}
            setYearSelected={setYearSelected}
          />
        )}
        {graphData ? (
          <GraphBox
            graphData={graphData}
            setGraphData={setGraphData}
            actualLayer={actualLayer}
            setGetPolyline={setGetPolyline}
          />
        ) : null}
        {comparisonGraphData ? (
          <ComparisonGraphBox
            comparisonGraphData={comparisonGraphData}
            setComparisonGraphData={setComparisonGraphData}
          />
        ) : null}
        {dynamicGraphData ? (
          <DynamicGraphBox
            dynamicGraphData={dynamicGraphData}
            setDynamicGraphData={setDynamicGraphData}
            surveyDesignCircleValues={surveyDesignCircleValues}
            setSurveyDesignCircleValues={setSurveyDesignCircleValues}
            fileSurveyDesign={fileSurveyDesign}
            setFileSurveyDesign={setFileSurveyDesign}
          />
        ) : null}
        {dynamicTableData ? (
          <DynamicTableBox
            dynamicTableData={dynamicTableData}
            setDynamicTableData={setDynamicTableData}
          />
        ) : null}
        {layerLegend ? (
          <DataExplorationLegend
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          />
        ) : null}
        {calculationValue && (
          <CalculationValue
            calculationValue={calculationValue}
            setCalculationValue={setCalculationValue}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            listLayers={listLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            setShowPhotos={setShowPhotos}
          />
        )}
        {Object.keys(infoButtonBox).length !== 0 ? (
          <InfoButtonBox
            infoButtonBox={infoButtonBox}
            setInfoButtonBox={setInfoButtonBox}
          />
        ) : null}
        {showPhotos.length > 0 &&
          selectedSidebarOption === 'Data Exploration' && (
            <PhotoList
              showPhotos={showPhotos}
              activePhoto={activePhoto}
              setActivePhoto={setActivePhoto}
              mapBounds={mapBounds}
              infoButtonBox={infoButtonBox}
            />
          )}
      </SideBar>
      <MapHome
        selectedLayers={selectedLayers}
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
        showPhotos={showPhotos}
        setShowPhotos={setShowPhotos}
        activePhoto={activePhoto}
        setActivePhoto={setActivePhoto}
        mapBounds={mapBounds}
        setMapBounds={setMapBounds}
        selectedSidebarOption={selectedSidebarOption}
        getPolyline={getPolyline}
        setGraphData={setGraphData}
        setShowFlash={setShowFlash}
        setFlashMessage={setFlashMessage}
        surveyDesignCircleValues={surveyDesignCircleValues}
        setSurveyDesignCircleValues={setSurveyDesignCircleValues}
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
    </TileServerContainer>
  )
}
