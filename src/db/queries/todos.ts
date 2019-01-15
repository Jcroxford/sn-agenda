import knex from '../knex'

import { Todo, WhereTodo } from './../../types/todo.types'

interface CreateTodo {
  userId: string
  username: string
  channelId: string
  channelName: string
  text: string
}
export default {
  create(todo: CreateTodo) {
    return knex('todos').insert({
      user_id: todo.userId,
      channel_id: todo.channelId,
      channel_name: todo.channelName,
      username: todo.username,
      text: todo.text
    })
  },

  list(searchTerms: WhereTodo = {}): Promise<Todo[]> {
    return knex('todos').where(searchTerms)
  },

  archiveChannelTodos(channelId: string): Promise<any> {
    return knex('todos')
      .update({ completed: true })
      .where({ channel_id: channelId, completed: false })
  }
}
