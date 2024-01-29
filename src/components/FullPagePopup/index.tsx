import {
  faCashRegister,
  faCircleXmark,
  faCode,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPagePopupContainer } from './styles'

interface FullPagePopupProps {
  setShowPopup: any
}

export function FullPagePopup({ setShowPopup }: FullPagePopupProps) {
  function handleClose() {
    setShowPopup(false)
  }

  return (
    <FullPagePopupContainer onClick={handleClose}>
      <div className="w-[40rem] align-middle text-center">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <h2 className="text-center font-bold pb-3 capitalize text-3xl">
          Haig Fras Digital Twin - Pilot Study
        </h2>
        <div className="p-4">
          <p className="text-center font-bold text-xl">
            This pilot digital twin aims to monitor changes to benthic
            communities in the Haig Fras Marine Protected Area based on marine
            imagery datasets.
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
              <p className="text-center text-sm font-bold">Asset Register</p>
            </a>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
