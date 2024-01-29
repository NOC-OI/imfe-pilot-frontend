import { useEffect, useState } from 'react'
import { FlashMessages } from '../../components/FlashMessages'
import { LoginPopup } from '../../components/LoginPopup'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'

export function LoginPage() {
  const navigate = useNavigate()

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    const message = searchParams.get('message')
    if (message) {
      setFlashMessage({
        messageType: 'error',
        content: 'ORCID ID not allowed to login in this page',
      })
      setShowFlash(true)
    }
  }, [])

  const [isLogged, setIsLogged] = useState(getUser())

  useEffect(() => {
    if (isLogged) {
      navigate('/')
    }
  }, [isLogged])

  return (
    <>
      <LoginPopup
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        setFlashMessage={setFlashMessage}
      />
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
    </>
  )
}
