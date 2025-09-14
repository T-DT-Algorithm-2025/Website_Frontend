<template>
  <div class="interview-list">
    <div class="list-header">
      <h3 class="list-title">
        <span class="title-icon">👥</span>
        面试列表管理
      </h3>
      <p class="list-description">
        查看和管理所有面试安排
      </p>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-left">
        <div class="filter-group">
          <label class="filter-label">状态筛选:</label>
          <select 
            v-model="filters.status" 
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">全部状态</option>
            <option value="scheduled">已安排</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">志愿筛选:</label>
          <select 
            v-model="filters.choice" 
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">全部志愿</option>
            <option 
              v-for="position in availablePositions" 
              :key="position"
              :value="position"
            >
              {{ position }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">日期筛选:</label>
          <input 
            v-model="filters.date" 
            type="date" 
            class="filter-input"
            @change="applyFilters"
          />
        </div>
      </div>

      <div class="filter-right">
        <button 
          @click="clearFilters"
          class="btn-secondary"
          v-if="hasActiveFilters"
        >
          清除筛选
        </button>
        
        <button 
          @click="refreshList"
          class="btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner small"></span>
          {{ loading ? '刷新中...' : '刷新' }}
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-number">{{ stats.total }}</div>
        <div class="stat-label">总面试数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.scheduled }}</div>
        <div class="stat-label">已安排</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.cancelled }}</div>
        <div class="stat-label">已取消</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载面试列表...</p>
    </div>

    <!-- 面试列表 -->
    <div v-else-if="filteredInterviews.length > 0" class="interviews-list">
      <div 
        v-for="interview in filteredInterviews" 
        :key="interview.interview_id"
        class="interview-card"
        :class="getInterviewStatusClass(interview)"
      >
        <div class="card-header">
          <div class="interview-info">
            <h4 class="interview-student">{{ interview.student_name }}</h4>
            <p class="interview-choice">{{ interview.choice }}</p>
          </div>
          <div class="interview-status">
            <span class="status-badge" :class="getStatusBadgeClass(interview.status)">
              {{ getStatusText(interview.status) }}
            </span>
          </div>
        </div>
        
        <div class="card-body">
          <div class="interview-details">
            <div class="detail-row">
              <span class="detail-label">📅 面试时间:</span>
              <span class="detail-value">{{ formatDateTime(interview.interview_time) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📍 面试地点:</span>
              <span class="detail-value">{{ interview.location }}</span>
            </div>
            <div class="detail-row" v-if="interview.student_id">
              <span class="detail-label">👤 学号:</span>
              <span class="detail-value">{{ interview.student_id }}</span>
            </div>
            <div class="detail-row" v-if="interview.phone_number">
              <span class="detail-label">📞 联系方式:</span>
              <span class="detail-value">{{ interview.phone_number }}</span>
            </div>
            <div class="detail-row" v-if="interview.notes">
              <span class="detail-label">📝 备注:</span>
              <span class="detail-value">{{ interview.notes }}</span>
            </div>
          </div>

          <!-- 面试结果 -->
          <div v-if="interview.result" class="interview-result">
            <h5 class="result-title">面试结果</h5>
            <div class="result-info">
              <div class="result-item">
                <span class="result-label">是否通过:</span>
                <span class="result-value" :class="interview.result.passed ? 'passed' : 'failed'">
                  {{ interview.result.passed ? '通过' : '未通过' }}
                </span>
              </div>
              <div class="result-item" v-if="interview.result.score">
                <span class="result-label">面试分数:</span>
                <span class="result-value">{{ interview.result.score }}分</span>
              </div>
              <div class="result-item" v-if="interview.result.comments">
                <span class="result-label">评价:</span>
                <span class="result-value">{{ interview.result.comments }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button 
            @click="viewStudentResume(interview)"
            class="action-btn view-btn"
            title="查看简历"
          >
            📄 简历
          </button>
          
          <button 
            v-if="interview.status === 'scheduled'"
            @click="rescheduleInterview(interview)"
            class="action-btn reschedule-btn"
            title="重新安排"
          >
            🔄 重安排
          </button>
          
          <button 
            v-if="interview.status === 'scheduled'"
            @click="recordResult(interview)"
            class="action-btn result-btn"
            title="记录结果"
          >
            ✅ 记录结果
          </button>
          
          <button 
            v-if="interview.status === 'scheduled'"
            @click="cancelInterview(interview)"
            class="action-btn cancel-btn"
            title="取消面试"
          >
            ❌ 取消
          </button>
          
          <button 
            v-if="interview.result"
            @click="editResult(interview)"
            class="action-btn edit-btn"
            title="修改结果"
          >
            ✏️ 修改结果
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <span class="empty-icon">👥</span>
      <h3>{{ hasActiveFilters ? '没有符合条件的面试' : '暂无面试安排' }}</h3>
      <p>{{ hasActiveFilters ? '尝试调整筛选条件查看更多结果' : '学生预约面试后会在这里显示' }}</p>
      <button 
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="btn-primary"
      >
        清除筛选条件
      </button>
    </div>

    <!-- 重安排面试模态框 -->
    <div v-if="showRescheduleModal" class="modal-overlay" @click="closeRescheduleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">重新安排面试</h4>
          <button @click="closeRescheduleModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitReschedule" class="reschedule-form">
          <div class="form-group">
            <label class="form-label">学生信息</label>
            <div class="student-info">
              <strong>{{ rescheduleForm.student_name }}</strong> - {{ rescheduleForm.choice }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="new-time">
              新的面试时间 <span class="required">*</span>
            </label>
            <input
              id="new-time"
              v-model="rescheduleForm.interview_time"
              type="datetime-local"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-location">
              新的面试地点 <span class="required">*</span>
            </label>
            <input
              id="new-location"
              v-model="rescheduleForm.location"
              type="text"
              class="form-input"
              placeholder="请输入面试地点"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="reschedule-notes">
              备注说明
            </label>
            <textarea
              id="reschedule-notes"
              v-model="rescheduleForm.notes"
              class="form-textarea"
              placeholder="重新安排的原因或其他说明..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closeRescheduleModal"
              class="btn-secondary"
              :disabled="rescheduleSubmitting"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="rescheduleSubmitting"
            >
              <span v-if="rescheduleSubmitting" class="loading-spinner small"></span>
              {{ rescheduleSubmitting ? '保存中...' : '确认重安排' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 记录结果模态框 -->
    <div v-if="showResultModal" class="modal-overlay" @click="closeResultModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">{{ editingResult ? '修改面试结果' : '记录面试结果' }}</h4>
          <button @click="closeResultModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitResult" class="result-form">
          <div class="form-group">
            <label class="form-label">学生信息</label>
            <div class="student-info">
              <strong>{{ resultForm.student_name }}</strong> - {{ resultForm.choice }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              面试结果 <span class="required">*</span>
            </label>
            <div class="radio-group">
              <label class="radio-item">
                <input
                  v-model="resultForm.passed"
                  type="radio"
                  :value="true"
                  name="result"
                  required
                />
                <span class="radio-label passed">✅ 通过</span>
              </label>
              <label class="radio-item">
                <input
                  v-model="resultForm.passed"
                  type="radio"
                  :value="false"
                  name="result"
                  required
                />
                <span class="radio-label failed">❌ 未通过</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="result-score">
              面试分数 (0-100)
            </label>
            <input
              id="result-score"
              v-model.number="resultForm.score"
              type="number"
              class="form-input"
              placeholder="请输入面试分数"
              min="0"
              max="100"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="result-comments">
              面试评价
            </label>
            <textarea
              id="result-comments"
              v-model="resultForm.comments"
              class="form-textarea"
              placeholder="请输入面试评价和建议..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closeResultModal"
              class="btn-secondary"
              :disabled="resultSubmitting"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="resultSubmitting"
            >
              <span v-if="resultSubmitting" class="loading-spinner small"></span>
              {{ resultSubmitting ? '保存中...' : (editingResult ? '更新结果' : '提交结果') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 取消确认模态框 -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">确认取消面试</h4>
          <button @click="showCancelModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <p>确定要取消 <strong>{{ interviewToCancel?.student_name }}</strong> 的面试吗？</p>
          <p class="warning-text">⚠️ 取消后需要重新安排</p>
        </div>
        
        <div class="modal-actions">
          <button
            @click="showCancelModal = false"
            class="btn-secondary"
            :disabled="cancelling"
          >
            取消
          </button>
          <button
            @click="confirmCancel"
            class="btn-danger"
            :disabled="cancelling"
          >
            <span v-if="cancelling" class="loading-spinner small"></span>
            {{ cancelling ? '取消中...' : '确认取消' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAlert } from '@/composables/useAlert'

const props = defineProps({
  recruitId: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['interview-updated'])

const { showAlert } = useAlert()

// 响应式数据
const loading = ref(false)
const interviewsList = ref([])
const availablePositions = ref(['算法组', '电控组', '机械组', '运营组'])

// 筛选相关
const filters = reactive({
  status: '',
  choice: '',
  date: ''
})

// 模态框状态
const showRescheduleModal = ref(false)
const showResultModal = ref(false)
const showCancelModal = ref(false)
const editingResult = ref(false)
const interviewToCancel = ref(null)

// 提交状态
const rescheduleSubmitting = ref(false)
const resultSubmitting = ref(false)
const cancelling = ref(false)

// 表单数据
const rescheduleForm = reactive({
  interview_id: '',
  student_name: '',
  choice: '',
  interview_time: '',
  location: '',
  notes: ''
})

const resultForm = reactive({
  interview_id: '',
  student_name: '',
  choice: '',
  passed: null,
  score: null,
  comments: ''
})

// 计算属性
const hasActiveFilters = computed(() => {
  return filters.status || filters.choice || filters.date
})

const filteredInterviews = computed(() => {
  let filtered = [...interviewsList.value]
  
  if (filters.status) {
    filtered = filtered.filter(interview => interview.status === filters.status)
  }
  
  if (filters.choice) {
    filtered = filtered.filter(interview => interview.choice === filters.choice)
  }
  
  if (filters.date) {
    const filterDate = new Date(filters.date).toDateString()
    filtered = filtered.filter(interview => {
      const interviewDate = new Date(interview.interview_time).toDateString()
      return interviewDate === filterDate
    })
  }
  
  return filtered.sort((a, b) => new Date(a.interview_time) - new Date(b.interview_time))
})

const stats = computed(() => {
  const total = interviewsList.value.length
  const scheduled = interviewsList.value.filter(i => i.status === 'scheduled').length
  const completed = interviewsList.value.filter(i => i.status === 'completed').length
  const cancelled = interviewsList.value.filter(i => i.status === 'cancelled').length
  
  return { total, scheduled, completed, cancelled }
})

// 监听招聘ID变化
watch(() => props.recruitId, (newId) => {
  if (newId) {
    fetchInterviews()
    fetchPositions()
  }
}, { immediate: true })

// 获取可用职位
const fetchPositions = async () => {
  try {
    const response = await fetch('/api/recruit/positions')
    const result = await response.json()
    
    if (result.success && result.positions) {
      availablePositions.value = result.positions
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
  }
}

// 获取面试列表
const fetchInterviews = async () => {
  if (!props.recruitId) return
  
  loading.value = true
  try {
    const response = await fetch(`/api/admin/interview/list/${props.recruitId}`)
    const result = await response.json()
    
    if (result.success) {
      interviewsList.value = result.data || []
    } else {
      throw new Error(result.error || '获取面试列表失败')
    }
  } catch (error) {
    console.error('获取面试列表失败:', error)
    showAlert('获取面试列表失败: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// 应用筛选
const applyFilters = () => {
  // 筛选逻辑在计算属性中处理
}

// 清除筛选
const clearFilters = () => {
  filters.status = ''
  filters.choice = ''
  filters.date = ''
}

// 刷新列表
const refreshList = () => {
  fetchInterviews()
}

// 查看学生简历
const viewStudentResume = (interview) => {
  // 这里可以打开简历详情页面或模态框
  showAlert('简历查看功能开发中...', 'info')
}

// 重新安排面试
const rescheduleInterview = (interview) => {
  rescheduleForm.interview_id = interview.interview_id
  rescheduleForm.student_name = interview.student_name
  rescheduleForm.choice = interview.choice
  rescheduleForm.interview_time = formatDateTimeForInput(interview.interview_time)
  rescheduleForm.location = interview.location
  rescheduleForm.notes = interview.notes || ''
  
  showRescheduleModal.value = true
}

// 关闭重安排模态框
const closeRescheduleModal = () => {
  showRescheduleModal.value = false
  Object.keys(rescheduleForm).forEach(key => {
    rescheduleForm[key] = ''
  })
}

// 提交重安排
const submitReschedule = async () => {
  rescheduleSubmitting.value = true
  try {
    const response = await fetch(`/api/admin/interview/${rescheduleForm.interview_id}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interview_time: formatDateTimeForBackend(rescheduleForm.interview_time),
        location: rescheduleForm.location,
        notes: rescheduleForm.notes
      }),
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试已重新安排', 'success')
      fetchInterviews()
      emit('interview-updated')
      closeRescheduleModal()
    } else {
      throw new Error(result.error || '重安排失败')
    }
  } catch (error) {
    console.error('重安排面试失败:', error)
    showAlert('重安排失败: ' + error.message, 'error')
  } finally {
    rescheduleSubmitting.value = false
  }
}

// 记录结果
const recordResult = (interview) => {
  editingResult.value = false
  resultForm.interview_id = interview.interview_id
  resultForm.student_name = interview.student_name
  resultForm.choice = interview.choice
  resultForm.passed = null
  resultForm.score = null
  resultForm.comments = ''
  
  showResultModal.value = true
}

// 修改结果
const editResult = (interview) => {
  editingResult.value = true
  resultForm.interview_id = interview.interview_id
  resultForm.student_name = interview.student_name
  resultForm.choice = interview.choice
  resultForm.passed = interview.result?.passed || null
  resultForm.score = interview.result?.score || null
  resultForm.comments = interview.result?.comments || ''
  
  showResultModal.value = true
}

// 关闭结果模态框
const closeResultModal = () => {
  showResultModal.value = false
  editingResult.value = false
  Object.keys(resultForm).forEach(key => {
    if (key === 'passed' || key === 'score') {
      resultForm[key] = null
    } else {
      resultForm[key] = ''
    }
  })
}

// 提交结果
const submitResult = async () => {
  if (resultForm.passed === null) {
    showAlert('请选择面试结果', 'warning')
    return
  }

  resultSubmitting.value = true
  try {
    const response = await fetch(`/api/admin/interview/${resultForm.interview_id}/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passed: resultForm.passed,
        score: resultForm.score,
        comments: resultForm.comments
      }),
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试结果已记录', 'success')
      fetchInterviews()
      emit('interview-updated')
      closeResultModal()
    } else {
      throw new Error(result.error || '记录失败')
    }
  } catch (error) {
    console.error('记录面试结果失败:', error)
    showAlert('记录失败: ' + error.message, 'error')
  } finally {
    resultSubmitting.value = false
  }
}

// 取消面试
const cancelInterview = (interview) => {
  interviewToCancel.value = interview
  showCancelModal.value = true
}

// 确认取消
const confirmCancel = async () => {
  if (!interviewToCancel.value) return
  
  cancelling.value = true
  try {
    const response = await fetch(`/api/admin/interview/${interviewToCancel.value.interview_id}/cancel`, {
      method: 'POST'
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试已取消', 'success')
      fetchInterviews()
      emit('interview-updated')
    } else {
      throw new Error(result.error || '取消失败')
    }
  } catch (error) {
    console.error('取消面试失败:', error)
    showAlert('取消失败: ' + error.message, 'error')
  } finally {
    cancelling.value = false
    showCancelModal.value = false
    interviewToCancel.value = null
  }
}

// 获取面试状态类
const getInterviewStatusClass = (interview) => {
  return `status-${interview.status}`
}

// 获取状态徽章类
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'scheduled':
      return 'badge-scheduled'
    case 'completed':
      return 'badge-completed'
    case 'cancelled':
      return 'badge-cancelled'
    default:
      return 'badge-default'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'scheduled':
      return '已安排'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '未设置'
  
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    }).format(new Date(dateTimeStr))
  } catch (error) {
    return dateTimeStr
  }
}

// 格式化日期时间为输入框格式
const formatDateTimeForInput = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  
  try {
    const date = new Date(dateTimeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return ''
  }
}

// 格式化日期时间为后端需要的格式
const formatDateTimeForBackend = (dateTimeLocal) => {
  try {
    const date = new Date(dateTimeLocal)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('时间格式转换错误:', error)
    return ''
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (props.recruitId) {
    fetchInterviews()
    fetchPositions()
  }
})
</script>

<style scoped>
.interview-list {
  max-width: 1400px;
}

.list-header {
  margin-bottom: 2rem;
  text-align: center;
}

.list-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.3rem;
}

.list-description {
  color: #666;
  margin: 0;
}

.filter-toolbar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.filter-left {
  display: flex;
  gap: 1rem;
  flex: 1;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  font-size: 0.9rem;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  min-width: 120px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 2px rgba(248, 180, 0, 0.1);
}

.filter-right {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #f8b400;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: #f8b400;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #e09900;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 2px solid #dee2e6;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0 0.5rem 0 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.interviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.interview-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
}

.interview-card.status-scheduled {
  border-left-color: #28a745;
}

.interview-card.status-completed {
  border-left-color: #007bff;
}

.interview-card.status-cancelled {
  border-left-color: #dc3545;
}

.interview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.interview-info {
  flex: 1;
}

.interview-student {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.interview-choice {
  color: #f8b400;
  font-weight: 500;
  margin: 0;
}

.interview-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.badge-scheduled {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.badge-completed {
  background: rgba(0, 123, 255, 0.2);
  color: #004085;
  border: 1px solid rgba(0, 123, 255, 0.5);
}

.badge-cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.badge-default {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.card-body {
  padding: 1.5rem;
}

.interview-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  min-width: 100px;
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
  flex: 1;
}

.interview-result {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.result-title {
  color: #333;
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.result-info {
  display: grid;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  font-size: 0.9rem;
}

.result-label {
  min-width: 80px;
  color: #666;
  font-weight: 500;
}

.result-value {
  color: #333;
  flex: 1;
}

.result-value.passed {
  color: #28a745;
  font-weight: 600;
}

.result-value.failed {
  color: #dc3545;
  font-weight: 600;
}

.card-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background: #fafafa;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  white-space: nowrap;
}

.view-btn {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.view-btn:hover {
  background: rgba(13, 110, 253, 0.2);
}

.reschedule-btn {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.reschedule-btn:hover {
  background: rgba(255, 193, 7, 0.2);
}

.result-btn {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.result-btn:hover {
  background: rgba(40, 167, 69, 0.2);
}

.edit-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
}

.edit-btn:hover {
  background: rgba(248, 180, 0, 0.2);
}

.cancel-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.cancel-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  margin-bottom: 2rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

.modal-content.small {
  max-width: 400px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #adb5bd;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

.modal-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.reschedule-form,
.result-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.required {
  color: #dc3545;
}

.student-info {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  color: #333;
  border: 2px solid #e9ecef;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.radio-item:hover {
  border-color: #f8b400;
  background: rgba(248, 180, 0, 0.05);
}

.radio-item input {
  margin: 0;
}

.radio-label {
  font-weight: 500;
  user-select: none;
}

.radio-label.passed {
  color: #28a745;
}

.radio-label.failed {
  color: #dc3545;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-left {
    justify-content: space-between;
  }
  
  .filter-right {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .interview-list {
    max-width: none;
  }
  
  .filter-left {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }
  
  .filter-select,
  .filter-input {
    min-width: auto;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .card-actions {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .detail-label {
    min-width: auto;
    font-weight: 600;
  }
  
  .result-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .result-label {
    min-width: auto;
    font-weight: 600;
  }
  
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
  
  .form-actions,
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }
  
  .radio-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>
