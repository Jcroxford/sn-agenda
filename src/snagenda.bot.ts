import { SlackResponse } from './types/slackRequest'
import axios from 'axios'

const instance = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
  },
})

export function sayHi(payload: SlackResponse) {
  console.log(payload)

  const { user, channel } = payload.event

  if (payload.event.type !== 'app_mention') return

  instance.post('https://slack.com/api/chat.postMessage', { text: `hello <@${user}> <${user}>`, channel })
    .then((res) => console.log(res.data as SlackResponse))
}
