<template>
  <div class="my-submissions-container">
    <div class="form-header">
      <h2 class="section-title">
        我的投递 - {{ selectedRecruit?.name || '招聘批次' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回列表
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="userSubmissions.length === 0" class="no-submissions">
      <div class="empty-state">
        <span class="empty-icon">📄</span>
        <h3>暂无投递记录</h3>
        <p>您还没有向此招聘批次投递简历</p>
        <button
          v-if="selectedRecruit?.is_active && selectedRecruit?.available"
          class="action-btn apply-now-btn"
          @click="handleApplyNow"
        >
          立即投递
        </button>
      </div>
    </div>

    <div v-else class="submissions-list">
      <div
        v-for="submission in userSubmissions"
        :key="submission.submit_id"
        class="submission-card"
      >
        <div class="card-header">
          <div class="submission-info">
            <h3 class="submission-title">投递记录 #{{ submission.submit_id }}</h3>
            <div class="submission-meta">
              <span class="submission-time">
                投递时间：{{ formatDate(submission.submit_time) }}
              </span>
              <span class="submission-status" :class="getSubmissionStatusClass(submission.status)">
                {{ submission.status_name }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-content">
          <div class="submission-details">
            <div class="detail-item">
              <strong>投递ID：</strong>{{ submission.submit_id }}
            </div>
            <div class="detail-item">
              <strong>招聘批次：</strong>{{ submission.recruit_id }}
            </div>
            <div class="detail-item">
              <strong>投递时间：</strong>{{ formatDate(submission.submit_time) }}
            </div>
          </div>

          <div class="card-actions">
            <button
              class="action-btn edit-btn"
              @click="editSubmission(submission)"
            >
              修改简历
            </button>
            <button
              class="action-btn view-detail-btn"
              @click="viewSubmissionDetail(submission)"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  userSubmissions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedRecruit: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'apply-now', 'view-submission-detail', 'edit-submission'])

const handleBack = () => {
  emit('back')
}

const handleApplyNow = () => {
  emit('apply-now', props.selectedRecruit)
}

const viewSubmissionDetail = (submission) => {
  emit('view-submission-detail', submission)
}

const editSubmission = (submission) => {
  emit('edit-submission', submission)
}

// 获取投递状态样式类
const getSubmissionStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-pending' // 未处理
    case 1: return 'status-passed' // 通过
    case 2: return 'status-rejected' // 拒绝
    default: return 'status-pending'
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
</script>

<style scoped>
.my-submissions-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8b400;
  flex-shrink: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
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

.no-submissions {
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

.apply-now-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.apply-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  min-height: 0;
}

.submission-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
  flex-shrink: 0;
  min-height: 160px;
}

.submission-card:hover {
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

.submission-info {
  flex: 1;
}

.submission-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submission-time {
  font-size: 0.85rem;
  color: #666;
}

.submission-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.submission-details {
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

.edit-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.edit-btn:hover:not(:disabled) {
  background: rgba(248, 180, 0, 0.2);
  transform: translateY(-1px);
}

.view-detail-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.view-detail-btn:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

/* 滚动条样式 */
.submissions-list::-webkit-scrollbar {
  width: 6px;
}

.submissions-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.submissions-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.submissions-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .submissions-list {
    overflow-y: auto;
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
  .section-title {
    font-size: 1.5rem;
  }
  
  .submission-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .submission-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .submission-details {
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
  
  .no-submissions {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}
</style>
