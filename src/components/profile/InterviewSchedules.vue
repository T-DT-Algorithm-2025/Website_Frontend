<template>
  <div class="interview-schedules">
    <div class="schedules-header">
      <h3 class="schedules-title">
        <span class="title-icon">🕐</span>
        面试时间安排
      </h3>
      <p class="schedules-description">
        为面试地点添加具体的时间段安排
      </p>
    </div>

    <!-- 地点选择器 -->
    <div class="room-selector">
      <div class="selector-group">
        <label class="selector-label">选择面试地点:</label>
        <select 
          v-model="selectedRoomId" 
          class="room-select"
          @change="handleRoomChange"
          :disabled="loading.rooms"
        >
          <option value="">请选择面试地点</option>
          <option 
            v-for="room in roomsList" 
            :key="room.room_id" 
            :value="room.room_id"
          >
            {{ room.room_name }} - {{ room.location }} ({{ room.applicable_to_choice }})
          </option>
        </select>
      </div>
      <div class="loading-indicator" v-if="loading.rooms">
        <div class="loading-spinner small"></div>
        <span>加载地点信息...</span>
      </div>
    </div>

    <!-- 选中地点后的内容 -->
    <div v-if="selectedRoomId && selectedRoom" class="schedules-content">
      <!-- 地点信息卡片 -->
      <div class="room-info-card">
        <div class="card-header">
          <h4 class="room-name">{{ selectedRoom.room_name }}</h4>
          <span class="choice-badge">{{ selectedRoom.applicable_to_choice }}</span>
        </div>
        <div class="card-body">
          <p class="room-location">📍 {{ selectedRoom.location }}</p>
        </div>
      </div>

      <!-- 操作工具栏 -->
      <div class="schedules-toolbar">
        <button 
          @click="showAddModal = true"
          class="btn-primary"
          :disabled="loading.schedules"
        >
          <span class="btn-icon">➕</span>
          批量添加时间段
        </button>
        
        <div class="toolbar-info">
          <span class="schedules-count">
            共 {{ schedulesList.length }} 个时间段
            <span v-if="bookedCount > 0" class="booked-info">
              (已预约 {{ bookedCount }} 个)
            </span>
          </span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading.schedules" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载时间安排...</p>
      </div>

      <!-- 时间段列表 -->
      <div v-else-if="schedulesList.length > 0" class="schedules-list">
        <div 
          v-for="schedule in schedulesList" 
          :key="schedule.schedule_id"
          class="schedule-card"
          :class="{ booked: schedule.is_booked }"
        >
          <div class="schedule-info">
            <div class="schedule-time">
              <span class="start-time">{{ formatTime(schedule.start_time) }}</span>
              <span class="time-separator">-</span>
              <span class="end-time">{{ formatTime(schedule.end_time) }}</span>
            </div>
            <div class="schedule-date">
              {{ formatDate(schedule.start_time) }}
            </div>
            <div v-if="schedule.is_booked" class="booked-info">
              <span class="booked-badge">已预约</span>
            </div>
          </div>
          
          <div class="schedule-actions">
            <button 
              v-if="!schedule.is_booked"
              @click="deleteSchedule(schedule)"
              class="action-btn delete-btn"
              title="删除时间段"
            >
              🗑️
            </button>
            <span v-else class="booked-indicator" title="已预约，无法删除">
              🔒
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span class="empty-icon">🕐</span>
        <h3>暂无时间安排</h3>
        <p>为该地点添加面试时间段，学生就可以预约面试了</p>
        <button 
          @click="showAddModal = true"
          class="btn-primary"
        >
          <span class="btn-icon">➕</span>
          添加时间段
        </button>
      </div>
    </div>

    <!-- 未选择地点提示 -->
    <div v-else-if="roomsList.length > 0" class="no-room-selected">
      <div class="empty-state">
        <span class="empty-icon">🏢</span>
        <h3>请选择面试地点</h3>
        <p>选择一个面试地点后才能管理其时间安排</p>
      </div>
    </div>

    <!-- 无地点提示 -->
    <div v-else class="no-rooms-available">
      <div class="empty-state">
        <span class="empty-icon">🏢</span>
        <h3>暂无可用地点</h3>
        <p>请先在"面试地点"标签页中添加面试地点</p>
      </div>
    </div>

    <!-- 添加时间段模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">批量添加面试时间段</h4>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitSchedules" class="schedule-form">
          <div class="form-group">
            <label class="form-label">
              开始时间 <span class="required">*</span>
            </label>
            <input
              v-model="scheduleForm.start_time"
              type="datetime-local"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              结束时间 <span class="required">*</span>
            </label>
            <input
              v-model="scheduleForm.end_time"
              type="datetime-local"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              单次面试时长（分钟） <span class="required">*</span>
            </label>
            <select
              v-model="scheduleForm.duration_minutes"
              class="form-select"
              required
            >
              <option value="">请选择时长</option>
              <option value="15">15分钟</option>
              <option value="20">20分钟</option>
              <option value="30">30分钟</option>
              <option value="45">45分钟</option>
              <option value="60">60分钟</option>
            </select>
            <small class="form-help">
              系统将根据时长自动分割时间段
            </small>
          </div>

          <!-- 预览 -->
          <div v-if="schedulePreview.length > 0" class="schedule-preview">
            <h5 class="preview-title">将生成的时间段预览：</h5>
            <div class="preview-list">
              <div 
                v-for="(preview, index) in schedulePreview" 
                :key="index"
                class="preview-item"
              >
                {{ formatTime(preview.start_time) }} - {{ formatTime(preview.end_time) }}
                <span class="preview-date">({{ formatDate(preview.start_time) }})</span>
              </div>
            </div>
            <p class="preview-summary">
              共将生成 <strong>{{ schedulePreview.length }}</strong> 个时间段
            </p>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary"
              :disabled="submitting"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="submitting || !isFormValid || schedulePreview.length === 0"
            >
              <span v-if="submitting" class="loading-spinner small"></span>
              {{ submitting ? '添加中...' : `添加 ${schedulePreview.length} 个时间段` }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">确认删除</h4>
          <button @click="showDeleteModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <p>确定要删除时间段 
            <strong>{{ scheduleToDelete ? formatTime(scheduleToDelete.start_time) + ' - ' + formatTime(scheduleToDelete.end_time) : '' }}</strong> 
            吗？
          </p>
          <p class="warning-text">⚠️ 删除后无法恢复</p>
        </div>
        
        <div class="modal-actions">
          <button
            @click="showDeleteModal = false"
            class="btn-secondary"
            :disabled="deleting"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="btn-danger"
            :disabled="deleting"
          >
            <span v-if="deleting" class="loading-spinner small"></span>
            {{ deleting ? '删除中...' : '确认删除' }}
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

const emit = defineEmits(['schedules-updated'])

const { showAlert } = useAlert()

// 响应式数据
const loading = reactive({
  rooms: false,
  schedules: false
})
const submitting = ref(false)
const deleting = ref(false)
const roomsList = ref([])
const schedulesList = ref([])
const selectedRoomId = ref('')

// 模态框状态
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const scheduleToDelete = ref(null)

// 表单数据
const scheduleForm = reactive({
  start_time: '',
  end_time: '',
  duration_minutes: ''
})

// 计算属性
const selectedRoom = computed(() => {
  return roomsList.value.find(room => room.room_id === selectedRoomId.value)
})

const isFormValid = computed(() => {
  return scheduleForm.start_time && 
         scheduleForm.end_time && 
         scheduleForm.duration_minutes
})

const bookedCount = computed(() => {
  return schedulesList.value.filter(s => s.is_booked).length
})

const schedulePreview = computed(() => {
  if (!isFormValid.value) return []
  
  const start = new Date(scheduleForm.start_time)
  const end = new Date(scheduleForm.end_time)
  const duration = parseInt(scheduleForm.duration_minutes) * 60 * 1000 // 转换为毫秒
  
  const previews = []
  let current = new Date(start)
  
  while (current < end) {
    const scheduleEnd = new Date(current.getTime() + duration)
    if (scheduleEnd <= end) {
      previews.push({
        start_time: new Date(current),
        end_time: new Date(scheduleEnd)
      })
    }
    current = new Date(scheduleEnd)
  }
  
  return previews
})

// 监听招聘ID变化
watch(() => props.recruitId, (newId) => {
  if (newId) {
    fetchRooms()
    selectedRoomId.value = ''
  }
}, { immediate: true })

// 监听选中房间变化
watch(() => selectedRoomId.value, (newRoomId) => {
  if (newRoomId) {
    fetchSchedules()
  } else {
    schedulesList.value = []
  }
})

// 获取面试地点列表
const fetchRooms = async () => {
  if (!props.recruitId) return
  
  loading.rooms = true
  try {
    const response = await fetch(`/api/admin/interview/room/list/${props.recruitId}`)
    const result = await response.json()
    
    if (result.success) {
      roomsList.value = result.data || []
    } else {
      throw new Error(result.error || '获取面试地点失败')
    }
  } catch (error) {
    console.error('获取面试地点失败:', error)
    showAlert('获取面试地点失败: ' + error.message, 'error')
  } finally {
    loading.rooms = false
  }
}

// 获取时间安排列表
const fetchSchedules = async () => {
  if (!selectedRoomId.value) return
  
  loading.schedules = true
  try {
    const response = await fetch(`/api/admin/interview/schedules/list/${selectedRoomId.value}`)
    const result = await response.json()
    
    if (result.success) {
      schedulesList.value = result.data || []
    } else {
      throw new Error(result.error || '获取时间安排失败')
    }
  } catch (error) {
    console.error('获取时间安排失败:', error)
    showAlert('获取时间安排失败: ' + error.message, 'error')
  } finally {
    loading.schedules = false
  }
}

// 处理房间选择变化
const handleRoomChange = () => {
  schedulesList.value = []
}

// 关闭模态框
const closeModal = () => {
  showAddModal.value = false
  scheduleForm.start_time = ''
  scheduleForm.end_time = ''
  scheduleForm.duration_minutes = ''
}

// 删除时间段
const deleteSchedule = (schedule) => {
  if (schedule.is_booked) {
    showAlert('已预约的时间段无法删除', 'warning')
    return
  }
  
  scheduleToDelete.value = schedule
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!scheduleToDelete.value) return
  
  deleting.value = true
  try {
    const response = await fetch(`/api/admin/interview/schedule/${scheduleToDelete.value.schedule_id}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (result.success) {
      showAlert('时间段已删除', 'success')
      fetchSchedules()
      emit('schedules-updated')
    } else {
      throw new Error(result.error || '删除失败')
    }
  } catch (error) {
    console.error('删除时间段失败:', error)
    showAlert('删除失败: ' + error.message, 'error')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
    scheduleToDelete.value = null
  }
}

// 提交时间安排
const submitSchedules = async () => {
  if (!isFormValid.value || schedulePreview.value.length === 0) {
    showAlert('请填写所有必填字段', 'warning')
    return
  }

  submitting.value = true
  try {
    const response = await fetch(`/api/admin/interview/schedules/add/${selectedRoomId.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_time: formatDateTimeForBackend(scheduleForm.start_time),
        end_time: formatDateTimeForBackend(scheduleForm.end_time),
        duration_minutes: parseInt(scheduleForm.duration_minutes)
      }),
    })

    const result = await response.json()

    if (result.success) {
      showAlert(`成功添加 ${schedulePreview.value.length} 个时间段`, 'success')
      fetchSchedules()
      emit('schedules-updated')
      closeModal()
    } else {
      throw new Error(result.error || '添加失败')
    }
  } catch (error) {
    console.error('添加时间安排失败:', error)
    showAlert('添加失败: ' + error.message, 'error')
  } finally {
    submitting.value = false
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

// 格式化日期
const formatDate = (dateStr) => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    }).format(new Date(dateStr))
  } catch (error) {
    return dateStr
  }
}

