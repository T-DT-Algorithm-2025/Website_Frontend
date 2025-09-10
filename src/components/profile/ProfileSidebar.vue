<template>
  <div class="sidebar">
    <UserInfo 
      ref="userInfoRef"
      :userInfo="userInfo"
    />
    
    <nav class="sidebar-nav">
      <div 
        class="nav-item" 
        :class="{ active: activeTab === 'info' }"
        @click="switchTab('info')"
      >
        <span class="nav-icon">👤</span>
        个人信息
      </div>
      <div 
        class="nav-item" 
        :class="{ active: activeTab === 'edit' }"
        @click="switchTab('edit')"
      >
        <span class="nav-icon">✏️</span>
        修改信息
      </div>
      <div 
        class="nav-item" 
        :class="{ active: activeTab === 'applications' }"
        @click="switchTab('applications')"
      >
        <span class="nav-icon">📋</span>
        管理投递
      </div>
      <div 
        v-if="userInfo?.permission"
        class="nav-item" 
        :class="{ active: activeTab === 'recruit-management' }"
        @click="switchTab('recruit-management')"
      >
        <span class="nav-icon">⚙️</span>
        招聘管理
      </div>
      <div 
        class="nav-item logout-item"
        @click="handleLogout"
      >
        <span class="nav-icon">🚪</span>
        登出
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
    default: () => null
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
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex-shrink: 0;
  height: calc(100vh - 4rem);
  overflow-y: auto;
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

@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    height: auto;
    overflow-y: visible;
  }
}
</style>

