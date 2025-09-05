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
          class="nav-item" 
          :class="{ active: activeTab === 'applications' }"
          @click="switchTab('applications')"
        >
          <span class="nav-icon">📋</span>
          我的投递
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
                <option value="" disabled selected>请选择性别</option>
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
              <select id="grade" v-model="editForm.grade">
                <option value="" disabled selected>请选择年级</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div class="form-group">
              <label for="rank">学历</label>
              <select id="rank" v-model="editForm.rank">
                <option value="" disabled selected>请选择学历</option>
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

      <!-- 我的投递 -->
      <div v-if="activeTab === 'applications'" class="content-section">
        <!-- 投递列表视图 -->
        <div v-if="applicationView === 'list'">
          <div class="applications-header">
            <h2 class="section-title">我的投递</h2>
            <button class="add-application-btn" @click="addNewApplication">
              <span class="btn-icon">➕</span>
              新增投递
            </button>
          </div>
          
          <div v-if="applications.length === 0" class="no-applications">
            <div class="empty-state">
              <span class="empty-icon">📋</span>
              <h3>暂无投递记录</h3>
              <p>您还没有提交过任何投递，点击上方"新增投递"按钮开始申请</p>
            </div>
          </div>
          
          <div v-else class="applications-list">
            <div 
              v-for="application in applications" 
              :key="application.id"
              class="application-card"
            >
              <div class="card-header">
                <div class="application-info">
                  <h3 class="application-title">T-DT 团队申请</h3>
                  <div class="choices">
                    <span class="choice first">第一志愿：{{ application.firstChoice }}</span>
                    <span class="choice second" v-if="application.secondChoice && application.secondChoice !== '无'">
                      第二志愿：{{ application.secondChoice }}
                    </span>
                  </div>
                </div>
                <div class="application-status">
                  <span class="status-badge" :class="getStatusClass(application.status)">
                    {{ getStatusText(application.status) }}
                  </span>
                  <span class="submit-time">{{ formatDate(application.submitTime) }}</span>
                </div>
              </div>
              
              <div class="card-content">
                <div class="info-preview">
                  <div class="info-item">
                    <strong>姓名：</strong>{{ application.realname || '未填写' }}
                  </div>
                  <div class="info-item">
                    <strong>学号：</strong>{{ application.student_id || '未填写' }}
                  </div>
                  <div class="info-item">
                    <strong>专业：</strong>{{ application.major || '未填写' }}
                  </div>
                </div>
                
                <div class="card-actions">
                  <button class="action-btn view-btn" @click="viewApplication(application)">
                    查看详情
                  </button>
                  <button 
                    class="action-btn edit-btn" 
                    @click="editApplication(application)"
                    :disabled="application.status === 'approved' || application.status === 'rejected'"
                  >
                    编辑
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="deleteApplication(application.id)"
                    :disabled="application.status === 'approved'"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 新增/编辑投递表单视图 -->
        <div v-else-if="applicationView === 'form'">
          <div class="form-header">
            <h2 class="section-title">
              {{ isEditingApplication ? '编辑投递' : '新增投递' }}
            </h2>
            <button class="back-btn" @click="backToList">
              ← 返回列表
            </button>
          </div>
          
          <form @submit.prevent="handleApplicationSubmit" class="edit-form">
            <!-- 基本信息部分 -->
            <div class="form-section">
              <h3 class="section-subtitle">基本信息</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="app-nickname">昵称</label>
                  <input 
                    type="text" 
                    id="app-nickname" 
                    v-model="applicationForm.nickname" 
                    placeholder="请输入昵称"
                  >
                </div>
                <div class="form-group">
                  <label for="app-realname">真实姓名</label>
                  <input 
                    type="text" 
                    id="app-realname" 
                    v-model="applicationForm.realname" 
                    placeholder="请输入真实姓名"
                  >
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="app-gender">性别</label>
                  <select id="app-gender" v-model="applicationForm.gender">
                    <option value="" disabled selected>请选择性别</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="app-student-id">学号</label>
                  <input 
                    type="text" 
                    id="app-student-id" 
                    v-model="applicationForm.student_id" 
                    placeholder="请输入学号"
                  >
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="app-department">学院</label>
                  <input 
                    type="text" 
                    id="app-department" 
                    v-model="applicationForm.department" 
                    placeholder="请输入学院"
                  >
                </div>
                <div class="form-group">
                  <label for="app-major">专业</label>
                  <input 
                    type="text" 
                    id="app-major" 
                    v-model="applicationForm.major" 
                    placeholder="请输入专业"
                  >
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="app-grade">年级</label>
                  <select id="app-grade" v-model="applicationForm.grade">
                    <option value="" disabled selected>请选择年级</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="app-rank">学历</label>
                  <select id="app-rank" v-model="applicationForm.rank">
                    <option value="" disabled selected>请选择学历</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 志愿选择部分 -->
            <div class="form-section">
              <h3 class="section-subtitle">志愿选择</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="app-first-choice">第一志愿 <span class="required">*</span></label>
                                  <select id="app-first-choice" v-model="applicationForm.firstChoice" @change="handleFirstChoiceChange" required>
                  <option value="" disabled selected>请选择第一志愿</option>
                  <option value="机械">机械</option>
                  <option value="电控">电控</option>
                  <option value="算法">算法</option>
                  <option value="运营">运营</option>
                </select>
                </div>
                <div class="form-group">
                  <label for="app-second-choice">第二志愿</label>
                  <select id="app-second-choice" v-model="applicationForm.secondChoice">
                    <option value="无">无</option>
                    <option v-if="applicationForm.firstChoice !== '运营'" value="运营">运营</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 详细信息部分 -->
            <div class="form-section">
              <h3 class="section-subtitle">详细信息</h3>
              <div class="form-group full-width">
                <label for="app-experience">个人经历及所获荣誉</label>
                <textarea 
                  id="app-experience" 
                  v-model="applicationForm.experience" 
                  placeholder="请详细描述您的个人经历、实习经验、项目经验、获得的奖项和荣誉等..."
                  rows="5"
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="app-skills">相关专业技能</label>
                <textarea 
                  id="app-skills" 
                  v-model="applicationForm.skills" 
                  placeholder="请描述您掌握的专业技能，如编程语言、软件工具、硬件设备等..."
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="app-self-evaluation">自我评价及申请原因</label>
                <textarea 
                  id="app-self-evaluation" 
                  v-model="applicationForm.selfEvaluation" 
                  placeholder="请进行自我评价，并说明申请加入T-DT的原因和期望..."
                  rows="5"
                ></textarea>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isApplicationSubmitting">
                {{ isApplicationSubmitting ? '提交中...' : (isEditingApplication ? '更新投递' : '提交投递') }}
              </button>
              <button type="button" class="cancel-btn" @click="backToList">
                取消
              </button>
            </div>
          </form>
        </div>
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

