<template>
  <div class="profile-container">
    <!-- NeuralBg 背景 -->
    <div class="neural-bg-container">
      <NeuralBg />
    </div>
    
    <!-- 主要内容区域 -->
    <div class="profile-main-content">
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
              <IInput 
                type="text" 
                id="nickname" 
                v-model="editForm.nickname" 
                placeholder="请输入昵称"
              />
            </div>
            <div class="form-group">
              <label for="realname">真实姓名</label>
              <IInput 
                type="text" 
                id="realname" 
                v-model="editForm.realname" 
                placeholder="请输入真实姓名"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="gender">性别</label>
              <ISelect id="gender" v-model="editForm.gender">
                <option value="" disabled selected>请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </ISelect>
            </div>
            <div class="form-group">
              <label for="student_id">学号</label>
              <IInput 
                type="text" 
                id="student_id" 
                v-model="editForm.student_id" 
                placeholder="请输入学号"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="department">学院</label>
              <IInput 
                type="text" 
                id="department" 
                v-model="editForm.department" 
                placeholder="请输入学院"
              />
            </div>
            <div class="form-group">
              <label for="major">专业</label>
              <IInput 
                type="text" 
                id="major" 
                v-model="editForm.major" 
                placeholder="请输入专业"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="grade">年级</label>
              <ISelect id="grade" v-model="editForm.grade">
                <option value="" disabled selected>请选择年级</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </ISelect>
            </div>
            <div class="form-group">
              <label for="rank">学历</label>
              <ISelect id="rank" v-model="editForm.rank">
                <option value="" disabled selected>请选择学历</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </ISelect>
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

      <!-- 管理投递 -->
      <div v-if="activeTab === 'applications'" class="content-section">
        <!-- 招聘批次列表视图 -->
        <div v-if="applicationView === 'list'">
          <div class="applications-header">
            <h2 class="section-title">招聘批次</h2>
            <div class="view-toggle">
              <button 
                class="toggle-btn" 
                :class="{ active: showOnlyAvailable }"
                @click="toggleView"
              >
                {{ showOnlyAvailable ? '显示所有批次' : '仅显示可投递' }}
              </button>
            </div>
          </div>
          
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="recruitList.length === 0" class="no-applications">
            <div class="empty-state">
              <span class="empty-icon">📋</span>
              <h3>暂无招聘批次</h3>
              <p>{{ showOnlyAvailable ? '当前没有可投递的招聘批次' : '暂无任何招聘批次' }}</p>
            </div>
          </div>
          
          <div v-else class="recruit-list">
            <div 
              v-for="recruit in recruitList" 
              :key="recruit.recruit_id"
              class="recruit-card"
            >
              <div class="card-header">
                <div class="recruit-info">
                  <h3 class="recruit-title">{{ recruit.name }}</h3>
                  <div class="recruit-meta">
                    <span class="recruit-id">批次ID: {{ recruit.recruit_id }}</span>
                    <span class="recruit-time">
                      {{ formatDate(recruit.start_time) }} - {{ formatDate(recruit.end_time) }}
                    </span>
                  </div>
                </div>
                <div class="recruit-status">
                  <span class="status-badge" :class="getRecruitStatusClass(recruit)">
                    {{ getRecruitStatusText(recruit) }}
                  </span>
                  <span v-if="recruit.is_applyed" class="applied-badge">
                    已申请
                  </span>
                </div>
              </div>
              
              <div class="card-content">
                <div class="recruit-details">
                  <div class="detail-item">
                    <strong>开始时间：</strong>{{ formatDate(recruit.start_time) }}
                  </div>
                  <div class="detail-item">
                    <strong>结束时间：</strong>{{ formatDate(recruit.end_time) }}
                  </div>
                  <div class="detail-item">
                    <strong>状态：</strong>{{ getRecruitStatusText(recruit) }}
                  </div>
                </div>
                
                <div class="card-actions">
                  <button 
                    class="action-btn view-btn" 
                    @click="viewRecruitDetail(recruit)"
                  >
                    查看详情
                  </button>
                  <button 
                    v-if="recruit.is_active && recruit.available && !recruit.is_applyed"
                    class="action-btn apply-btn" 
                    @click="applyToRecruit(recruit)"
                  >
                    立即申请
                  </button>
                  <button 
                    v-else-if="recruit.is_applyed"
                    class="action-btn applied-btn" 
                    disabled
                  >
                    已申请
                  </button>
                  <button 
                    v-else-if="!recruit.is_active"
                    class="action-btn disabled-btn" 
                    disabled
                  >
                    未发布
                  </button>
                  <button 
                    v-else
                    class="action-btn disabled-btn" 
                    disabled
                  >
                    不可申请
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 申请表单视图 -->
        <div v-else-if="applicationView === 'form'">
          <div class="form-header">
            <h2 class="section-title">
              申请 {{ selectedRecruit?.name || '招聘' }}
            </h2>
            <button class="back-btn" @click="backToList">
              ← 返回列表
            </button>
          </div>
          
          <form @submit.prevent="handleApplicationSubmit" class="edit-form" enctype="multipart/form-data">
            <!-- 志愿选择部分 -->
            <div class="form-section">
              <h3 class="section-subtitle">志愿选择</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="app-first-choice">第一志愿 <span class="required">*</span></label>
                  <ISelect id="app-first-choice" v-model="applicationForm['1st_choice']" required>
                    <option value="" disabled selected>请选择第一志愿</option>
                    <option v-for="position in positions" :key="position" :value="position">
                      {{ position }}
                    </option>
                  </ISelect>
                </div>
                <div class="form-group">
                  <label for="app-second-choice">第二志愿</label>
                  <ISelect id="app-second-choice" v-model="applicationForm['2nd_choice']">
                    <option value="">无</option>
                    <option v-for="position in positions" :key="position" :value="position">
                      {{ position }}
                    </option>
                  </ISelect>
                </div>
              </div>
            </div>

            <!-- 详细信息部分 -->
            <div class="form-section">
              <h3 class="section-subtitle">详细信息</h3>
              <div class="form-group full-width">
                <label for="app-self-intro">自我介绍 <span class="required">*</span></label>
                <textarea 
                  id="app-self-intro" 
                  v-model="applicationForm.self_intro" 
                  placeholder="请详细描述您的个人经历、实习经验、项目经验、获得的奖项和荣誉等..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="app-skills">技能 <span class="required">*</span></label>
                <textarea 
                  id="app-skills" 
                  v-model="applicationForm.skills" 
                  placeholder="请描述您掌握的专业技能，如编程语言、软件工具、硬件设备等..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="app-projects">项目经历 <span class="required">*</span></label>
                <textarea 
                  id="app-projects" 
                  v-model="applicationForm.projects" 
                  placeholder="请描述您参与过的项目经历..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label for="app-awards">获奖经历 <span class="required">*</span></label>
                <textarea 
                  id="app-awards" 
                  v-model="applicationForm.awards" 
                  placeholder="请描述您获得的奖项和荣誉..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="app-grade-point">绩点</label>
                  <IInput 
                    type="text" 
                    id="app-grade-point" 
                    v-model="applicationForm.grade_point" 
                    placeholder="请输入绩点（如：3.8）"
                  />
                </div>
                <div class="form-group">
                  <label for="app-grade-rank">成绩排名</label>
                  <IInput 
                    type="text" 
                    id="app-grade-rank" 
                    v-model="applicationForm.grade_rank" 
                    placeholder="请输入成绩排名（如：5%）"
                  />
                </div>
              </div>
              
              <div class="form-group full-width">
                <label for="app-additional-file">附加文件</label>
                <input 
                  type="file" 
                  id="app-additional-file" 
                  @change="handleFileChange"
                  accept=".pdf,.doc,.docx"
                  class="file-input"
                />
                <p class="file-hint">支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB</p>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isApplicationSubmitting">
                {{ isApplicationSubmitting ? '提交中...' : '提交申请' }}
              </button>
              <button type="button" class="cancel-btn" @click="backToList">
                取消
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 招聘管理界面（仅管理员可见） -->
      <div v-if="activeTab === 'recruit-management'" class="content-section">
        <!-- 招聘管理列表视图 -->
        <div v-if="recruitManagementView === 'list'">
          <div class="recruit-management-header">
            <h2 class="section-title">招聘管理</h2>
            <button class="add-recruit-btn" @click="addNewRecruit">
              <span class="btn-icon">➕</span>
              新增招聘批次
            </button>
          </div>
          
          <div v-if="recruitManagementLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="allRecruitList.length === 0" class="no-recruits">
            <div class="empty-state">
              <span class="empty-icon">📋</span>
              <h3>暂无招聘批次</h3>
              <p>还没有创建任何招聘批次，点击上方"新增招聘批次"按钮开始创建</p>
            </div>
          </div>
          
          <div v-else class="recruit-management-list">
            <div 
              v-for="recruit in allRecruitList" 
              :key="recruit.recruit_id"
              class="recruit-management-card"
            >
              <div class="card-header">
                <div class="recruit-info">
                  <h3 class="recruit-title">{{ recruit.name }}</h3>
                  <div class="recruit-meta">
                    <span class="recruit-id">批次ID: {{ recruit.recruit_id }}</span>
                    <span class="recruit-time">
                      {{ formatDate(recruit.start_time) }} - {{ formatDate(recruit.end_time) }}
                    </span>
                  </div>
                </div>
                <div class="recruit-status">
                  <span class="status-badge" :class="getRecruitStatusClass(recruit)">
                    {{ getRecruitStatusText(recruit) }}
                  </span>
                  <span class="active-status" :class="{ active: recruit.is_active }">
                    {{ recruit.is_active ? '已发布' : '未发布' }}
                  </span>
                </div>
              </div>
              
              <div class="card-content">
                <div class="recruit-details">
                  <div class="detail-item">
                    <strong>开始时间：</strong>{{ formatDate(recruit.start_time) }}
                  </div>
                  <div class="detail-item">
                    <strong>结束时间：</strong>{{ formatDate(recruit.end_time) }}
                  </div>
                  <div class="detail-item">
                    <strong>状态：</strong>{{ getRecruitStatusText(recruit) }}
                  </div>
                  <div class="detail-item" v-if="recruit.description">
                    <strong>描述：</strong>{{ recruit.description }}
                  </div>
                </div>
                
                <div class="card-actions">
                  <button 
                    class="action-btn view-btn" 
                    @click="viewRecruitDetail(recruit)"
                  >
                    查看详情
                  </button>
                  <button 
                    class="action-btn edit-btn" 
                    @click="editRecruit(recruit)"
                  >
                    编辑
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="deleteRecruit(recruit)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 新增/编辑招聘表单视图 -->
        <div v-else-if="recruitManagementView === 'form'">
          <div class="form-header">
            <h2 class="section-title">
              {{ isEditingRecruit ? '编辑招聘批次' : '新增招聘批次' }}
            </h2>
            <button class="back-btn" @click="backToRecruitList">
              ← 返回列表
            </button>
          </div>
          
          <form @submit.prevent="handleRecruitSubmit" class="edit-form">
            <div class="form-section">
              <h3 class="section-subtitle">基本信息</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="recruit-id">批次ID <span class="required">*</span></label>
                  <IInput 
                    type="text" 
                    id="recruit-id" 
                    v-model="recruitForm.recruit_id" 
                    placeholder="请输入批次ID（如：2025-autumn）"
                    :disabled="isEditingRecruit"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="recruit-name">招聘名称 <span class="required">*</span></label>
                  <IInput 
                    type="text" 
                    id="recruit-name" 
                    v-model="recruitForm.name" 
                    placeholder="请输入招聘名称"
                    required
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="start-time">开始时间 <span class="required">*</span></label>
                  <IInput 
                    type="datetime-local" 
                    id="start-time" 
                    v-model="recruitForm.start_time" 
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="end-time">结束时间 <span class="required">*</span></label>
                  <IInput 
                    type="datetime-local" 
                    id="end-time" 
                    v-model="recruitForm.end_time" 
                    required
                  />
                </div>
              </div>
              
              <div class="form-group full-width">
                <label for="recruit-description">描述</label>
                <textarea 
                  id="recruit-description" 
                  v-model="recruitForm.description" 
                  placeholder="请输入招聘批次的详细描述..."
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="recruitForm.is_active"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">发布此招聘批次（对用户可见）</span>
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isRecruitSubmitting">
                {{ isRecruitSubmitting ? '提交中...' : (isEditingRecruit ? '更新招聘批次' : '创建招聘批次') }}
              </button>
              <button type="button" class="cancel-btn" @click="backToRecruitList">
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div> <!-- 关闭 profile-main-content -->
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'
import IInput from '@/components/inspira/IInput.vue'
import ISelect from '@/components/inspira/ISelect.vue'
import NeuralBg from '@/components/inspira/NeuralBg.vue'

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

