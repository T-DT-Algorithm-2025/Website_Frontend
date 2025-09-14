<template>
  <div class="interview-booking-container">
    <div class="form-header">
      <h2 class="section-title">
        预约面试 - {{ selectedRecruit?.name || '招聘批次' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回投递列表
      </button>
    </div>

    <!-- 当前简历信息 -->
    <div class="submission-info-card">
      <div class="card-header">
        <h3>📄 投递信息</h3>
        <span class="status-badge status-passed">{{ selectedSubmission?.status_name || '简历通过' }}</span>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item">
            <strong>投递时间：</strong>{{ formatDateTime(selectedSubmission?.submit_time) }}
          </div>
          <div class="info-item">
            <strong>简历ID：</strong>{{ selectedSubmission?.submit_id }}
          </div>
        </div>
      </div>
    </div>

    <!-- 检查预约可用性 -->
    <div v-if="checkingAvailability" class="loading-state">
      <div class="loading-spinner"></div>
      <p>检查面试预约可用性...</p>
    </div>

    <!-- 预约不可用提示 -->
    <div v-else-if="!canBookInterview" class="unavailable-state">
      <div class="alert-card warning">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <h3>暂时无法预约面试</h3>
          <p>{{ unavailableReason }}</p>
        </div>
      </div>
    </div>

    <!-- 面试预约表单 -->
    <div v-else class="booking-content">
      <!-- 预约时间提示 -->
      <div v-if="bookingPeriod" class="booking-period-info">
        <div class="alert-card info">
          <div class="alert-icon">📅</div>
          <div class="alert-content">
            <h3>面试预约时间</h3>
            <p>预约时间：{{ formatDateTime(bookingPeriod.start_time) }} 至 {{ formatDateTime(bookingPeriod.end_time) }}</p>
          </div>
        </div>
      </div>

      <!-- 已预约的面试显示 -->
      <div v-if="existingBookings.length > 0" class="existing-bookings">
        <h3 class="section-subtitle">📋 我的面试安排</h3>
        <div class="bookings-list">
          <div v-for="booking in existingBookings" :key="booking.interview_id" class="booking-card">
            <div class="booking-info">
              <div class="booking-time">
                <strong>面试时间：</strong>{{ formatDateTime(booking.interview_time) }}
              </div>
              <div class="booking-location">
                <strong>面试地点：</strong>{{ booking.location }}
              </div>
              <div class="booking-choice">
                <strong>志愿：</strong>{{ booking.choice }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间段选择 -->
      <div class="time-slots-section">
        <h3 class="section-subtitle">⏰ 选择面试时间</h3>
        
        <!-- 加载时间段 -->
        <div v-if="loadingTimeSlots" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载可用时间段...</p>
        </div>

        <!-- 无可用时间段 -->
        <div v-else-if="availableTimeSlots.length === 0" class="no-slots">
          <div class="alert-card warning">
            <div class="alert-icon">🕐</div>
            <div class="alert-content">
              <h3>暂无可用时间段</h3>
              <p>目前没有可预约的面试时间段，请稍后再试或联系管理员。</p>
            </div>
          </div>
        </div>

        <!-- 时间段列表 -->
        <div v-else class="time-slots-grid">
          <div
            v-for="slot in availableTimeSlots"
            :key="slot.schedule_id"
            class="time-slot-card"
            :class="{ selected: selectedTimeSlot?.schedule_id === slot.schedule_id }"
            @click="selectTimeSlot(slot)"
          >
            <div class="slot-time">
              <div class="time-range">
                {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
              </div>
              <div class="slot-date">
                {{ formatDate(slot.start_time) }}
              </div>
            </div>
            <div class="slot-location">
              <div class="room-name">{{ slot.room_name }}</div>
              <div class="location">{{ slot.location }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 预约按钮 -->
      <div v-if="availableTimeSlots.length > 0" class="booking-actions">
        <button
          @click="confirmBooking"
          class="btn-primary booking-btn"
          :disabled="!selectedTimeSlot || submitting"
        >
          <span v-if="submitting" class="loading-spinner small"></span>
          {{ submitting ? '预约中...' : '确认预约' }}
        </button>
        <p v-if="!selectedTimeSlot" class="hint-text">请先选择一个时间段</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAlert } from '@/composables/useAlert'

const props = defineProps({
  selectedRecruit: {
    type: Object,
    required: true
  },
  selectedSubmission: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'booking-success'])

const { showAlert } = useAlert()

// 响应式数据
const checkingAvailability = ref(true)
const canBookInterview = ref(false)
const unavailableReason = ref('')
const bookingPeriod = ref(null)
const existingBookings = ref([])
const loadingTimeSlots = ref(false)
const availableTimeSlots = ref([])
const selectedTimeSlot = ref(null)
const submitting = ref(false)

// 检查是否可以预约面试
const checkInterviewAvailability = async () => {
  checkingAvailability.value = true
  try {
    const response = await fetch(`/api/interview/available/${props.selectedRecruit.recruit_id}`)
    const result = await response.json()
    
    if (result.success) {
      if (result.data.available) {
        canBookInterview.value = true
        bookingPeriod.value = {
          start_time: result.data.start_time,
          end_time: result.data.end_time
        }
        // 获取现有预约和可用时间段
        await Promise.all([
          fetchExistingBookings(),
          fetchAvailableTimeSlots()
        ])
      } else {
        canBookInterview.value = false
        unavailableReason.value = result.data.reason || '预约条件不满足'
      }
    } else {
      throw new Error(result.error || '检查预约可用性失败')
    }
  } catch (error) {
    console.error('检查面试预约可用性失败:', error)
    canBookInterview.value = false
    unavailableReason.value = '检查预约状态时发生错误，请稍后重试'
    showAlert('检查预约状态失败: ' + error.message, 'error')
  } finally {
    checkingAvailability.value = false
  }
}

// 获取现有预约
const fetchExistingBookings = async () => {
  try {
    const response = await fetch(`/api/interview/my_bookings/${props.selectedRecruit.recruit_id}`)
    const result = await response.json()
    
    if (result.success) {
      existingBookings.value = result.data || []
    } else {
      throw new Error(result.error || '获取现有预约失败')
    }
  } catch (error) {
    console.error('获取现有预约失败:', error)
    showAlert('获取现有预约失败: ' + error.message, 'error')
  }
}

// 获取可用时间段
const fetchAvailableTimeSlots = async () => {
  loadingTimeSlots.value = true
  try {
    const response = await fetch(`/api/interview/schedule/available/${props.selectedSubmission.submit_id}`)
    const result = await response.json()
    
    if (result.success) {
      availableTimeSlots.value = result.data || []
    } else {
      throw new Error(result.error || '获取时间段失败')
    }
  } catch (error) {
    console.error('获取可用时间段失败:', error)
    showAlert('获取可用时间段失败: ' + error.message, 'error')
  } finally {
    loadingTimeSlots.value = false
  }
}

// 选择时间段
const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot
}

// 确认预约
const confirmBooking = async () => {
  if (!selectedTimeSlot.value) {
    showAlert('请先选择一个时间段', 'warning')
    return
  }

  submitting.value = true
  try {
    const response = await fetch('/api/interview/schedule/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schedule_id: selectedTimeSlot.value.schedule_id,
        submit_id: props.selectedSubmission.submit_id
      }),
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试预约成功！', 'success')
      emit('booking-success', {
        interview_id: result.interview_id,
        time_slot: selectedTimeSlot.value
      })
    } else {
      throw new Error(result.error || '预约失败')
    }
  } catch (error) {
    console.error('面试预约失败:', error)
    showAlert('预约失败: ' + error.message, 'error')
  } finally {
    submitting.value = false
  }
}

// 返回
const handleBack = () => {
  emit('back')
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

// 格式化日期
const formatDate = (dateStr) => {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
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

// 组件挂载时检查预约可用性
onMounted(() => {
  checkInterviewAvailability()
})
</script>

<style scoped>
.interview-booking-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
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

.submission-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border-left: 4px solid #28a745;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.card-body {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  font-size: 0.9rem;
  color: #666;
}

.info-item strong {
  color: #333;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
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

.alert-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.alert-card.warning {
  border-left: 4px solid #ffc107;
  background: #fff8e1;
}

.alert-card.info {
  border-left: 4px solid #17a2b8;
  background: #e1f5fe;
}

.alert-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.alert-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.alert-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.booking-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.section-subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8b400;
}

.existing-bookings {
  margin-bottom: 2rem;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card {
  background: #e8f5e8;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 1rem;
}

.booking-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  font-size: 0.9rem;
}

.booking-info > div {
  color: #155724;
}

.booking-info strong {
  color: #0f4229;
}

.time-slots-section {
  margin-bottom: 2rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.time-slot-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-slot-card:hover {
  border-color: #f8b400;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.2);
  transform: translateY(-2px);
}

.time-slot-card.selected {
  border-color: #f8b400;
  background: #fff8e1;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.slot-time {
  flex: 1;
}

.time-range {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.slot-date {
  font-size: 0.9rem;
  color: #666;
}

.slot-location {
  text-align: right;
  flex-shrink: 0;
  margin-left: 1rem;
}

.room-name {
  font-weight: 500;
  color: #f8b400;
  margin-bottom: 0.25rem;
}

.location {
  font-size: 0.8rem;
  color: #666;
}

.booking-actions {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid #dee2e6;
}

.booking-btn {
  padding: 1rem 2rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.booking-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.booking-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.hint-text {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.no-slots {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .section-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .time-slots-grid {
    grid-template-columns: 1fr;
  }
  
  .time-slot-card {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .slot-location {
    text-align: left;
    margin-left: 0;
  }
  
  .booking-info {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .alert-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
