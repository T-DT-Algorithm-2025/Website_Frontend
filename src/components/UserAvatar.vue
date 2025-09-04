<template>
  <div class="user-avatar-container">
    <!-- 用户头像 -->
    <div class="avatar-wrapper" @mouseenter="showDropdown = true">
      <img 
        :src="avatarUrl" 
        :alt="userInfo?.nickname || '用户头像'"
        class="user-avatar"
        @error="handleAvatarError"
      >
      <!-- 下拉箭头 -->
      <span class="dropdown-arrow">▼</span>
    </div>
    
    <!-- 下拉菜单 -->
    <div 
      class="dropdown-menu" 
      v-show="showDropdown"
      @mouseenter="showDropdown = true"
      @mouseleave="showDropdown = false"
    >
      <div class="dropdown-item" @click="goToProfile">
        个人中心
      </div>
      <div class="dropdown-item" @click="handleLogout">
        登出
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'

const router = useRouter()
const showDropdown = ref(false)
const userInfo = ref(null)
const avatarUrl = ref('')

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const result = await authAPI.getUserInfo()
    if (result.success) {
      userInfo.value = result.data
      // 设置头像URL
      avatarUrl.value = `https://www.neutdt.cn/api/user/avatar/get`
      // 发出登录成功事件
      emit('login-success')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 处理头像加载错误
const handleAvatarError = () => {
  // 如果头像加载失败，使用默认头像
  avatarUrl.value = '/src/assets/images/default-avatar.svg'
}

// 跳转到个人中心
const goToProfile = () => {
  // 个人中心页面还没写，暂时不跳转
  console.log('跳转到个人中心')
}

// 处理登出
const handleLogout = async () => {
  try {
    const result = await authAPI.logout()
    if (result.success) {
      // 清除本地用户信息
      userInfo.value = null
      // 发出登出事件，通知父组件更新状态
      emit('logout')
      // 跳转到首页
      router.push('/')
    } else {
      console.error('登出失败:', result.error)
    }
  } catch (error) {
    console.error('登出时出错:', error)
  }
}

// 定义emit
const emit = defineEmits(['logout', 'login-success'])

// 组件挂载时获取用户信息
onMounted(async () => {
  await fetchUserInfo()
})
</script>

<style scoped>
.user-avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  height: 100%;
  align-items: center;
}

.avatar-wrapper:hover {
  background: rgba(248, 180, 0, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f8b400;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: #ff6b35;
}

.dropdown-arrow {
  color: #f8b400;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(51, 51, 51, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
}

.dropdown-item:hover {
  background: rgba(248, 180, 0, 0.2);
  color: #f8b400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-avatar {
    width: 28px;
    height: 28px;
  }
  
  .dropdown-menu {
    min-width: 110px;
  }
  
  .dropdown-item {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
