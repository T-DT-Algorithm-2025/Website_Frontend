// 认证相关的API服务
const API_BASE_URL = '/api'

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
        },
        credentials: 'include' // 包含cookies用于认证
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
  },

  // 更新用户信息
  async updateUserInfo(updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/info/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '更新用户信息失败' }
      }
    } catch (error) {
      console.error('更新用户信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取招聘列表
  async getRecruitList(onlyAvailable = false) {
    try {
      const url = new URL(`${API_BASE_URL}/recruit/list`, window.location.origin)
      if (onlyAvailable) {
        url.searchParams.append('only_available', 'true')
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // 包含cookies用于认证
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || '获取招聘列表失败' }
      }
    } catch (error) {
      console.error('获取招聘列表时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取招聘详情
  async getRecruitInfo(recruitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/info/${recruitId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || '获取招聘详情失败' }
      }
    } catch (error) {
      console.error('获取招聘详情时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取可申请的职位列表
  async getPositions() {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/positions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { 
          success: true, 
          data: {
            positions: data.positions || [],
            secondStagePositions: data.second_stage_positions || []
          }
        }
      } else {
        return { success: false, error: data.error || '获取职位列表失败' }
      }
    } catch (error) {
      console.error('获取职位列表时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 提交招聘申请
  async submitApplication(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/apply`, {
        method: 'POST',
        body: formData // 使用FormData，因为包含文件上传
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '提交申请失败' }
      }
    } catch (error) {
      console.error('提交申请时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // ========== 管理员招聘管理接口 ==========

  // 创建新的招聘信息
  async createRecruit(recruitData) {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recruitData),
        credentials: 'include' // 包含cookies用于认证
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '创建招聘信息失败' }
      }
    } catch (error) {
      console.error('创建招聘信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 更新指定招聘信息
  async updateRecruit(recruitId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/${recruitId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include' // 包含cookies用于认证
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '更新招聘信息失败' }
      }
    } catch (error) {
      console.error('更新招聘信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 删除指定招聘信息
  async deleteRecruit(recruitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/recruit/${recruitId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // 包含cookies用于认证
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '删除招聘信息失败' }
      }
    } catch (error) {
      console.error('删除招聘信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // ========== 简历与申请相关接口 ==========

  // 获取我的投递列表
  async getUserSubmissions(recruitId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/resume/list`, window.location.origin)
      if (recruitId) {
        url.searchParams.append('recruit_id', recruitId)
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // 根据API文档，返回的是 submissions 字段
        return { success: true, data: data.submissions || [] }
      } else {
        return { success: false, error: data.error || '获取投递列表失败' }
      }
    } catch (error) {
      console.error('获取投递列表时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取简历详细信息
  async getResumeInfo(submitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/info/${submitId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data: data }
      } else {
        return { success: false, error: data.error || '获取简历信息失败' }
      }
    } catch (error) {
      console.error('获取简历信息时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 下载附加文件
  async downloadAttachment(submitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/download/${submitId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        return { success: true, blob }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || '下载文件失败' }
      }
    } catch (error) {
      console.error('下载文件时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 获取简历正面照
  async getResumeHeadImg(submitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/real_head_img/${submitId}`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        return { success: true, imageUrl }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || '获取正面照失败' }
      }
    } catch (error) {
      console.error('获取正面照时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 更新简历
  async updateResume(submitId, formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/update/${submitId}`, {
        method: 'POST',
        body: formData // 使用FormData，因为包含文件上传
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '更新简历失败' }
      }
    } catch (error) {
      console.error('更新简历时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // ========== 绑定相关接口 ==========

  // 设置登录绑定模式
  async setLoginBundle(bundleName) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/bundle/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundle_name: bundleName
        }),
        credentials: 'include' // 包含cookies用于认证
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '设置绑定模式失败' }
      }
    } catch (error) {
      console.error('设置绑定模式时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 发送邮箱验证码
  async sendVerificationCode(email, bundleName = null) {
    try {
      const requestBody = { mail: email }
      
      // 如果提供了 bundleName，则添加到请求体中
      if (bundleName) {
        requestBody.bundle_name = bundleName
      }
      
      const response = await fetch(`${API_BASE_URL}/mail/verify/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || '发送验证码失败' }
      }
    } catch (error) {
      console.error('发送验证码时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 邮箱绑定/注册
  async registerWithEmail(email, password, verificationCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/mail/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          pwd: password,
          verification_code: verificationCode
        }),
        credentials: 'include'
      })
      
      // 根据API文档，成功响应是302重定向，所以可能不会返回JSON
      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || '邮箱绑定失败' }
      }
    } catch (error) {
      console.error('邮箱绑定时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  },

  // 邮箱登录
  async loginWithEmail(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          pwd: password
        }),
        credentials: 'include'
      })
      
      // 根据API文档，成功响应是302重定向
      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || '邮箱或密码错误' }
      }
    } catch (error) {
      console.error('邮箱登录时出错:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }
}