// 投递相关状态
const applicationView = ref('list') // 'list' | 'form'
const isEditingApplication = ref(false)
const isApplicationSubmitting = ref(false)
const editingApplicationId = ref(null)

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

// 投递表单数据
const applicationForm = reactive({
  // 基本信息
  nickname: '',
  gender: '',
  realname: '',
  student_id: '',
  department: '',
  major: '',
  grade: '',
  rank: '',
  // 志愿选择
  firstChoice: '',
  secondChoice: '无', // 第二志愿默认为"无"
  // 详细信息
  experience: '',
  skills: '',
  selfEvaluation: ''
})

// 投递列表数据（模拟数据）
const applications = ref([
  {
    id: 1,
    nickname: '小明',
    realname: '张小明',
    gender: '男',
    student_id: '20210001',
    department: '计算机科学与工程学院',
    major: '计算机科学与技术',
    grade: '2023',
    rank: '本科',
    firstChoice: '算法',
    secondChoice: '无',
    experience: '曾参与ACM竞赛，获得校赛二等奖...',
    skills: '熟练掌握C++、Python，了解机器学习...',
    selfEvaluation: '我对RoboMaster机甲大师赛非常感兴趣...',
    status: 'pending', // pending | approved | rejected
    submitTime: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 2,
    nickname: '小红',
    realname: '李小红',
    gender: '女',
    student_id: '20210002',
    department: '机械工程与自动化学院',
    major: '机械工程',
    grade: '2024',
    rank: '本科',
    firstChoice: '机械',
    secondChoice: '运营',
    experience: '参与过多个机械设计项目，熟悉SolidWorks...',
    skills: 'SolidWorks、AutoCAD、3D打印...',
    selfEvaluation: '希望通过T-DT团队提升工程实践能力...',
    status: 'approved',
    submitTime: new Date('2024-01-10T14:20:00'),
  }
])

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
      // 初始化投递表单的基本信息
      Object.assign(applicationForm, result.data)
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
  } else if (tab === 'applications') {
    // 切换到投递页面时，默认显示列表视图
    applicationView.value = 'list'
    isEditingApplication.value = false
    editingApplicationId.value = null
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

// ========== 投递管理相关函数 ==========

// 获取状态显示文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知状态'
}

