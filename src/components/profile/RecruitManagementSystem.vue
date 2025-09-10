<template>
  <div class="content-section">
    <!-- 招聘管理头部 -->
    <div class="recruit-management-header">
      <h2 class="section-title">招聘管理</h2>
      <div class="header-actions">
        <button class="action-btn refresh-btn" @click="refreshRecruitList" :disabled="loading">
          <span class="btn-icon">🔄</span>
          刷新列表
        </button>
        <button class="action-btn add-btn" @click="handleAddNew">
          <span class="btn-icon">➕</span>
          新增招聘批次
        </button>
      </div>
    </div>

    <!-- 招聘表单模态框 -->
    <div v-if="showForm" class="modal-overlay" @click="handleModalClick">
      <div class="modal-content" @click.stop>
        <RecruitForm 
          :recruitData="editingRecruit"
          :isEditing="isEditing"
          :isSubmitting="isSubmitting"
          @submit="handleFormSubmit"
          @cancel="handleFormCancel"
        />
      </div>
    </div>

    <!-- 招聘详情模态框 -->
    <div v-if="showDetail" class="modal-overlay" @click="handleDetailModalClick">
      <div class="modal-content" @click.stop>
        <RecruitDetail 
          :recruitData="viewingRecruit"
          :loading="detailLoading"
          @close="handleDetailClose"
          @edit="handleDetailEdit"
        />
      </div>
    </div>

    <!-- 招聘列表 -->
    <RecruitManagement
      :recruitList="recruitList"
      :loading="loading"
      @view-detail="handleViewDetail"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 确认删除对话框 -->
    <div v-if="showDeleteDialog" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-dialog" @click.stop>
        <h3>确认删除</h3>
        <p>确定要删除招聘批次 <strong>"{{ deleteTarget?.name }}"</strong> 吗？</p>
        <p class="warning-text">此操作不可逆，删除后相关的所有投递记录也将被清除。</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="cancelDelete" :disabled="isDeleting">
            取消
          </button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
            <span v-if="isDeleting">删除中...</span>
            <span v-else>确认删除</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authAPI } from '@/api/auth.js'
import RecruitManagement from './RecruitManagement.vue'
import RecruitForm from './RecruitForm.vue'
import RecruitDetail from './RecruitDetail.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

// 数据状态
const recruitList = ref([])
const loading = ref(false)
const showForm = ref(false)
const showDetail = ref(false)
const isEditing = ref(false)
const editingRecruit = ref(null)
const viewingRecruit = ref(null)
const isSubmitting = ref(false)
const detailLoading = ref(false)

// 删除相关状态
const showDeleteDialog = ref(false)
const deleteTarget = ref(null)
const isDeleting = ref(false)

// 获取招聘列表
const fetchRecruitList = async () => {
  loading.value = true
  try {
    const result = await authAPI.getRecruitList()
    if (result.success) {
      recruitList.value = result.data || []
    } else {
      console.error('获取招聘列表失败:', result.error)
      alert('获取招聘列表失败: ' + result.error)
    }
  } catch (error) {
    console.error('获取招聘列表时出错:', error)
    alert('获取招聘列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 刷新招聘列表
const refreshRecruitList = () => {
  fetchRecruitList()
}

// 处理新增招聘
const handleAddNew = () => {
  isEditing.value = false
  editingRecruit.value = null
  showForm.value = true
}

// 处理查看详情
const handleViewDetail = async (recruit) => {
  detailLoading.value = true
  showDetail.value = true
  viewingRecruit.value = null
  
  try {
    const result = await authAPI.getRecruitInfo(recruit.recruit_id)
    if (result.success) {
      viewingRecruit.value = result.data
    } else {
      alert('获取招聘详情失败：' + result.error)
      showDetail.value = false
    }
  } catch (error) {
    console.error('获取招聘详情失败:', error)
    alert('获取招聘详情失败，请稍后重试')
    showDetail.value = false
  } finally {
    detailLoading.value = false
  }
}

// 处理编辑招聘
const handleEdit = (recruit) => {
  isEditing.value = true
  editingRecruit.value = { ...recruit }
  showForm.value = true
}

// 处理删除招聘
const handleDelete = (recruit) => {
  deleteTarget.value = recruit
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!deleteTarget.value) return
  
  isDeleting.value = true
  try {
    const result = await authAPI.deleteRecruit(deleteTarget.value.recruit_id)
    if (result.success) {
      alert('删除成功')
      // 刷新列表
      await fetchRecruitList()
      // 关闭对话框
      showDeleteDialog.value = false
      deleteTarget.value = null
    } else {
      alert('删除失败: ' + result.error)
    }
  } catch (error) {
    console.error('删除招聘时出错:', error)
    alert('删除失败，请稍后重试')
  } finally {
    isDeleting.value = false
  }
}

// 取消删除
const cancelDelete = () => {
  showDeleteDialog.value = false
  deleteTarget.value = null
}

// 处理表单提交
const handleFormSubmit = async (formData) => {
  isSubmitting.value = true
  try {
    let result
    
    if (isEditing.value && editingRecruit.value) {
      // 编辑模式
      result = await authAPI.updateRecruit(editingRecruit.value.recruit_id, formData)
    } else {
      // 新增模式
      result = await authAPI.createRecruit(formData)
    }
    
    if (result.success) {
      alert(isEditing.value ? '更新成功' : '创建成功')
      showForm.value = false
      editingRecruit.value = null
      // 刷新列表
      await fetchRecruitList()
    } else {
      alert((isEditing.value ? '更新' : '创建') + '失败: ' + result.error)
    }
  } catch (error) {
    console.error('提交表单时出错:', error)
    alert('操作失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 处理表单取消
const handleFormCancel = () => {
  showForm.value = false
  editingRecruit.value = null
  isEditing.value = false
}

// 处理表单模态框点击
const handleModalClick = (event) => {
  if (event.target === event.currentTarget) {
    handleFormCancel()
  }
}

// 处理详情模态框点击
const handleDetailModalClick = (event) => {
  if (event.target === event.currentTarget) {
    handleDetailClose()
  }
}

// 处理详情页面关闭
const handleDetailClose = () => {
  showDetail.value = false
  viewingRecruit.value = null
  detailLoading.value = false
}

// 从详情页面跳转到编辑
const handleDetailEdit = (recruit) => {
  // 关闭详情页面
  handleDetailClose()
  // 打开编辑页面
  handleEdit(recruit)
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

// 组件挂载时获取数据
onMounted(() => {
  fetchRecruitList()
})
</script>

<style scoped>
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  position: relative;
}

.recruit-management-header {
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.refresh-btn {
  background: linear-gradient(135deg, #17a2b8 0%, #6c757d 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.add-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  font-size: 1.1rem;
}

/* 模态框样式 */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  animation: modalEnter 0.3s ease-out;
  margin: 2rem;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 删除确认对话框样式 */
.delete-dialog {
  padding: 2rem;
  width: 400px;
  max-width: 90%;
}

.delete-dialog h3 {
  margin: 0 0 1rem 0;
  color: #dc3545;
  font-size: 1.25rem;
}

.delete-dialog p {
  margin: 0 0 0.75rem 0;
  color: #666;
  line-height: 1.5;
}

.warning-text {
  color: #dc3545 !important;
  font-size: 0.9rem;
  background: rgba(220, 53, 69, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #dc3545;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .recruit-management-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .delete-dialog {
    padding: 1.5rem;
    width: 90%;
    max-width: 350px;
  }
  
  .modal-content {
    max-width: 95%;
    max-height: 85%;
    margin: 1rem;
  }
  
  .dialog-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
