<template>
  <div class="sidebar">
    <UserInfo
      ref="userInfoRef"
      :userInfo="userInfo"
      class="user-info-component"
    />

    <nav class="sidebar-nav">
      <!-- Avatar for Mobile View -->
      <div
        class="nav-item nav-item-avatar"
        :class="{ active: activeTab === 'info' }"
        @click="switchTab('info')"
      >
        <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="头像" class="nav-avatar-img">
        <span v-else class="nav-icon">👤</span>
        <span class="nav-text">我</span>
      </div>

      <!-- Full Text for Desktop/Tablet -->
      <div
        class="nav-item nav-item-info"
        :class="{ active: activeTab === 'info' }"
        @click="switchTab('info')"
      >
        <span class="nav-icon">👤</span>
        <span class="nav-text">个人信息</span>
      </div>
      <div
        class="nav-item"
        :class="{ active: activeTab === 'edit' }"
        @click="switchTab('edit')"
      >
        <span class="nav-icon">✏️</span>
        <span class="nav-text">修改信息</span>
      </div>
      <div
        class="nav-item"
        :class="{ active: activeTab === 'applications' }"
        @click="switchTab('applications')"
      >
        <span class="nav-icon">📋</span>
        <span class="nav-text">管理投递</span>
      </div>
      <div
        v-if="userInfo?.permission"
        class="nav-item"
        :class="{ active: activeTab === 'recruit-management' }"
        @click="switchTab('recruit-management')"
      >
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">招聘管理</span>
      </div>
      <div
        v-if="userInfo?.permission"
        class="nav-item"
        :class="{ active: activeTab === 'resume-management' }"
        @click="switchTab('resume-management')"
      >
        <span class="nav-icon">📄</span>
        <span class="nav-text">简历管理</span>
      </div>
      <div
        v-if="userInfo?.permission"
        class="nav-item"
        :class="{ active: activeTab === 'user-management' }"
        @click="switchTab('user-management')"
      >
        <span class="nav-icon">👥</span>
        <span class="nav-text">用户管理</span>
      </div>
      <div
        class="nav-item logout-item"
        @click="handleLogout"
      >
        <span class="nav-icon">🚪</span>
        <span class="nav-text">登出</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserInfo from './UserInfo.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      avatar: 'https://placehold.co/100x100/F8B400/FFF?text=User' // Default avatar
    })
  },
  activeTab: {
    type: String,
    default: 'info'
  }
})

const emit = defineEmits(['switch-tab', 'logout'])

const userInfoRef = ref(null)

const switchTab = (tab) => {
  emit('switch-tab', tab)
}

const handleLogout = () => {
  emit('logout')
}

// 暴露方法给父组件
defineExpose({
  userInfoRef
})
</script>

<style scoped>
/* --- 默认桌面端样式 --- */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex-shrink: 0;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  transition: all 0.3s ease;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-size: 1rem;
}

.nav-item:hover {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
}

.nav-item.active {
  background: rgba(248, 180, 0, 0.2);
  color: #f8b400;
  font-weight: 500;
}

.nav-icon {
  font-size: 1.2rem;
}

.logout-item {
  margin-top: auto;
  color: #e74c3c;
}

.logout-item:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Hide mobile avatar item by default */
.nav-item-avatar {
    display: none;
}

.nav-avatar-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}


/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

/* --- 手机端适配 (<= 768px) --- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    flex-direction: row;
    padding: 0.5rem 0;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    justify-content: center;
    height: 60px;
    background: rgba(255, 255, 255, 0.95);
  }

  .user-info-component {
    display: none;
  }
  
  .sidebar-nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 0;
  }

  .nav-item {
    flex-direction: column;
    padding: 0.25rem;
    gap: 0.25rem;
    border-radius: 4px;
    flex: 1;
    height: 100%;
    justify-content: center;
  }

  .nav-item-avatar {
    display: flex;
  }
  .nav-item-info {
    display: none;
  }
  
  .nav-text {
    display: inline;
    font-size: 0.7rem;
  }
  
  .nav-item.active {
    background: none;
    color: #f8b400;
  }

  .nav-item:hover {
    background: none;
    color: #f8b400;
  }

  .logout-item {
    color: #666;
    margin-top: 0;
  }
  .logout-item:hover {
    color: #e74c3c;
  }
}
</style>

