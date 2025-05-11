import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function AccountVerification() {
  //lay gtri email va token tu URL
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  //call api de verify account

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to={'/404'} />
  }

  if (!verified) {
    return <PageLoadingSpinner caption="Verifying account..." />
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
