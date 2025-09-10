<template>
  <div class="user-info">
    <div class="avatar-container">
      <img 
        :src="avatarUrl" 
        :alt="userInfo?.nickname || '用户头像'"
        class="user-avatar"
        @error="handleAvatarError"
      >
    </div>
    <h3 class="username">{{ userInfo?.nickname || '用户名' }}</h3>
    <p class="user-role">{{ userInfo?.rank || '学生' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

const avatarUrl = ref('')

// 设置头像URL
const setAvatarUrl = (url) => {
  avatarUrl.value = url
}

// 处理头像加载错误
const handleAvatarError = () => {
  avatarUrl.value = '/src/assets/images/default-avatar.svg'
}

// 暴露方法给父组件
defineExpose({
  setAvatarUrl
})
</script>

<style scoped>
.user-info {
  text-align: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e5e9;
}

.avatar-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f8b400;
  box-shadow: 0 4px 20px rgba(248, 180, 0, 0.3);
}

.username {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0.5rem 0;
}

.user-role {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .user-avatar {
    width: 60px;
    height: 60px;
  }
  
  .username {
    font-size: 1.2rem;
  }
}
</style>

