import { SlackResponse } from './types/slackResponse.types'
import slack from './utils/slack.api'
import todos from './db/queries/todos'

export function handleAgendaBot(payload: SlackResponse) {
  if (payload.event.type !== 'app_mention') return

  const { text } = payload.event
  if (payload.event.type !== 'app_mention') return

  if (text.includes('add-item')) handleAddAgendaItem(payload)
}

function handleAddAgendaItem(payload: SlackResponse) {
  const { user, channel, text } = payload.event

  const agendaItem = text.split('add-item')[0].trim()

  Promise.all([
    slack.users.info(user),
    slack.channels.info(channel)
  ])
    .then(([ { data: userRes }, { data: channelRes } ]) => {
      if (!userRes.ok || !channelRes.ok) throw new Error('unable to retrieve user or channel')

      return todos.create({
        userId: userRes.user.id,
        username: userRes.user.name,
        channelId: channelRes.channel.id,
        channelName: channelRes.channel.name,
        text: agendaItem
      })
    })
    .then(([ success ]) => {
      if (!success) throw new Error('unable to add item to database')
    })
}