// 格式化时间
const formatTime = (dateStr) => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr))
  } catch (error) {
    return dateStr
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (props.recruitId) {
    fetchRooms()
  }
})
</script>

<style scoped>
.interview-schedules {
  max-width: 1200px;
}

.schedules-header {
  margin-bottom: 2rem;
  text-align: center;
}

.schedules-title {
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

.schedules-description {
  color: #666;
  margin: 0;
}

.room-selector {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.selector-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
}

.room-select {
  flex: 1;
  max-width: 600px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.room-select:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.room-select:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
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

.schedules-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.room-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-name {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.choice-badge {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.card-body {
  padding: 1.5rem;
}

.room-location {
  color: #666;
  margin: 0;
}

.schedules-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.schedules-count {
  color: #666;
  font-size: 0.9rem;
}

.booked-info {
  color: #f8b400;
  font-weight: 500;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.btn-icon {
  font-size: 1rem;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.schedules-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.schedule-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.schedule-card.booked {
  border-left-color: #ffc107;
  background: #fffef0;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.schedule-info {
  flex: 1;
}

.schedule-time {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.start-time,
.end-time {
  color: #f8b400;
}

.time-separator {
  color: #666;
  margin: 0 0.25rem;
}

.schedule-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.booked-badge {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.schedule-actions {
  flex-shrink: 0;
  margin-left: 1rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.action-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}

.booked-indicator {
  color: #ffc107;
  font-size: 1rem;
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.no-room-selected,
.no-rooms-available {
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

.schedule-form {
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

.form-input,
.form-select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-help {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.schedule-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.preview-title {
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.preview-list {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 0.75rem;
}

.preview-item {
  background: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border-left: 3px solid #f8b400;
}

.preview-date {
  color: #666;
  font-size: 0.8rem;
}

.preview-summary {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
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
@media (max-width: 768px) {
  .interview-schedules {
    max-width: none;
  }
  
  .room-selector {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .selector-group {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .selector-label {
    min-width: auto;
  }
  
  .room-select {
    max-width: none;
  }
  
  .schedules-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .schedules-list {
    grid-template-columns: 1fr;
  }
  
  .schedule-card {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .schedule-actions {
    margin-left: 0;
    align-self: center;
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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
  
  .preview-list {
    grid-template-columns: 1fr;
  }
}
</style>
