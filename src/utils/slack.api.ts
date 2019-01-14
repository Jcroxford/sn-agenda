import axios from 'axios'

// types
import { HttpHeaders } from './../types/axios.types'
import { UserInfo, ChannelInfo } from '../types/slackResponse.types'

function http(json: boolean = true) {
  const headers: HttpHeaders = {
    Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
  }

  if (!json) headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return axios.create({
    baseURL: 'https://slack.com/api',
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
    },
  })
}

export default {
  users: {
    info(user: string): Promise<{ data: UserInfo }> {
      return http(/* json */ false)
        .get('/users.info', {
          params: { user, token: process.env.SLACK_API_TOKEN }
        })
    }
  },
  channels: {
    info(channel: string): Promise<{ data: ChannelInfo }> {
      return http(/* json */ false)
        .get('/channels.info', {
          params: { channel, token: process.env.SLACK_API_TOKEN }
        })
    }
  }
}
