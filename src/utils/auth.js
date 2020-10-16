import Cookies from 'js-cookie'
// export default只能导出一个， export可以导出多个
const TOKEN = 'token'    // 创建一个常量，用来定义token
const UUID = 'uuid'

// 设置token
export function setToken(token) {
  return Cookies.set(TOKEN, token)
}
// 获取token
export function getToken() {
  return Cookies.get(TOKEN)
}
// 移除token
export function removeToken() {
  return Cookies.remove(TOKEN)
}

export function setUuid(uuid) {
  return Cookies.set(UUID, uuid)
}

export function getUuid() {
  return Cookies.get(UUID)
}

export function removeUuid() {
  return Cookies.remove(UUID)
}