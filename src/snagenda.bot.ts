import { SlackResponse } from './types/slackResponse'
import axios from 'axios'
// import knex from './db/knex'

const instance = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_AUTH}`,
  },
})

export function handleAgendaBot(payload: SlackResponse) {
  if (payload.event.type !== 'app_mention') return

  const { text } = payload.event
  if (payload.event.type !== 'app_mention') return

  if (text.includes('add-item')) handleAddAgendaItem(payload)
}

// export function sayHi(payload: SlackResponse) {
//   console.log(payload)

//   const { user, channel } = payload.event

//   if (payload.event.type !== 'app_mention') return

//   instance.post('https://slack.com/api/chat.postMessage', { text: `hello <@${user}> <${user}>`, channel })
//     .then((res) => console.log(res.data as SlackResponse))
// }

function handleAddAgendaItem(payload: SlackResponse) {
  const { user } = payload.event
  console.log(payload)

  // const agendaItem = text.split('add-item')[0].trim()
  instance
    .get('https://slack.com/api/users.info', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: { user, token: process.env.SLACK_API_TOKEN },
    })
    .then((res) => console.log(res.data))
}
