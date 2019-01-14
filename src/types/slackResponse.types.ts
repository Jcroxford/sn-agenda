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

export interface UserInfo {
  ok: boolean
  user: {
      id: string
      team_id: string
      name: string
      deleted: boolean
      color: string
      real_name: string
      tz: string
      tz_label: string
      tz_offset: number
      profile: {
          avatar_hash: string
          status_text: string
          status_emoji: string
          real_name: string
          display_name: string
          real_name_normalized: string
          display_name_normalized: string
          email: string
          image_24: string
          image_32: string
          image_48: string
          image_72: string
          image_192: string
          image_512: string
          team: string
      },
      is_admin: boolean
      is_owner: boolean
      is_primary_owner: boolean
      is_restricted: boolean
      is_ultra_restricted: boolean
      is_bot: boolean
      updated: number
      is_app_user: boolean
      has_2fa: boolean
  }
}
