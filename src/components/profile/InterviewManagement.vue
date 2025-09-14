<template>
  <div class="content-section">
    <!-- 面试管理头部 -->
    <div class="interview-management-header">
      <h2 class="section-title">面试管理</h2>
      <div class="header-actions">
        <div class="recruit-selector">
          <select 
            v-model="selectedRecruitId" 
            class="recruit-select"
            @change="handleRecruitChange"
            :disabled="loading.recruits"
          >
            <option value="">选择招聘批次</option>
            <option 
              v-for="recruit in recruitList" 
              :key="recruit.recruit_id" 
              :value="recruit.recruit_id"
            >
              {{ recruit.name }}
            </option>
          </select>
          <div v-if="loading.recruits" class="loading-indicator">
            <div class="loading-spinner small"></div>
            <span>加载中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="management-content" v-if="selectedRecruitId">
      <!-- 标签页导航 -->
      <div class="tab-navigation">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- 标签页内容 -->
      <div class="tab-content">
        <!-- 面试设置 -->
        <div v-if="activeTab === 'settings'" class="tab-panel">
          <InterviewSettings 
            :recruit-id="selectedRecruitId"
            :loading="loading.settings"
            @settings-updated="handleSettingsUpdated"
          />
        </div>

        <!-- 面试地点管理 -->
        <div v-if="activeTab === 'rooms'" class="tab-panel">
          <InterviewRooms 
            :recruit-id="selectedRecruitId"
            :loading="loading.rooms"
            @rooms-updated="handleRoomsUpdated"
          />
        </div>

        <!-- 面试时间段管理 -->
        <div v-if="activeTab === 'schedules'" class="tab-panel">
          <InterviewSchedules 
            :recruit-id="selectedRecruitId"
            :loading="loading.schedules"
            @schedules-updated="handleSchedulesUpdated"
          />
        </div>

        <!-- 面试列表 -->
        <div v-if="activeTab === 'interviews'" class="tab-panel">
          <InterviewList 
            :recruit-id="selectedRecruitId"
            :loading="loading.interviews"
            @interview-updated="handleInterviewUpdated"
          />
        </div>
      </div>
    </div>

    <!-- 未选择招聘批次提示 -->
    <div v-else-if="!loading.recruits" class="no-recruit-selected">
      <div class="empty-state">
        <span class="empty-icon">📋</span>
        <h3>请选择招聘批次</h3>
        <p>选择一个招聘批次后才能开始管理面试相关内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAlert } from '@/composables/useAlert'
import InterviewSettings from './InterviewSettings.vue'
import InterviewRooms from './InterviewRooms.vue'
import InterviewSchedules from './InterviewSchedules.vue'
import InterviewList from './InterviewList.vue'

const { showAlert } = useAlert()

// 响应式数据
const selectedRecruitId = ref('')
const activeTab = ref('settings')
const recruitList = ref([])

const loading = reactive({
  recruits: false,
  settings: false,
  rooms: false,
  schedules: false,
  interviews: false
})

// 标签页配置
const tabs = [
  { key: 'settings', label: '合法时间', icon: '⚙️' },
  { key: 'rooms', label: '面试地点', icon: '🏢' },
  { key: 'schedules', label: '面试时间', icon: '🕐' },
  { key: 'interviews', label: '面试列表', icon: '👥' }
]

// 获取招聘列表
const fetchRecruitList = async () => {
  loading.recruits = true
  try {
    const response = await fetch('/api/recruit/list')
    const result = await response.json()
    
    if (result.success) {
      recruitList.value = result.data || []
    } else {
      throw new Error(result.error || '获取招聘列表失败')
    }
  } catch (error) {
    console.error('获取招聘列表失败:', error)
    showAlert('获取招聘列表失败: ' + error.message, 'error')
  } finally {
    loading.recruits = false
  }
}

// 处理招聘变更
const handleRecruitChange = () => {
  // 切换招聘批次时重置到第一个标签页
  activeTab.value = 'settings'
}

// 子组件事件处理器
const handleSettingsUpdated = () => {
  showAlert('面试设置已更新', 'success')
}

const handleRoomsUpdated = () => {
  showAlert('面试地点已更新', 'success')
}

const handleSchedulesUpdated = () => {
  showAlert('面试时间安排已更新', 'success')
}

const handleInterviewUpdated = () => {
  showAlert('面试信息已更新', 'success')
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

.interview-management-header {
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
  align-items: center;
}

.recruit-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recruit-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  min-width: 200px;
}

.recruit-select:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.recruit-select:disabled {
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
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.management-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.tab-navigation {
  display: flex;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 1rem;
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  min-width: 140px;
}

.tab-button:hover {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
}

.tab-button.active {
  background: white;
  color: #f8b400;
  border-bottom: 3px solid #f8b400;
  font-weight: 600;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  /* 确保在高缩放时能正常滚动 */
  overflow: hidden;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
  /* 确保内容区域填满容器并支持滚动 */
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-recruit-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  margin: 0;
}

/* 高缩放比例优化 */
@media (max-height: 800px), (min-width: 1024px) and (max-height: 1000px) {
  .interview-management-header {
    margin-bottom: 1rem;
  }
  
  .tab-content {
    padding: 1rem;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .interview-management-header {
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
  
  .recruit-select {
    min-width: 150px;
  }
  
  .tab-navigation {
    flex-wrap: wrap;
  }
  
  .tab-button {
    min-width: calc(50% - 0.5rem);
    margin: 0.25rem;
    border-radius: 8px;
  }
  
  .tab-button.active {
    border-bottom: none;
    border: 2px solid #f8b400;
  }
  
  .tab-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .interview-management-header {
    align-items: center;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .recruit-select {
    min-width: 120px;
    font-size: 0.9rem;
  }
  
  .tab-button {
    min-width: 100%;
    margin: 0.25rem 0;
  }
}
</style>
