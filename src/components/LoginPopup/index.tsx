import {
  faCashRegister,
  faCode,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'js-cookie'
import { FullPagePopupContainer } from '../FullPagePopup/styles'
import { useNavigate } from 'react-router-dom'
import { getOrcidUrl } from '../../utils/getOrcidUrl'
import { getUser } from '../../lib/auth'
import { get365Url } from '../../utils/get365Url'

interface LoginPopupProps {
  isLogged?: any
  setIsLogged?: any
  setShowLogin?: any
  setFlashMessage?: any
}

export function LoginPopup({
  isLogged,
  setIsLogged,
  setShowLogin,
  setFlashMessage,
}: LoginPopupProps) {
  function handleClose() {
    setShowLogin(false)
  }

  let user: any | null = null
  if (isLogged) {
    user = getUser()
  }

  const navigate = useNavigate()

  const handleLogout = async () => {
    Cookies.remove('token')
    setIsLogged(false)
    navigate('/login')
    setFlashMessage({
      messageType: 'success',
      content: 'You have successfully logged out',
    })
  }

  return (
    <>
      {user ? (
        <FullPagePopupContainer>
          <div className="w-96 align-middle text-center">
            <p className="text-center font-bold pb-3 capitalize text-3xl">
              {`Hi ${user.name.split(' ')[0].replace(',', '')}!`}
            </p>
            <p className="text-center font-bold pb-3 capitalize text-3xl">
              Are you sure you want do log out?
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={handleLogout} className="normal-button w-full">
                YES
              </button>
              <button onClick={handleClose} className="normal-button  w-full">
                CANCEL
              </button>
            </div>
          </div>
        </FullPagePopupContainer>
      ) : (
        <FullPagePopupContainer onClick={handleClose}>
          <div className="w-[40rem] align-middle text-center">
            <h2 className="text-center font-bold pb-3 capitalize text-3xl">
              Haig Fras Digital Twin - Pilot Study
            </h2>
            <div className="p-4">
              <p className="text-center font-bold text-xl">
                This pilot digital twin aims to monitor changes to benthic
                communities in the Haig Fras Marine Protected Area based on
                marine imagery datasets.
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-1">
                <a href="" target="_blank" className="p-4 cursor-pointer">
                  <FontAwesomeIcon icon={faVideo} />
                  <p className="text-center text-sm font-bold">About</p>
                </a>
                <a
                  href="https://imfe-pilot-documentation.co.uk/"
                  target="_blank"
                  className="p-4 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCode} />
                  <p className="text-center text-sm font-bold">Documentation</p>
                </a>
                <a
                  href="https://catalogue-imfe.ceh.ac.uk/pimfe/documents"
                  target="_blank"
                  className="p-4 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCashRegister} />
                  <p className="text-center text-sm font-bold">
                    Asset Register
                  </p>
                </a>
              </div>
            </div>
            <div className="flex">
              <a
                className="normal-button-big pt-4 pb-4 w-full flex justify-center align-middle text-center"
                href={getOrcidUrl()}
                role="button"
              >
                <img
                  className="pr-4 h-10"
                  src={
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ORCID_iD.svg/512px-ORCID_iD.svg.png'
                  }
                  alt=""
                />
                <p className="pt-3">Continue with ORCID</p>
              </a>
              <a
                className="normal-button-big pt-4 pb-4 w-full flex justify-center align-middle text-center"
                href={get365Url()}
                role="button"
              >
                <img
                  className="pr-4 h-10"
                  src={
                    'https://seeklogo.com/images/M/microsoft-office-logo-8B0EF31E09-seeklogo.com.png'
                  }
                  alt=""
                />
                <p className="pt-3">Continue with 365</p>
              </a>
            </div>
          </div>
        </FullPagePopupContainer>
      )}
    </>
  )
}
