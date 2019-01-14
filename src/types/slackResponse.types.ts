export interface SlackResponse {
  token: string
  team_id: string
  api_app_id: string
  event: SlackEvent
  type: string
  event_id: string
  event_time: string
  authed_users: string[]
}

interface SlackEvent {
  client_msg_id: string
  type: string
  text: string
  user: string
  ts: string
  channel: string
  evnet_ts: string
}
