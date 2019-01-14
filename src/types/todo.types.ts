export interface Todo {
  id: number
  text: string
  completed: boolean
  deleted: boolean
  user_id: string
  username: string
  channel_id: string
  channel_name: string
  created_at: Date
  updated_at: Date
}

export interface WhereTodo {
  id?: number
  text?: string
  completed?: boolean
  deleted?: boolean
  user_id?: string
  username?: string
  channel_id?: string
  channel_name?: string
  created_at?: Date
  updated_at?: Date
}
