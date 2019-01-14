import knex from '../knex'

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
  }
}