// 获取状态样式类
const getStatusClass = (status) => {
  return `status-${status}`
}

// 格式化日期
const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 新增投递
const addNewApplication = () => {
  isEditingApplication.value = false
  editingApplicationId.value = null
  applicationView.value = 'form'
  
  // 重置表单并填入用户基本信息
  Object.assign(applicationForm, {
    nickname: '',
    gender: '',
    realname: '',
    student_id: '',
    department: '',
    major: '',
    grade: '',
    rank: '',
    firstChoice: '',
    secondChoice: '无', // 第二志愿默认为"无"
    experience: '',
    skills: '',
    selfEvaluation: ''
  })
  Object.assign(applicationForm, userInfo.value)
}

// 编辑投递
const editApplication = (application) => {
  isEditingApplication.value = true
  editingApplicationId.value = application.id
  applicationView.value = 'form'
  
  // 填充表单数据
  Object.assign(applicationForm, application)
}

// 查看投递详情
const viewApplication = (application) => {
  // 这里可以弹出详情对话框或跳转到详情页面
  // 暂时使用alert显示基本信息
  const details = [
    `姓名：${application.realname}`,
    `学号：${application.student_id}`,
    `第一志愿：${application.firstChoice}`,
    `第二志愿：${application.secondChoice === '无' ? '无' : application.secondChoice}`,
    `状态：${getStatusText(application.status)}`,
    `提交时间：${formatDate(application.submitTime)}`
  ].join('\n')
  
  alert(`投递详情：\n\n${details}`)
}

// 删除投递
const deleteApplication = (id) => {
  if (confirm('确定要删除这个投递吗？此操作不可撤销。')) {
    applications.value = applications.value.filter(app => app.id !== id)
    alert('投递已删除')
  }
}

// 返回投递列表
const backToList = () => {
  applicationView.value = 'list'
  isEditingApplication.value = false
  editingApplicationId.value = null
}

// 处理第一志愿变化
const handleFirstChoiceChange = () => {
  // 如果第一志愿选择了运营，第二志愿自动设置为无
  if (applicationForm.firstChoice === '运营') {
    applicationForm.secondChoice = '无'
  }
}

