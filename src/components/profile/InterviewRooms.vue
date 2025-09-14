<template>
  <div class="interview-rooms">
    <div class="rooms-header">
      <h3 class="rooms-title">
        <span class="title-icon">🏢</span>
        面试地点管理
      </h3>
      <p class="rooms-description">
        添加和管理面试地点信息
      </p>
    </div>

    <!-- 操作栏 -->
    <div class="rooms-toolbar">
      <button 
        @click="showAddModal = true"
        class="btn-primary"
        :disabled="loading"
      >
        <span class="btn-icon">➕</span>
        添加地点
      </button>
      
      <div class="toolbar-info">
        <span class="rooms-count">共 {{ roomsList.length }} 个地点</span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载面试地点...</p>
    </div>

    <!-- 地点列表 -->
    <div v-else-if="roomsList.length > 0" class="rooms-list">
      <div 
        v-for="room in roomsList" 
        :key="room.room_id"
        class="room-card"
      >
        <div class="room-header">
          <div class="room-info">
            <h4 class="room-name">{{ room.room_name }}</h4>
            <p class="room-location">{{ room.location }}</p>
          </div>
          <div class="room-choice">
            <span class="choice-badge">{{ room.applicable_to_choice }}</span>
          </div>
        </div>
        
        <div class="room-actions">
          <button 
            @click="editRoom(room)"
            class="action-btn edit-btn"
          >
            ✏️ 编辑
          </button>
          <button 
            @click="deleteRoom(room)"
            class="action-btn delete-btn"
            :disabled="room.has_schedules"
          >
            🗑️ 删除
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <span class="empty-icon">🏢</span>
      <h3>暂无面试地点</h3>
      <p>请先添加面试地点，然后为地点安排具体的面试时间段</p>
      <button 
        @click="showAddModal = true"
        class="btn-primary"
      >
        <span class="btn-icon">➕</span>
        添加第一个地点
      </button>
    </div>

    <!-- 添加/编辑地点模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">
            {{ showAddModal ? '添加面试地点' : '编辑面试地点' }}
          </h4>
          <button @click="closeModals" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitRoom" class="room-form">
          <div class="form-group">
            <label class="form-label" for="room-name">
              地点名称 <span class="required">*</span>
            </label>
            <input
              id="room-name"
              v-model="roomForm.room_name"
              type="text"
              class="form-input"
              placeholder="例如：会议室A"
              required
              maxlength="50"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="room-location">
              具体位置 <span class="required">*</span>
            </label>
            <input
              id="room-location"
              v-model="roomForm.location"
              type="text"
              class="form-input"
              placeholder="例如：学生活动中心301"
              required
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="room-choice">
              适用志愿 <span class="required">*</span>
            </label>
            <select
              id="room-choice"
              v-model="roomForm.applicable_to_choice"
              class="form-select"
              required
            >
              <option value="">请选择适用的志愿</option>
              <option 
                v-for="position in availablePositions" 
                :key="position"
                :value="position"
              >
                {{ position }}
              </option>
            </select>
            <small class="form-help">
              此地点将用于面试选择了该志愿的学生
            </small>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closeModals"
              class="btn-secondary"
              :disabled="submitting"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="submitting || !isFormValid"
            >
              <span v-if="submitting" class="loading-spinner small"></span>
              {{ submitting ? '保存中...' : (showAddModal ? '添加' : '更新') }}
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
          <p>确定要删除面试地点 <strong>{{ roomToDelete?.room_name }}</strong> 吗？</p>
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

const emit = defineEmits(['rooms-updated'])

const { showAlert } = useAlert()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const roomsList = ref([])
const availablePositions = ref(['算法组', '电控组', '机械组', '运营组'])

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const roomToDelete = ref(null)
const editingRoom = ref(null)

// 表单数据
const roomForm = reactive({
  room_name: '',
  location: '',
  applicable_to_choice: ''
})

// 计算属性
const isFormValid = computed(() => {
  return roomForm.room_name.trim() && 
         roomForm.location.trim() && 
         roomForm.applicable_to_choice
})

// 监听招聘ID变化
watch(() => props.recruitId, (newId) => {
  if (newId) {
    fetchRooms()
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

// 获取面试地点列表
const fetchRooms = async () => {
  if (!props.recruitId) return
  
  loading.value = true
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
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  roomForm.room_name = ''
  roomForm.location = ''
  roomForm.applicable_to_choice = ''
  editingRoom.value = null
}

// 关闭所有模态框
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

// 编辑地点
const editRoom = (room) => {
  editingRoom.value = room
  roomForm.room_name = room.room_name
  roomForm.location = room.location
  roomForm.applicable_to_choice = room.applicable_to_choice
  showEditModal.value = true
}

// 删除地点
const deleteRoom = (room) => {
  if (room.has_schedules) {
    showAlert('该地点已有时间安排，无法删除', 'warning')
    return
  }
  
  roomToDelete.value = room
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!roomToDelete.value) return
  
  deleting.value = true
  try {
    const response = await fetch(`/api/admin/interview/room/${roomToDelete.value.room_id}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试地点已删除', 'success')
      fetchRooms()
      emit('rooms-updated')
    } else {
      throw new Error(result.error || '删除失败')
    }
  } catch (error) {
    console.error('删除面试地点失败:', error)
    showAlert('删除失败: ' + error.message, 'error')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
    roomToDelete.value = null
  }
}

// 提交表单
const submitRoom = async () => {
  if (!isFormValid.value) {
    showAlert('请填写所有必填字段', 'warning')
    return
  }

  submitting.value = true
  try {
    let response
    const requestData = {
      recruit_id: props.recruitId,
      room_name: roomForm.room_name.trim(),
      location: roomForm.location.trim(),
      applicable_to_choice: roomForm.applicable_to_choice
    }

    if (showAddModal.value) {
      // 添加地点
      response = await fetch('/api/admin/interview/room/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
    } else {
      // 编辑地点
      response = await fetch(`/api/admin/interview/room/${editingRoom.value.room_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
    }

    const result = await response.json()

    if (result.success) {
      showAlert(showAddModal.value ? '面试地点已添加' : '面试地点已更新', 'success')
      fetchRooms()
      emit('rooms-updated')
      closeModals()
    } else {
      throw new Error(result.error || '操作失败')
    }
  } catch (error) {
    console.error('保存面试地点失败:', error)
    showAlert('保存失败: ' + error.message, 'error')
  } finally {
    submitting.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (props.recruitId) {
    fetchRooms()
    fetchPositions()
  }
})
</script>

<style scoped>
.interview-rooms {
  max-width: 1000px;
}

.rooms-header {
  margin-bottom: 2rem;
  text-align: center;
}

.rooms-title {
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

.rooms-description {
  color: #666;
  margin: 0;
}

.rooms-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rooms-count {
  color: #666;
  font-size: 0.9rem;
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

.rooms-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.room-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #f8b400;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.room-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.room-info {
  flex: 1;
}

.room-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.room-location {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.room-choice {
  flex-shrink: 0;
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

.room-actions {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.edit-btn {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.edit-btn:hover {
  background: rgba(13, 110, 253, 0.2);
}

.delete-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.delete-btn:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.2);
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  max-width: 500px;
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

.room-form {
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
  .interview-rooms {
    max-width: none;
  }
  
  .rooms-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .rooms-list {
    grid-template-columns: 1fr;
  }
  
  .room-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .room-actions {
    justify-content: center;
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
}
</style>
