<template>
  <div class="profile-container">
    <!-- NeuralBg 背景 -->
    <div class="neural-bg-container">
      <NeuralBg />
    </div>
    
    <!-- 主要内容区域 -->
    <div class="profile-main-content">
      <!-- 左侧侧栏 -->
      <ProfileSidebar 
        ref="sidebarRef"
        :userInfo="userInfo"
        :activeTab="activeTab"
        @switch-tab="switchTab"
        @logout="handleLogout"
      />

    <!-- 右侧主要内容区域 -->
    <div class="main-content">
      <!-- 个人信息 -->
        <UserInfoDisplay
          v-if="activeTab === 'info'"
          :userInfo="userInfo"
        />

      <!-- 修改信息 -->
        <UserInfoEdit
          v-else-if="activeTab === 'edit'"
          :userInfo="userInfo"
          :isSubmitting="isSubmitting"
          @submit="handleSubmit"
          @cancel="switchTab('info')"
        />

      <!-- 管理投递 -->
        <ApplicationsManagement
          v-else-if="activeTab === 'applications'"
          :userInfo="userInfo"
          @refresh-recruit-list="refreshRecruitList"
          @user-info-updated="fetchUserInfo"
        />

      <!-- 招聘管理界面（仅管理员可见） -->
        <RecruitManagementSystem
          v-else-if="activeTab === 'recruit-management'"
          :userInfo="userInfo"
        />

      <!-- 简历管理界面（仅管理员可见） -->
        <ResumeManagementSystem
          v-else-if="activeTab === 'resume-management'"
          :userInfo="userInfo"
        />

      <!-- 用户管理界面（仅管理员可见） -->
        <UserManagement
          v-else-if="activeTab === 'user-management'"
          :userInfo="userInfo"
        />

      <!-- 面试管理界面（仅管理员可见） -->
        <InterviewManagement
          v-else-if="activeTab === 'interview-management'"
          :userInfo="userInfo"
        />
                </div>
                </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../api/auth.js'
import NeuralBg from '@/components/inspira/NeuralBg.vue'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import UserInfoDisplay from '@/components/profile/UserInfoDisplay.vue'
import UserInfoEdit from '@/components/profile/UserInfoEdit.vue'
import ApplicationsManagement from '@/components/profile/ApplicationsManagement.vue'
import RecruitManagementSystem from '@/components/profile/RecruitManagementSystem.vue'
import ResumeManagementSystem from '@/components/profile/ResumeManagementSystem.vue'
import UserManagement from '@/components/profile/UserManagement.vue'
import InterviewManagement from '@/components/profile/InterviewManagement.vue'

import { useAlert } from '@/composables/useAlert'
const { showAlert } = useAlert()

const router = useRouter()
const route = useRoute()
const activeTab = ref('info')
const userInfo = ref(null)
const isSubmitting = ref(false)
const sidebarRef = ref(null)

// 刷新招聘列表（用于投递管理组件）
const refreshRecruitList = () => {
  // 这个方法会被 ApplicationsManagement 组件调用
  // 实际的数据获取由各个子组件自己处理
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const result = await authAPI.getUserInfo()
    if (result.success) {
      userInfo.value = result.data
      
      // 检查用户信息中是否包含mail字段
      // 根据后端API文档，用户信息应该包含邮箱信息
      // 如果没有邮箱信息，说明用户需要绑定邮箱账户
      if (!result.data.mail) {
        console.log('用户未绑定邮箱，跳转到绑定页面')
        router.push('/bind')
        return
      }
      
      // 设置头像URL到侧边栏组件
      if (sidebarRef.value?.userInfoRef) {
        sidebarRef.value.userInfoRef.setAvatarUrl(`/api/user/avatar/get`)
      }
    } else {
      console.error('获取用户信息失败:', result.error)
      // 如果获取失败，跳转到登录页
      router.push('/login')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.push('/login')
  }
}

// 切换标签页
const switchTab = (tab) => {
  if ((tab === 'recruit-management' || tab === 'resume-management' || tab === 'user-management' || tab === 'interview-management') && !userInfo.value?.permission) {
      showAlert('您没有权限访问此功能', 'error')
      return
    }
  activeTab.value = tab
}

// 处理表单提交
const handleSubmit = async (editForm) => {
  isSubmitting.value = true
  try {
    // 过滤掉空值
    const updateData = Object.fromEntries(
      Object.entries(editForm).filter(([_, value]) => value !== '')
    )
    
    const result = await authAPI.updateUserInfo(updateData)
    if (result.success) {
      // 更新成功，重新获取用户信息
      await fetchUserInfo()
      // 切换到个人信息页面
      activeTab.value = 'info'
      showAlert('信息更新成功！', 'success')
    } else {
      showAlert('更新失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    showAlert('更新失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}


// 处理登出
const handleLogout = async () => {
  try {
    const result = await authAPI.logout()
    if (result.success) {
      router.push('/')
    } else {
      showAlert('登出失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('登出失败:', error, 'error')
    showAlert('登出失败，请稍后重试', 'error')
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  // 检查URL查询参数，如果有tab参数则切换到对应tab
  if (route.query.tab) {
    const tab = route.query.tab
    if (['info', 'edit', 'applications', 'recruit-management', 'resume-management', 'user-management', 'interview-management'].includes(tab)) {
      activeTab.value = tab
    }
  }
  
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* NeuralBg 背景容器 */
.neural-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  transform: translateZ(0);
}

/* 确保NeuralBg组件本身也完全填充容器 */
.neural-bg-container canvas {
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
}

/* 主要内容区域 */
.profile-main-content {
  display: flex;
  padding: 2rem;
  gap: 2rem;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  /* 在高缩放比例下减少padding */
}

/* 右侧主要内容区域样式 */
.main-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  /* 使用最小高度而非固定高度，防止高缩放时内容溢出 */
  min-height: calc(100vh - 8rem);
  max-height: calc(100vh - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 高缩放比例优化 */
@media (max-height: 800px), (min-width: 1024px) and (max-height: 1000px) {
  .profile-main-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .main-content {
    padding: 1.5rem;
    min-height: calc(100vh - 6rem);
    max-height: calc(100vh - 3rem);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-container {
    flex-direction: column;
    padding: 1rem;
    height: auto;
    overflow: visible;
  }
  
  .main-content {
    height: auto;
    min-height: auto;
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 0.5rem;
  }
  
  .main-content {
    padding: 1.5rem;
  }
}
</style>
