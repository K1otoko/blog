import { request } from '@/utils/request'
import type { LoginParams } from '@/types/login'

interface Api {
  login: string
}

const api: Api = {
  login: 'api/auth/login',
}

export default {
  login(params: LoginParams) {
    return request.post(api.login, params)
  },
}
