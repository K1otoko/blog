import { request } from '@/utils/request'

interface Api {
  userList: string
}

const api: Api = {
  userList: 'api/user/list',
}

export default {
  getUserList() {
    return request.get(api.userList)
  },
}
