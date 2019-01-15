import { SlackResponse } from './types/slackResponse.types'
import slack from './utils/slack.api'
import Todos from './db/queries/todos'

export function handleAgendaBot(payload: SlackResponse) {
  if (payload.event.type !== 'app_mention') return

  const { text } = payload.event
  if (payload.event.type !== 'app_mention') return

  if (text.includes('add-item')) handleAddAgendaItem(payload)
  if (text.includes('list-items')) handleListAgendaItemsForChannel(payload)
  if (
    text.includes('reset-agenda') ||
    text.includes('clean-slate') ||
    text.includes('reset')
  ) handleResetAgendaForChannel(payload)
}

function handleAddAgendaItem(payload: SlackResponse) {
  const { user, channel, text } = payload.event

  const agendaItem = text.split('add-item')[1].trim()

  Promise.all([
    slack.users.info(user),
    slack.channels.info(channel)
  ])
    .then(([ { data: userRes }, { data: channelRes } ]) => {
      if (!userRes.ok || !channelRes.ok) throw new Error('unable to retrieve user or channel')

      return Todos.create({
        userId: userRes.user.id,
        username: userRes.user.name,
        channelId: channelRes.channel.id,
        channelName: channelRes.channel.name,
        text: agendaItem
      })
    })
    .then(([ success ]) => {
      if (!success) throw new Error('unable to add item to database')

      const message = `ok! Added the todo item \`${agendaItem}\` to this group's todo list.`
      slack.chat.postMessage(message, channel)
    })
}

function handleListAgendaItemsForChannel(payload: SlackResponse) {
  const { channel } = payload.event

  Todos.list({ channel_id: channel, deleted: false, completed: false })
    .then((todos) => {
      const snLogoColors = [ '#4f75mb', '#e87722', '#9dd7d4', '#a9da5f', '#31793d' ]

      const attachments = todos.map((todo, i) => {
        return {
          color: snLogoColors[i % snLogoColors.length],
          text: `${i + 1} ${todo.text} (id ${todo.id})`,
        }
      })

      slack.chat.postMessage(`Here's a list of all current items on the agenda for this group`, channel, attachments)
    })
}

function handleResetAgendaForChannel(payload: SlackResponse) {
  const { channel } = payload.event

  Todos.archiveChannelTodos(channel)
    .then(() => {
      slack.chat.postMessage(`:+1: I archived all active items for this channel.`, channel)
    })
}
