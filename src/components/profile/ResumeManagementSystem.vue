<template>
  <div class="content-section">
    <!-- 简历管理头部 -->
    <div class="resume-management-header">
      <h2 class="section-title">简历管理</h2>
      <div class="header-actions">
        <button class="action-btn refresh-btn" @click="refreshResumeList" :disabled="loading">
          <span class="btn-icon">🔄</span>
          {{ loading ? '加载中...' : '刷新列表' }}
        </button>
        <button class="action-btn batch-btn" @click="showBatchOperations" :disabled="selectedResumes.length === 0">
          <span class="btn-icon">⚙️</span>
          批量操作 ({{ selectedResumes.length }})
        </button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <div class="filter-group">
        <label>状态筛选:</label>
        <select v-model="statusFilter" @change="applyFilters" class="filter-select">
          <option value="">全部状态</option>
          <option v-for="status in statusNames" :key="status.status_id" :value="status.status_id">
            {{ status.status_name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>招聘批次:</label>
        <select v-model="recruitFilter" @change="applyFilters" class="filter-select">
          <option value="">全部批次</option>
          <option v-for="recruit in recruitList" :key="recruit.recruit_id" :value="recruit.recruit_id">
            {{ recruit.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>第一志愿: </label>
        <select v-model="positionFilter" @change="applyFilters" class="filter-select">
          <option value="">全部志愿</option>
          <option v-for="position in positionList" :key="position" :value="position">
            {{ position }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>搜索:</label>
        <input 
          v-model="searchQuery" 
          @input="applyFilters" 
            placeholder="搜索用户UID或真实姓名..." 
          class="search-input"
        />
      </div>
    </div>

    <!-- 批量操作面板 -->
    <div v-if="showBatchPanel" class="batch-panel">
      <h3>批量操作</h3>
      <div class="batch-actions">
        <div class="batch-action-group">
          <label>批量更新状态:</label>
          <select v-model="batchStatusUpdate" class="batch-select">
            <option value="">选择新状态</option>
            <option v-for="status in statusNames" :key="status.status_id" :value="status.status_id">
              {{ status.status_name }}
            </option>
          </select>
          <button 
            class="batch-btn update-status-btn" 
            @click="executeBatchStatusUpdate" 
            :disabled="!batchStatusUpdate || isBatchProcessing"
          >
            {{ isBatchProcessing ? '处理中...' : '更新状态' }}
          </button>
        </div>
        <div class="batch-action-group">
          <button 
            class="batch-btn delete-btn" 
            @click="showBatchDeleteConfirm" 
            :disabled="isBatchProcessing"
          >
            批量删除
          </button>
          <button class="batch-btn cancel-btn" @click="closeBatchOperations">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 简历详情模态框 -->
    <div v-if="showDetail" class="modal-overlay" @click="handleDetailModalClick">
      <div class="modal-content" @click.stop>
        <ResumeDetail 
          :resumeData="viewingResume"
          :loading="detailLoading"
          :statusNames="statusNames"
          @close="handleDetailClose"
          @status-updated="handleStatusUpdate"
          @add-review="handleAddReview"
        />
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <div v-if="showDeleteDialog" class="modal-overlay" @click="cancelBatchDelete">
      <div class="modal-content delete-dialog" @click.stop>
        <h3>确认批量删除</h3>
        <p>确定要删除选中的 <strong>{{ selectedResumes.length }}</strong> 份简历吗？</p>
        <p class="warning-text">此操作不可逆，删除后无法恢复。</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="cancelBatchDelete" :disabled="isBatchProcessing">
            取消
          </button>
          <button class="btn btn-danger" @click="confirmBatchDelete" :disabled="isBatchProcessing">
            <span v-if="isBatchProcessing">删除中...</span>
            <span v-else>确认删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 简历列表 -->
    <ResumeManagement
      :resumeList="filteredResumes"
      :statusNames="statusNames"
      :recruitList="recruitList"
      :loading="loading"
      :selectedResumes="selectedResumes"
      @view-detail="handleViewDetail"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authAPI } from '@/api/auth.js'
import ResumeManagement from './ResumeManagement.vue'
import ResumeDetail from './ResumeDetail.vue'

import { useAlert } from '@/composables/useAlert'
const { showAlert } = useAlert()

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

// 数据状态
const resumeList = ref([])
const filteredResumes = ref([])
const statusNames = ref([])
const recruitList = ref([])
const positionList = ref([])
const resumeDetails = ref(new Map()) // 存储简历详细信息的映射
const userInfoCache = ref(new Map()) // 存储用户信息的缓存
const loading = ref(false)
const detailLoading = ref(false)
const showDetail = ref(false)
const viewingResume = ref(null)

// 筛选相关
const statusFilter = ref('')
const recruitFilter = ref('')
const positionFilter = ref('')
const searchQuery = ref('')

// 批量操作相关
const selectedResumes = ref([])
const showBatchPanel = ref(false)
const batchStatusUpdate = ref('')
const isBatchProcessing = ref(false)
const showDeleteDialog = ref(false)

// 获取简历列表
const fetchResumeList = async () => {
  loading.value = true
  try {
    const result = await authAPI.getAdminResumeList()
    if (result.success) {
      const resumes = result.data || []
      
      // 先获取用户信息，再获取简历详细信息
      await fetchUserInfos(resumes)
      await fetchResumeDetails(resumes)
      
      resumeList.value = resumes
      applyFilters() // 应用当前筛选
    } else {
      console.error('获取简历列表失败:', result.error)
      showAlert('获取简历列表失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取简历列表时出错:', error)
    showAlert('获取简历列表失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

// 批量获取简历详细信息
const fetchResumeDetails = async (resumes) => {
  if (resumes.length === 0) return
  
  let successCount = 0
  let failCount = 0
  
  // 分批处理，避免并发请求过多
  const batchSize = 10
  for (let i = 0; i < resumes.length; i += batchSize) {
    const batch = resumes.slice(i, i + batchSize)
    const batchPromises = batch.map(async (resume) => {
      try {
        const result = await authAPI.getResumeInfo(resume.submit_id)
        if (result.success && result.data.info) {
          resumeDetails.value.set(resume.submit_id, result.data.info)
          // 将详细信息合并到简历对象中，便于筛选和显示
          Object.assign(resume, {
            first_choice: result.data.info.first_choice,
            second_choice: result.data.info.second_choice
          })
          successCount++
        } else {
          throw new Error(result.error || '获取详细信息失败')
        }
      } catch (error) {
        console.error(`获取简历 ${resume.submit_id} 详细信息失败:`, error)
        failCount++
        // 设置默认值，避免显示错误
        Object.assign(resume, {
          first_choice: null,
          second_choice: null
        })
      }
    })
    
    // 等待当前批次完成后再处理下一批次
    await Promise.all(batchPromises)
  }
  
  // 显示加载结果提示
  if (failCount > 0 && successCount > 0) {
    showAlert(`简历列表加载完成，${successCount}份简历详情加载成功，${failCount}份加载失败`, 'warning')
  } else if (failCount > 0) {
    showAlert(`简历详情加载失败，部分功能可能受限`, 'warning')
  }
}

// 批量获取用户信息
const fetchUserInfos = async (resumes) => {
  if (resumes.length === 0) return
  
  try {
    // 获取所有用户信息
    const result = await authAPI.getAllUsers()
    if (result.success) {
      const users = result.data || []
      
      // 构建用户信息映射
      users.forEach(user => {
        userInfoCache.value.set(user.uid, user)
      })
      
      // 将用户真实姓名合并到简历对象中
      resumes.forEach(resume => {
        const userInfo = userInfoCache.value.get(resume.uid)
        if (userInfo) {
          Object.assign(resume, {
            realname: userInfo.realname,
            display_name: userInfo.realname || userInfo.name || `用户-${resume.uid.slice(-8)}`
          })
        } else {
          Object.assign(resume, {
            realname: null,
            display_name: `用户-${resume.uid.slice(-8)}`
          })
        }
      })
    } else {
      console.error('获取用户信息失败:', result.error)
      // 设置默认显示名
      resumes.forEach(resume => {
        Object.assign(resume, {
          realname: null,
          display_name: `用户-${resume.uid.slice(-8)}`
        })
      })
    }
  } catch (error) {
    console.error('获取用户信息时出错:', error)
    // 设置默认显示名
    resumes.forEach(resume => {
      Object.assign(resume, {
        realname: null,
        display_name: `用户-${resume.uid.slice(-8)}`
      })
    })
  }
}

// 获取状态名称列表
const fetchStatusNames = async () => {
  try {
    const result = await authAPI.getResumeStatusNames()
    if (result.success) {
      statusNames.value = result.data || []
    } else {
      console.error('获取状态列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取状态列表时出错:', error)
  }
}

// 获取招聘列表（用于筛选）
const fetchRecruitList = async () => {
  try {
    const result = await authAPI.getRecruitList()
    if (result.success) {
      recruitList.value = result.data || []
    } else {
      console.error('获取招聘列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取招聘列表时出错:', error)
  }
}

// 获取职位列表（用于筛选）
const fetchPositionList = async () => {
  try {
    const result = await authAPI.getPositions()
    if (result.success) {
      positionList.value = result.data.positions || []
    } else {
      console.error('获取职位列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取职位列表时出错:', error)
  }
}

// 应用筛选
const applyFilters = () => {
  let filtered = [...resumeList.value]
  
  // 按状态筛选
  if (statusFilter.value !== '') {
    filtered = filtered.filter(resume => resume.status === parseInt(statusFilter.value))
  }
  
  // 按招聘批次筛选
  if (recruitFilter.value !== '') {
    filtered = filtered.filter(resume => resume.recruit_id === recruitFilter.value)
  }
  
  // 按第一志愿筛选
  if (positionFilter.value !== '') {
    filtered = filtered.filter(resume => {
      // 只筛选已加载详细信息且有第一志愿的简历
      return resume.first_choice && resume.first_choice === positionFilter.value
    })
  }
  
  // 按搜索条件筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    filtered = filtered.filter(resume => 
      resume.uid?.toLowerCase().includes(query) ||
      resume.realname?.toLowerCase().includes(query) ||
      resume.display_name?.toLowerCase().includes(query)
    )
  }
  
  filteredResumes.value = filtered
}

// 刷新简历列表
const refreshResumeList = () => {
  fetchResumeList()
}

// 处理选择变化
const handleSelectionChange = (selected) => {
  selectedResumes.value = selected
}

// 显示批量操作面板
const showBatchOperations = () => {
  showBatchPanel.value = true
  batchStatusUpdate.value = ''
}

// 关闭批量操作面板
const closeBatchOperations = () => {
  showBatchPanel.value = false
  batchStatusUpdate.value = ''
}

// 执行批量状态更新
const executeBatchStatusUpdate = async () => {
  if (!batchStatusUpdate.value || selectedResumes.value.length === 0) return
  
  isBatchProcessing.value = true
  try {
    const submitIds = selectedResumes.value.map(resume => resume.submit_id)
    const result = await authAPI.batchUpdateResumeStatus(submitIds, parseInt(batchStatusUpdate.value))
    
    if (result.success) {
      showAlert('批量更新状态成功', 'success')
      // 刷新列表
      await fetchResumeList()
      // 清空选择
      selectedResumes.value = []
      closeBatchOperations()
    } else {
      showAlert('批量更新状态失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('批量更新状态时出错:', error)
    showAlert('批量更新状态失败，请稍后重试', 'error')
  } finally {
    isBatchProcessing.value = false
  }
}

// 显示批量删除确认
const showBatchDeleteConfirm = () => {
  showDeleteDialog.value = true
}

// 确认批量删除
const confirmBatchDelete = async () => {
  if (selectedResumes.value.length === 0) return
  
  isBatchProcessing.value = true
  try {
    const submitIds = selectedResumes.value.map(resume => resume.submit_id)
    const result = await authAPI.batchDeleteResumes(submitIds)
    
    if (result.success) {
      showAlert('批量删除成功', 'success')
      // 刷新列表
      await fetchResumeList()
      // 清空选择
      selectedResumes.value = []
      showDeleteDialog.value = false
      closeBatchOperations()
    } else {
      showAlert('批量删除失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('批量删除时出错:', error)
    showAlert('批量删除失败，请稍后重试', 'error')
  } finally {
    isBatchProcessing.value = false
  }
}

// 取消批量删除
const cancelBatchDelete = () => {
  showDeleteDialog.value = false
}

// 处理查看详情
const handleViewDetail = async (resume) => {
  detailLoading.value = true
  showDetail.value = true
  viewingResume.value = null
  
  try {
    const result = await authAPI.getResumeInfo(resume.submit_id)
    if (result.success) {
      viewingResume.value = result.data
    } else {
      showAlert('获取简历详情失败：' + result.error, 'error')
      showDetail.value = false
    }
  } catch (error) {
    console.error('获取简历详情失败:', error)
    showAlert('获取简历详情失败，请稍后重试', 'error')
    showDetail.value = false
  } finally {
    detailLoading.value = false
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
  viewingResume.value = null
  detailLoading.value = false
}

// 处理状态更新
const handleStatusUpdate = async () => {
  // 刷新列表以显示最新状态
  await fetchResumeList()
}

// 处理添加评审
const handleAddReview = async () => {
  // 简历详情组件会处理评审添加
  // 这里可以添加额外的逻辑，比如刷新列表
}

// 获取状态显示名称
const getStatusName = (statusId) => {
  const status = statusNames.value.find(s => s.status_id === statusId)
  return status ? status.status_name : '未知状态'
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
  fetchResumeList()
  fetchStatusNames()
  fetchRecruitList()
  fetchPositionList()
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

.resume-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.batch-btn {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.batch-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  font-size: 1.1rem;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  padding: 1rem;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
}

.filter-select, .search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input {
  min-width: 200px;
}

/* 批量操作面板样式 */
.batch-panel {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.batch-panel h3 {
  margin: 0 0 1rem 0;
  color: #856404;
  font-size: 1.1rem;
}

.batch-actions {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.batch-action-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.batch-action-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #856404;
  white-space: nowrap;
}

.batch-select {
  padding: 0.5rem;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
}

.update-status-btn {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.update-status-btn:hover:not(:disabled) {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.cancel-btn:hover:not(:disabled) {
  background: #5a6268;
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
  .resume-management-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .batch-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
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
