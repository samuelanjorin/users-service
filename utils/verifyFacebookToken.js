import newtworkRequest from './networkRequest'
import envconfig from '../config/envconfig'

export default (accessToken) => {
  let url = envconfig.facebookUrl + `&access_token=${accessToken}`
  console.log(url)
  let response = newtworkRequest.getRequest(url)
  return response
}
