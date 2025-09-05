<template>
  <div class="profile-container">
    <!-- 左侧侧栏 -->
    <div class="sidebar">
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
          class="nav-item logout-item"
          @click="handleLogout"
        >
          <span class="nav-icon">🚪</span>
          登出
        </div>
      </nav>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="main-content">
      <!-- 个人信息 -->
      <div v-if="activeTab === 'info'" class="content-section">
        <h2 class="section-title">个人信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>昵称</label>
            <span>{{ userInfo?.nickname || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>真实姓名</label>
            <span>{{ userInfo?.realname || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>性别</label>
            <span>{{ userInfo?.gender || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>学号</label>
            <span>{{ userInfo?.student_id || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>学院</label>
            <span>{{ userInfo?.department || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>专业</label>
            <span>{{ userInfo?.major || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>年级</label>
            <span>{{ userInfo?.grade || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>学历</label>
            <span>{{ userInfo?.rank || '未设置' }}</span>
          </div>
        </div>
      </div>

      <!-- 修改信息 -->
      <div v-if="activeTab === 'edit'" class="content-section">
        <h2 class="section-title">修改信息</h2>
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nickname">昵称</label>
              <input 
                type="text" 
                id="nickname" 
                v-model="editForm.nickname" 
                placeholder="请输入昵称"
              >
            </div>
            <div class="form-group">
              <label for="realname">真实姓名</label>
              <input 
                type="text" 
                id="realname" 
                v-model="editForm.realname" 
                placeholder="请输入真实姓名"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="editForm.gender">
                <option value="">请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label for="student_id">学号</label>
              <input 
                type="text" 
                id="student_id" 
                v-model="editForm.student_id" 
                placeholder="请输入学号"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="department">学院</label>
              <input 
                type="text" 
                id="department" 
                v-model="editForm.department" 
                placeholder="请输入学院"
              >
            </div>
            <div class="form-group">
              <label for="major">专业</label>
              <input 
                type="text" 
                id="major" 
                v-model="editForm.major" 
                placeholder="请输入专业"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="grade">年级</label>
              <input 
                type="text" 
                id="grade" 
                v-model="editForm.grade" 
                placeholder="请输入年级"
              >
            </div>
            <div class="form-group">
              <label for="rank">学历</label>
              <select id="rank" v-model="editForm.rank">
                <option value="">请选择学历</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '提交' }}
            </button>
            <button type="button" class="cancel-btn" @click="switchTab('info')">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'

const router = useRouter()
const activeTab = ref('info')
const userInfo = ref(null)
const avatarUrl = ref('')
const isSubmitting = ref(false)

// 编辑表单数据
const editForm = reactive({
  nickname: '',
  gender: '',
  realname: '',
  student_id: '',
  department: '',
  major: '',
  grade: '',
  rank: ''
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const result = await authAPI.getUserInfo()
    if (result.success) {
      userInfo.value = result.data
      // 设置头像URL
      avatarUrl.value = `https://www.neutdt.cn/api/user/avatar/get`
      // 初始化编辑表单
      Object.assign(editForm, result.data)
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

// 处理头像加载错误
const handleAvatarError = () => {
  avatarUrl.value = '/src/assets/images/default-avatar.svg'
}

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'edit') {
    // 切换到编辑页面时，重新加载用户信息
    Object.assign(editForm, userInfo.value)
  }
}

// 处理表单提交
const handleSubmit = async () => {
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
      alert('信息更新成功！')
    } else {
      alert('更新失败：' + result.error)
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    alert('更新失败，请稍后重试')
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
      alert('登出失败：' + result.error)
    }
  } catch (error) {
    console.error('登出失败:', error)
    alert('登出失败，请稍后重试')
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  gap: 2rem;
}

/* 左侧侧栏样式 */
.sidebar {
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-info {
  text-align: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e5e9;
}

.avatar-container {
  margin-bottom: 1rem;
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

/* 右侧主要内容区域样式 */
.main-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8b400;
}

/* 个人信息样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  color: #333;
  font-size: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #f8b400;
}

/* 编辑表单样式 */
.edit-form {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(248, 180, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 0.5rem;
  }
  
  .sidebar,
  .main-content {
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .user-avatar {
    width: 60px;
    height: 60px;
  }
  
  .username {
    font-size: 1.2rem;
  }
}
</style>
