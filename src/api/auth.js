// 认证相关的API服务
const API_BASE_URL = 'https://www.neutdt.cn/api'

export const authAPI = {
  // 设置登录重定向URL
  async setLoginRedirect(redirectUrl) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/redirect/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect_url: redirectUrl
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '设置重定向URL失败' }
      }
    } catch (error) {
      console.error('设置重定向URL时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 登出
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '登出失败' }
      }
    } catch (error) {
      console.error('登出时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/info/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || '获取用户信息失败' }
      }
    } catch (error) {
      console.error('获取用户信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }
}
