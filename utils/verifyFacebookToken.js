import newtworkRequest from './networkRequest'
import envconfig from '../config/envconfig'

export default (accessToken) => {
  return newtworkRequest
    .get(envconfig.facebookUrl + `&access_token=${accessToken}`)
}