// 处理投递提交
const handleApplicationSubmit = async () => {
  // 验证必填字段
  if (!applicationForm.firstChoice) {
    alert('请选择第一志愿')
    return
  }
  
  isApplicationSubmitting.value = true
  try {
    // 过滤掉空值
    const submitData = Object.fromEntries(
      Object.entries(applicationForm).filter(([_, value]) => value !== '')
    )
    
    console.log('投递提交数据:', submitData)
    
    // TODO: 这里将来会调用后端API
    // const result = await authAPI.submitApplication(submitData)
    
    // 暂时使用模拟的成功响应
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
    
    if (isEditingApplication.value) {
      // 更新现有投递
      const index = applications.value.findIndex(app => app.id === editingApplicationId.value)
      if (index !== -1) {
        applications.value[index] = {
          ...applications.value[index],
          ...submitData,
          // 如果是编辑，保持原状态和提交时间
        }
      }
      alert('投递更新成功！')
    } else {
      // 新增投递
      const newApplication = {
        id: Date.now(), // 临时ID，实际应由后端生成
        ...submitData,
        status: 'pending',
        submitTime: new Date()
      }
      applications.value.unshift(newApplication)
      alert('投递提交成功！请等待审核结果。')
    }
    
    // 返回列表视图
    backToList()
    
  } catch (error) {
    console.error('提交投递失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    isApplicationSubmitting.value = false
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
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  gap: 2rem;
  overflow: hidden; /* 防止整体页面滚动 */
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
  flex-shrink: 0; /* 防止侧栏被压缩 */
  height: calc(100vh - 4rem); /* 固定高度，减去padding */
  overflow-y: auto; /* 侧栏内容过长时可滚动 */
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
  height: calc(100vh - 4rem); /* 固定高度，减去padding */
  overflow-y: auto; /* 内容过长时可滚动 */
  display: flex;
  flex-direction: column;
}

/* 内容区域样式 */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 确保内容区域可以滚动 */
  min-height: 0; /* 重要：允许flex项目缩小 */
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8b400;
  flex-shrink: 0; /* 标题不要被压缩 */
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
  flex: 1;
  overflow-y: auto; /* 表单内容过长时可滚动 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

/* 简历表单样式 */
.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #f8b400;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8b400;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group.full-width {
  margin-bottom: 1.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group textarea:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

/* ========== 投递管理样式 ========== */

/* 投递页面头部 */
.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0; /* 头部不要被压缩 */
}

.add-application-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.add-application-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 表单头部 */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0; /* 头部不要被压缩 */
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* 空状态 */
.no-applications {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #999;
  line-height: 1.6;
}

/* 投递列表 */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto; /* 投递列表可滚动 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.application-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #f8b400;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.application-info {
  flex: 1;
}

.application-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.choice {
  padding: 0.25rem 0.75rem;
  background: rgba(248, 180, 0, 0.1);
  border: 1px solid rgba(248, 180, 0, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #f8b400;
  font-weight: 500;
}

.choice.second {
  background: rgba(108, 117, 125, 0.1);
  border-color: rgba(108, 117, 125, 0.3);
  color: #6c757d;
}

.application-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-approved {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.submit-time {
  font-size: 0.8rem;
  color: #666;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.info-preview {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-item {
  font-size: 0.9rem;
  color: #666;
}

.info-item strong {
  color: #333;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.view-btn {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.3);
}

.view-btn:hover {
  background: rgba(13, 110, 253, 0.2);
  transform: translateY(-1px);
}

.edit-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.edit-btn:hover:not(:disabled) {
  background: rgba(248, 180, 0, 0.2);
  transform: translateY(-1px);
}

.delete-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.delete-btn:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.2);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar,
.content-section::-webkit-scrollbar,
.edit-form::-webkit-scrollbar,
.applications-list::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track,
.content-section::-webkit-scrollbar-track,
.edit-form::-webkit-scrollbar-track,
.applications-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb,
.content-section::-webkit-scrollbar-thumb,
.edit-form::-webkit-scrollbar-thumb,
.applications-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover,
.content-section::-webkit-scrollbar-thumb:hover,
.edit-form::-webkit-scrollbar-thumb:hover,
.applications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
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
    height: auto; /* 移动端恢复自动高度 */
    overflow: visible; /* 移动端允许整体滚动 */
  }
  
  .sidebar {
    width: 100%;
    height: auto; /* 移动端侧栏自动高度 */
    overflow-y: visible; /* 移动端不需要独立滚动 */
  }
  
  .main-content {
    height: auto; /* 移动端主要内容自动高度 */
    overflow-y: visible; /* 移动端不需要独立滚动 */
  }
  
  .content-section {
    overflow-y: visible; /* 移动端内容区域不需要独立滚动 */
  }
  
  .edit-form {
    overflow-y: visible; /* 移动端表单不需要独立滚动 */
  }
  
  .applications-list {
    overflow-y: visible; /* 移动端投递列表不需要独立滚动 */
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  /* 投递管理响应式 */
  .applications-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .card-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .card-actions {
    justify-content: center;
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
  
  /* 投递管理移动端优化 */
  .application-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .application-status {
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
  }
  
  .choices {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .choice {
    align-self: flex-start;
  }
  
  .info-preview {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
  
  .no-applications {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}
</style>
