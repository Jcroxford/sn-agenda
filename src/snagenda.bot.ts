import { SlackResponse, Attachment } from './types/slackResponse.types'
import slack from './utils/slack.api'
import Todos from './db/queries/todos'

const SN_LOGO_COLORS = [ '#e87722', '#9dd7d4', '#4f75mb', '#a9da5f', '#31793d' ]

export function handleAgendaBot(payload: SlackResponse) {
  if (payload.event.type !== 'app_mention') return

  const { text } = payload.event
  if (payload.event.type !== 'app_mention') return

  if (text.includes('add-item')) return handleAddAgendaItem(payload)
  if (text.includes('list-items')) return handleListAgendaItemsForChannel(payload)
  if (text.includes('repo') || text.includes('github')) return handleDisplayRepo(payload)
  if (text.includes('remove-item')) return handleRemoveItemForChannel(payload)
  if (text.includes('help')) return handleShowBotInstructions(payload)
  if (text.includes('reset-agenda') || text.includes('clean-slate') || text.includes('reset')) {
    return handleResetAgendaForChannel(payload)
  }
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
      if (!todos.length) {
        return slack.chat.postMessage(`It looks like this channel doesn't currently have any items! :blush:`, channel)
      }

      const attachments = todos.map((todo, i) => {
        return {
          color: SN_LOGO_COLORS[i % SN_LOGO_COLORS.length],
          text: `${i + 1} ${todo.text} (id ${todo.id})`,
        }
      })

      return slack.chat
        .postMessage(`Here's a list of all current items on the agenda for this group`, channel, attachments)
    })
}

function handleResetAgendaForChannel(payload: SlackResponse) {
  const { channel } = payload.event

  Todos.archiveChannelTodos(channel)
    .then(() => {
      slack.chat.postMessage(`:+1: I archived all active items for this channel.`, channel)
    })
}

function handleDisplayRepo(payload: SlackResponse) {
  const { channel } = payload.event

  slack.chat.postMessage(`The way to my :heart: is https://github.com/Jcroxford/sn-agenda`, channel)
}

function handleRemoveItemForChannel(payload: SlackResponse) {
  const { channel, text } = payload.event
  const id = text.split('remove-item')[1].trim()
  if (!id.match(/[0-9]+/)) return slack.chat.postMessage(`Sorry I don't recognize that item :confused:`, channel)

  return Todos.remove(id)
    .then(() => {
      slack.chat.postMessage(`Got it! Item has been archived.`, channel)
    })
}

function handleShowBotInstructions(payload: SlackResponse) {
  const { channel, user } = payload.event

  const attachments: Attachment[] = [
    {
      color: SN_LOGO_COLORS[0 % SN_LOGO_COLORS.length],
      title: 'list-items',
      text: `lists all currently active agenda items for your group.`,
    },
    {
      color: SN_LOGO_COLORS[1 % SN_LOGO_COLORS.length],
      title: 'add-item <item you wish to add to the agenda>',
      text: `adds item to the current agenda for the group.`,
    },
    {
      color: SN_LOGO_COLORS[2 % SN_LOGO_COLORS.length],
      title: 'remove-item <id>',
      text: `Provided the item id, I will carry out your wishes and archive the item.`,
    },
    {
      color: SN_LOGO_COLORS[3 % SN_LOGO_COLORS.length],
      title: 'reset-agenda OR clean-slate OR reset',
      /* tslint:disable-next-line */
      text: `This is the danger zone but useful. Archives all currently active items in the agenda list. This should be used after a meeting so you can start over keeping track for the next one`,
    },
    {
      color: SN_LOGO_COLORS[4 % SN_LOGO_COLORS.length],
      title: 'repo OR github',
      text: `If you ever wish to visit me in my humble home.`,
    },
    {
      color: SN_LOGO_COLORS[5 % SN_LOGO_COLORS.length],
      title: 'help',
      text: `Show all this information again... You know... For fun...`,
    }
  ]

  slack.chat.postEphemeral('All commands require you to @ me so I know what to look for.', channel, user, attachments)
}