// 招聘批次相关状态
const recruitList = ref([])
const loading = ref(false)
const showOnlyAvailable = ref(false)
const selectedRecruit = ref(null)
const positions = ref([])

// 招聘管理相关状态
const allRecruitList = ref([])
const recruitManagementView = ref('list') // 'list' | 'form'
const recruitManagementLoading = ref(false)
const isEditingRecruit = ref(false)
const isRecruitSubmitting = ref(false)
const editingRecruitId = ref(null)

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
  // 招聘信息
  recruit_id: '',
  // 志愿选择
  '1st_choice': '',
  '2nd_choice': '', // 第二志愿可选
  // 详细信息
  self_intro: '',
  skills: '',
  projects: '',
  awards: '',
  grade_point: '',
  grade_rank: '',
  additional_file: null
})

// 招聘管理表单数据
const recruitForm = reactive({
  recruit_id: '',
  name: '',
  start_time: '',
  end_time: '',
  description: '',
  is_active: true
})

// 获取招聘批次列表
const fetchRecruitList = async () => {
  loading.value = true
  try {
    const result = await authAPI.getRecruitList(showOnlyAvailable.value)
    if (result.success) {
      recruitList.value = result.data
    } else {
      console.error('获取招聘列表失败:', result.error)
      alert('获取招聘列表失败：' + result.error)
    }
  } catch (error) {
    console.error('获取招聘列表失败:', error)
    alert('获取招聘列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取职位列表
const fetchPositions = async () => {
  try {
    const result = await authAPI.getPositions()
    if (result.success) {
      positions.value = result.data.positions || []
    } else {
      console.error('获取职位列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
  }
}

// 获取所有招聘批次列表（管理员用）
const fetchAllRecruitList = async () => {
  recruitManagementLoading.value = true
  try {
    const result = await authAPI.getRecruitList(false) // 获取所有批次
    if (result.success) {
      allRecruitList.value = result.data
    } else {
      console.error('获取招聘列表失败:', result.error)
      alert('获取招聘列表失败：' + result.error)
    }
  } catch (error) {
    console.error('获取招聘列表失败:', error)
    alert('获取招聘列表失败，请稍后重试')
  } finally {
    recruitManagementLoading.value = false
  }
}

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
    // 加载招聘列表和职位列表
    fetchRecruitList()
    fetchPositions()
  } else if (tab === 'recruit-management') {
    // 切换到招聘管理页面时，检查权限并加载数据
    if (!userInfo.value?.permission) {
      alert('您没有权限访问此功能')
      activeTab.value = 'info'
      return
    }
    // 默认显示列表视图
    recruitManagementView.value = 'list'
    isEditingRecruit.value = false
    editingRecruitId.value = null
    // 加载所有招聘列表
    fetchAllRecruitList()
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

// ========== 招聘批次管理相关函数 ==========

// 切换视图（显示所有批次/仅显示正在招聘）
const toggleView = () => {
  showOnlyAvailable.value = !showOnlyAvailable.value
  fetchRecruitList()
}

// 获取招聘状态显示文本
const getRecruitStatusText = (recruit) => {
  if (!recruit.is_active) {
    return '未发布'
  } else if (recruit.available) {
    return '可投递'
  } else {
    return '不可投递'
  }
}

// 获取招聘状态样式类
const getRecruitStatusClass = (recruit) => {
  if (!recruit.is_active) {
    return 'status-inactive'
  } else if (recruit.available) {
    return 'status-available'
  } else {
    return 'status-ended'
  }
}

// 查看招聘详情
const viewRecruitDetail = async (recruit) => {
  try {
    const result = await authAPI.getRecruitInfo(recruit.recruit_id)
    if (result.success) {
      const details = [
        `招聘名称：${result.data.name}`,
        `批次ID：${result.data.recruit_id}`,
        `开始时间：${formatDate(result.data.start_time)}`,
        `结束时间：${formatDate(result.data.end_time)}`,
        `状态：${getRecruitStatusText(result.data)}`,
        `描述：${result.data.description || '暂无描述'}`
      ].join('\n')
      
      alert(`招聘详情：\n\n${details}`)
    } else {
      alert('获取招聘详情失败：' + result.error)
    }
  } catch (error) {
    console.error('获取招聘详情失败:', error)
    alert('获取招聘详情失败，请稍后重试')
  }
}

// 申请招聘
const applyToRecruit = (recruit) => {
  selectedRecruit.value = recruit
  applicationForm.recruit_id = recruit.recruit_id
  applicationView.value = 'form'
  isEditingApplication.value = false
}

// ========== 招聘管理相关函数 ==========

// 新增招聘批次
const addNewRecruit = () => {
  isEditingRecruit.value = false
  editingRecruitId.value = null
  recruitManagementView.value = 'form'
  
  // 重置表单
  Object.assign(recruitForm, {
    recruit_id: '',
    name: '',
    start_time: '',
    end_time: '',
    description: '',
    is_active: true
  })
}

// 编辑招聘批次
const editRecruit = (recruit) => {
  isEditingRecruit.value = true
  editingRecruitId.value = recruit.recruit_id
  recruitManagementView.value = 'form'
  
  // 填充表单数据
  Object.assign(recruitForm, {
    recruit_id: recruit.recruit_id,
    name: recruit.name,
    start_time: formatDateTimeForInput(recruit.start_time),
    end_time: formatDateTimeForInput(recruit.end_time),
    description: recruit.description || '',
    is_active: recruit.is_active
  })
}

// 删除招聘批次
const deleteRecruit = async (recruit) => {
  if (confirm(`确定要删除招聘批次"${recruit.name}"吗？此操作不可撤销。`)) {
    try {
      const result = await authAPI.deleteRecruit(recruit.recruit_id)
      if (result.success) {
        alert('招聘批次删除成功！')
        // 刷新列表
        fetchAllRecruitList()
      } else {
        alert('删除失败：' + result.error)
      }
    } catch (error) {
      console.error('删除招聘批次失败:', error)
      alert('删除失败，请稍后重试')
    }
  }
}

// 返回招聘管理列表
const backToRecruitList = () => {
  recruitManagementView.value = 'list'
  isEditingRecruit.value = false
  editingRecruitId.value = null
  
  // 重置表单
  Object.assign(recruitForm, {
    recruit_id: '',
    name: '',
    start_time: '',
    end_time: '',
    description: '',
    is_active: true
  })
}

// 处理招聘表单提交
const handleRecruitSubmit = async () => {
  // 验证必填字段
  if (!recruitForm.recruit_id) {
    alert('请输入批次ID')
    return
  }
  
  if (!recruitForm.name) {
    alert('请输入招聘名称')
    return
  }
  
  if (!recruitForm.start_time) {
    alert('请选择开始时间')
    return
  }
  
  if (!recruitForm.end_time) {
    alert('请选择结束时间')
    return
  }
  
  // 验证时间逻辑
  if (new Date(recruitForm.start_time) >= new Date(recruitForm.end_time)) {
    alert('结束时间必须晚于开始时间')
    return
  }
  
  isRecruitSubmitting.value = true
  try {
    // 准备提交数据
    const submitData = {
      recruit_id: recruitForm.recruit_id,
      name: recruitForm.name,
      start_time: formatDateTimeForAPI(recruitForm.start_time),
      end_time: formatDateTimeForAPI(recruitForm.end_time),
      description: recruitForm.description,
      is_active: recruitForm.is_active
    }
    
    let result
    if (isEditingRecruit.value) {
      // 更新招聘批次
      result = await authAPI.updateRecruit(editingRecruitId.value, submitData)
    } else {
      // 创建新招聘批次
      result = await authAPI.createRecruit(submitData)
    }
    
    if (result.success) {
      alert(isEditingRecruit.value ? '招聘批次更新成功！' : '招聘批次创建成功！')
      // 返回列表视图并刷新数据
      backToRecruitList()
      fetchAllRecruitList()
    } else {
      alert((isEditingRecruit.value ? '更新' : '创建') + '失败：' + result.error)
    }
    
  } catch (error) {
    console.error('提交招聘批次失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    isRecruitSubmitting.value = false
  }
}

// 格式化日期时间用于输入框
const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 格式化日期时间用于API
const formatDateTimeForAPI = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      event.target.value = ''
      return
    }
    
    // 检查文件类型
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 PDF、DOC、DOCX 格式的文件')
      event.target.value = ''
      return
    }
    
    applicationForm.additional_file = file
  }
}

// 返回招聘列表
const backToList = () => {
  applicationView.value = 'list'
  isEditingApplication.value = false
  editingApplicationId.value = null
  selectedRecruit.value = null
  
  // 重置表单
  Object.assign(applicationForm, {
    recruit_id: '',
    '1st_choice': '',
    '2nd_choice': '',
    self_intro: '',
    skills: '',
    projects: '',
    awards: '',
    grade_point: '',
    grade_rank: '',
    additional_file: null
  })
}

// 处理申请提交
const handleApplicationSubmit = async () => {
  // 验证必填字段
  if (!applicationForm['1st_choice']) {
    alert('请选择第一志愿')
    return
  }
  
  if (!applicationForm.self_intro) {
    alert('请填写自我介绍')
    return
  }
  
  if (!applicationForm.skills) {
    alert('请填写技能')
    return
  }
  
  if (!applicationForm.projects) {
    alert('请填写项目经历')
    return
  }
  
  if (!applicationForm.awards) {
    alert('请填写获奖经历')
    return
  }
  
  isApplicationSubmitting.value = true
  try {
    // 创建FormData对象
    const formData = new FormData()
    
    // 添加表单数据
    formData.append('recruit_id', applicationForm.recruit_id)
    formData.append('1st_choice', applicationForm['1st_choice'])
    if (applicationForm['2nd_choice']) {
      formData.append('2nd_choice', applicationForm['2nd_choice'])
    }
    formData.append('self_intro', applicationForm.self_intro)
    formData.append('skills', applicationForm.skills)
    formData.append('projects', applicationForm.projects)
    formData.append('awards', applicationForm.awards)
    
    if (applicationForm.grade_point) {
      formData.append('grade_point', applicationForm.grade_point)
    }
    if (applicationForm.grade_rank) {
      formData.append('grade_rank', applicationForm.grade_rank)
    }
    if (applicationForm.additional_file) {
      formData.append('additional_file', applicationForm.additional_file)
    }
    
    // 调用后端API提交申请
    const result = await authAPI.submitApplication(formData)
    
    if (result.success) {
      alert('申请提交成功！请等待审核结果。')
      // 返回列表视图并刷新数据
      backToList()
      fetchRecruitList()
    } else {
      alert('提交申请失败：' + result.error)
    }
    
  } catch (error) {
    console.error('提交申请失败:', error)
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
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden; /* 防止整体页面滚动 */
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
  transform: translateZ(0); /* 启用硬件加速 */
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
}

/* 左侧侧栏样式 */
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
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

/* 文件输入样式 */
.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  cursor: pointer;
}

.file-input:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.file-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #f8b400;
}

.checkbox-text {
  user-select: none;
}

/* ========== 招聘批次管理样式 ========== */

/* 招聘页面头部 */
.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0; /* 头部不要被压缩 */
}

