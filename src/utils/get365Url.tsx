export function get365Url() {
  // const tenantId = process.env.VITE_365_TENANCY_ID
  const rootURl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`

  const options = {
    client_id: process.env.VITE_365_CLIENT_ID as string,
    redirect_uri: process.env.VITE_365_REDIRECT_URI as string,
    response_type: 'code',
    scope: 'openid profile email',
    state: 'microsoft',
  }

  const qs = new URLSearchParams(options)
  return `${rootURl}?${qs.toString()}`
}
