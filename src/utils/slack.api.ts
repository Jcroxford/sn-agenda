import axios from 'axios'

const instance = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
  },
})
// =====================================================================================================================
// interfacaces
// =====================================================================================================================
interface HttpHeaders {
  Authorization: string
  'Content-Type'?: string
}
function http(json: boolean = true) {
  const headers: HttpHeaders = {
    Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
  }

  if(!json) headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return axios.create({
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
    },
  })
}