/* 招聘管理页面头部 */
.recruit-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0; /* 头部不要被压缩 */
}

.add-recruit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.add-recruit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #e9ecef;
  border-color: #f8b400;
  color: #f8b400;
}

.toggle-btn.active {
  background: #f8b400;
  color: white;
  border-color: #f8b400;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

/* 招聘列表 */
.recruit-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto; /* 招聘列表可滚动 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.recruit-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #f8b400;
}

.recruit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* 招聘管理列表 */
.recruit-management-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto; /* 招聘管理列表可滚动 */
  padding-right: 0.5rem; /* 为滚动条留出空间 */
}

.recruit-management-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
}

.recruit-management-card:hover {
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

.recruit-info {
  flex: 1;
}

.recruit-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.recruit-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recruit-id {
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.recruit-time {
  font-size: 0.9rem;
  color: #666;
}

.recruit-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.applied-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #28a745;
  font-weight: 500;
}

.active-status {
  padding: 0.25rem 0.75rem;
  background: rgba(108, 117, 125, 0.1);
  border: 1px solid rgba(108, 117, 125, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.active-status.active {
  background: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.3);
  color: #28a745;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-inactive {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.status-available {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-ended {
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

.recruit-details {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  font-size: 0.9rem;
  color: #666;
}

.detail-item strong {
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

.apply-btn {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.apply-btn:hover:not(:disabled) {
  background: rgba(40, 167, 69, 0.2);
  transform: translateY(-1px);
}

.applied-btn {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.disabled-btn {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
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
.recruit-list::-webkit-scrollbar,
.recruit-management-list::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track,
.content-section::-webkit-scrollbar-track,
.edit-form::-webkit-scrollbar-track,
.recruit-list::-webkit-scrollbar-track,
.recruit-management-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb,
.content-section::-webkit-scrollbar-thumb,
.edit-form::-webkit-scrollbar-thumb,
.recruit-list::-webkit-scrollbar-thumb,
.recruit-management-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover,
.content-section::-webkit-scrollbar-thumb:hover,
.edit-form::-webkit-scrollbar-thumb:hover,
.recruit-list::-webkit-scrollbar-thumb:hover,
.recruit-management-list::-webkit-scrollbar-thumb:hover {
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
  
  .recruit-list,
  .recruit-management-list {
    overflow-y: visible; /* 移动端招聘列表不需要独立滚动 */
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
  
  /* 招聘管理移动端优化 */
  .recruit-card,
  .recruit-management-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .recruit-status {
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
  }
  
  .recruit-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .recruit-details {
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
