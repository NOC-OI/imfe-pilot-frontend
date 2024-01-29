import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../components/Loading'

export function Auth() {
  const navigate = useNavigate()

  const APIBaseUrl = process.env.VITE_API_URL

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(document.location.search)
      const code = searchParams.get('code')
      const state = searchParams.get('state')
        ? searchParams.get('state')
        : 'orcid'
      let response: any
      try {
        response = await axios.post(
          `${APIBaseUrl}v1/user/?code=${code}&state=${state}`,
        )
      } catch (error) {
        navigate('/login?message=not-allowed')
        return
      }

      const user = response.data
      const cookieExpiresInSeconds = 60 * 60 * 24 * 6

      Cookies.set('token', user, {
        path: '/',
        expires: cookieExpiresInSeconds,
      })
      navigate('/')
    }
    fetchData()
  }, [])

  return (
    <div>
      <Loading />
    </div>
  )
}
