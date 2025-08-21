export interface LoginParams {
  username: string
  password: string
  phoneEmail: string
  code: string
  method: 'username' | 'phone'
}
