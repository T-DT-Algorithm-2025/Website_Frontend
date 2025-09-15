<template>
  <div class="interview-list">


    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-left">
        <div class="filter-group">
          <label class="filter-label">🔍 姓名搜索:</label>
          <input 
            v-model="filters.name" 
            type="text" 
            class="filter-input name-search-input"
            placeholder="请输入面试者姓名..."
            @input="applyFilters"
          />
        </div>
        
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
    <!-- <div class="stats-cards">
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
    </div> -->

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载面试列表...</p>
    </div>

    <!-- 面试列表 -->
    <div v-else-if="filteredInterviews.length > 0" class="interviews-list-container">
      <div class="interviews-list">
        <div 
          v-for="interview in filteredInterviews" 
          :key="interview.interview_id"
          class="interview-card"
          :class="getInterviewStatusClass(interview)"
        >
        <div class="card-header">
          <div class="interview-info">
            <div class="interviewee-name-section">
              <span class="name-label">👤 面试者</span>
              <h3 class="interviewee-name">{{ interview.interviewee_name || '未知姓名' }}</h3>
            </div>
            <p class="interview-choice">🎯 {{ interview.first_choice || '未知志愿' }}</p>
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
          
          <button 
            @click="deleteInterview(interview)"
            class="action-btn delete-btn"
            title="删除面试"
          >
            🗑️ 删除
          </button>
        </div>
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
              <strong>{{ rescheduleForm.interviewee_name }}</strong> - {{ rescheduleForm.first_choice }}
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
              <strong>{{ resultForm.interviewee_name }}</strong> - {{ resultForm.first_choice }}
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
          <p>确定要取消 <strong>{{ interviewToCancel?.interviewee_name }}</strong> 的面试吗？</p>
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

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">⚠️ 确认删除面试</h4>
          <button @click="showDeleteModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">🚨</div>
            <div class="warning-content">
              <p class="warning-title">您即将删除以下面试记录：</p>
              <div class="interview-details-preview">
                <strong>{{ interviewToDelete?.interviewee_name }}</strong>
                <span class="separator">-</span>
                <span>{{ interviewToDelete?.first_choice }}</span>
              </div>
              <div class="time-info">
                📅 {{ formatDateTime(interviewToDelete?.interview_time) }}
              </div>
              <div class="location-info">
                📍 {{ interviewToDelete?.location }}
              </div>
            </div>
          </div>
          
          <div class="delete-consequences">
            <h5 class="consequences-title">删除后果：</h5>
            <ul class="consequences-list">
              <li>面试记录将被永久删除</li>
              <li>学生无法查看此面试安排</li>
              <li>此操作不可撤销</li>
            </ul>
          </div>
          
          <div class="confirmation-input">
            <label class="confirm-label">
              请输入 <strong>"确认删除"</strong> 以继续：
            </label>
            <input 
              v-model="deleteConfirmationText"
              type="text"
              class="confirm-input"
              placeholder="请输入“确认删除”"
              @keyup.enter="confirmDelete"
            />
          </div>
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
            :disabled="deleting || deleteConfirmationText !== '确认删除'"
          >
            <span v-if="deleting" class="loading-spinner small"></span>
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 简历查看模态框 -->
    <div v-if="showResumeModal" class="modal-overlay" @click="closeResumeModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">📄 简历详情</h4>
          <button @click="closeResumeModal" class="close-btn">✕</button>
        </div>
        
        <div v-if="resumeLoading" class="modal-body">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载简历信息...</p>
          </div>
        </div>
        
        <div v-else-if="resumeData" class="resume-content">
          <div class="resume-header">
            <div class="resume-basic-info">
              <h3>{{ userInfo?.realname || currentInterview?.interviewee_name || '未知' }}</h3>
              
              <!-- 用户基本信息 -->  
              <div class="user-basic-info" v-if="userInfo">
                <div class="user-info-grid">
                  <div class="user-info-item" v-if="userInfo.student_id">
                    <span class="info-label">🎓 学号:</span>
                    <span class="info-value">{{ userInfo.student_id }}</span>
                  </div>
                  <div class="user-info-item" v-if="userInfo.department">
                    <span class="info-label">🏫 学院:</span>
                    <span class="info-value">{{ userInfo.department }}</span>
                  </div>
                  <div class="user-info-item" v-if="userInfo.major">
                    <span class="info-label">📚 专业:</span>
                    <span class="info-value">{{ userInfo.major }}</span>
                  </div>
                  <div class="user-info-item" v-if="userInfo.grade">
                    <span class="info-label">📅 年级:</span>
                    <span class="info-value">{{ userInfo.grade }}</span>
                  </div>
                  <div class="user-info-item" v-if="userInfo.phone_number">
                    <span class="info-label">📞 手机:</span>
                    <span class="info-value">{{ userInfo.phone_number }}</span>
                  </div>
                  <div class="user-info-item" v-if="userInfo.mail">
                    <span class="info-label">✉️ 邮箱:</span>
                    <span class="info-value">{{ userInfo.mail }}</span>
                  </div>
                </div>
              </div>
              
              <div class="resume-meta">
                <span class="meta-item">
                  📅 提交时间: {{ formatDateTime(resumeData.submission?.submit_time) }}
                </span>
                <span class="meta-item">
                  📊 状态: <span class="status-text" :class="getResumeStatusClass(resumeData.submission?.status)">
                    {{ resumeData.submission?.status_name }}
                  </span>
                </span>
              </div>
            </div>
            <div class="resume-photo" v-if="resumePhotoUrl">
              <img :src="resumePhotoUrl" alt="正面照" class="photo-img" />
            </div>
          </div>

          <div class="resume-body">
            <div class="resume-section">
              <h4 class="section-title">🎯 志愿选择</h4>
              <div class="choice-info">
                <div class="choice-item primary">
                  <span class="choice-label">第一志愿:</span>
                  <span class="choice-value">{{ resumeData.info?.first_choice || '未填写' }}</span>
                </div>
                <div class="choice-item secondary" v-if="resumeData.info?.second_choice">
                  <span class="choice-label">第二志愿:</span>
                  <span class="choice-value">{{ resumeData.info?.second_choice }}</span>
                </div>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.grade_point || resumeData.info?.grade_rank || userInfo?.rank">
              <h4 class="section-title">📚 学业情况</h4>
              <div class="grade-info">
                <div class="grade-item" v-if="resumeData.info?.grade_point">
                  <span class="grade-label">绩点:</span>
                  <span class="grade-value">{{ resumeData.info.grade_point }}</span>
                </div>
                <div class="grade-item" v-if="resumeData.info?.grade_rank">
                  <span class="grade-label">简历排名:</span>
                  <span class="grade-value">{{ resumeData.info.grade_rank }}</span>
                </div>
                <div class="grade-item" v-if="userInfo?.rank">
                  <span class="grade-label">学历:</span>
                  <span class="grade-value">{{ userInfo.rank }}</span>
                </div>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.self_intro">
              <h4 class="section-title">👋 自我介绍</h4>
              <div class="section-content">
                <p>{{ resumeData.info.self_intro }}</p>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.skills">
              <h4 class="section-title">🛠️ 技能专长</h4>
              <div class="section-content">
                <p>{{ resumeData.info.skills }}</p>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.projects">
              <h4 class="section-title">💼 项目经历</h4>
              <div class="section-content">
                <p>{{ resumeData.info.projects }}</p>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.awards">
              <h4 class="section-title">🏆 获奖经历</h4>
              <div class="section-content">
                <p>{{ resumeData.info.awards }}</p>
              </div>
            </div>

            <div class="resume-section" v-if="resumeData.info?.additional_file_name">
              <h4 class="section-title">📎 附加文件</h4>
              <div class="section-content">
                <div class="file-info">
                  <span class="file-name">{{ resumeData.info.additional_file_name }}</span>
                  <button 
                    @click="downloadResumeFile(resumeData.info.submit_id)"
                    class="btn-primary small"
                    :disabled="downloadingFile"
                  >
                    <span v-if="downloadingFile" class="loading-spinner small"></span>
                    {{ downloadingFile ? '下载中...' : '📥 下载' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 简历评审区域 -->
            <div class="resume-section review-section">
              <h4 class="section-title">📝 简历评审</h4>
              
              <!-- 添加评审 -->
              <div class="add-review-form">
                <h5>添加评审意见</h5>
                <div class="review-form-grid">
                  <div class="form-group">
                    <label>评分 (1-100):</label>
                    <input 
                      type="number" 
                      v-model="newReview.score" 
                      min="1" 
                      max="100" 
                      class="score-input"
                    />
                  </div>
                  <div class="form-group">
                    <label>是否通过:</label>
                    <select v-model="newReview.passed" class="passed-select">
                      <option :value="true">通过</option>
                      <option :value="false">不通过</option>
                    </select>
                  </div>
                </div>
                <div class="form-group full-width">
                  <label>评审意见:</label>
                  <textarea 
                    v-model="newReview.comments" 
                    rows="3" 
                    placeholder="请输入评审意见..."
                    class="comments-textarea"
                  ></textarea>
                </div>
                <button 
                  class="add-review-btn" 
                  @click="addReview"
                  :disabled="!canAddReview || isAddingReview"
                >
                  {{ isAddingReview ? '提交中...' : '提交评审' }}
                </button>
              </div>

              <!-- 评审记录列表 -->
              <div class="reviews-list-container">
                <h5>历史评审记录</h5>
                <div v-if="isLoadingReviews" class="loading-container small">
                  <div class="loading-spinner small"></div>
                  <p>加载评审记录...</p>
                </div>
                <div v-else-if="reviews.length > 0" class="reviews-list">
                  <div 
                    v-for="review in reviews" 
                    :key="review.review_id"
                    class="review-item"
                  >
                    <div class="review-header">
                      <div class="review-meta">
                        <span class="review-score">评分: {{ review.score }}</span>
                        <span class="review-result" :class="{ passed: review.passed, rejected: !review.passed }">
                          {{ review.passed ? '通过' : '不通过' }}
                        </span>
                        <span class="review-time">{{ formatDateTime(review.review_time) }}</span>
                      </div>
                      <button 
                        class="delete-review-btn" 
                        @click="deleteReview(review.review_id)"
                        :disabled="isDeletingReview"
                        title="删除评审"
                      >
                        🗑️
                      </button>
                    </div>
                    <div class="review-content">
                      {{ review.comments }}
                    </div>
                  </div>
                </div>
                <div v-else class="no-reviews">
                  <p>暂无评审记录</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="modal-body">
          <div class="error-message">
            <span class="error-icon">❌</span>
            <p>加载简历信息失败</p>
            <button @click="loadResumeData(currentInterview?.submit_id)" class="btn-primary small">
              重试
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAlert } from '@/composables/useAlert'
import { authAPI } from '@/api/auth.js'

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
  name: '',
  status: '',
  choice: '',
  date: ''
})

// 模态框状态
const showRescheduleModal = ref(false)
const showResultModal = ref(false)
const showCancelModal = ref(false)
const showDeleteModal = ref(false)
const showResumeModal = ref(false)
const editingResult = ref(false)
const interviewToCancel = ref(null)
const interviewToDelete = ref(null)
const currentInterview = ref(null)

// 提交状态
const rescheduleSubmitting = ref(false)
const resultSubmitting = ref(false)
const cancelling = ref(false)
const deleting = ref(false)
const resumeLoading = ref(false)
const downloadingFile = ref(false)

// 表单数据
const rescheduleForm = reactive({
  interview_id: '',
  interviewee_name: '',
  first_choice: '',
  interview_time: '',
  location: '',
  notes: ''
})

const resultForm = reactive({
  interview_id: '',
  interviewee_name: '',
  first_choice: '',
  passed: null,
  score: null,
  comments: ''
})

// 简历数据
const resumeData = ref(null)
const resumePhotoUrl = ref('')
const userInfo = ref(null)
const deleteConfirmationText = ref('')

// 评审相关数据
const reviews = ref([])
const newReview = ref({
  score: 80,
  passed: true,
  comments: ''
})
const isLoadingReviews = ref(false)
const isAddingReview = ref(false)
const isDeletingReview = ref(false)

// 计算属性
const hasActiveFilters = computed(() => {
  return filters.name || filters.status || filters.choice || filters.date
})

// 是否可以添加评审
const canAddReview = computed(() => {
  return newReview.value.score >= 1 && 
         newReview.value.score <= 100 && 
         newReview.value.comments.trim().length > 0
})

const filteredInterviews = computed(() => {
  let filtered = [...interviewsList.value]
  
  // 姓名模糊搜索
  if (filters.name) {
    const nameQuery = filters.name.toLowerCase().trim()
    filtered = filtered.filter(interview => {
      const intervieweeName = (interview.interviewee_name || '').toLowerCase()
      return intervieweeName.includes(nameQuery)
    })
  }
  
  if (filters.status) {
    filtered = filtered.filter(interview => interview.status === filters.status)
  }
  
  if (filters.choice) {
    filtered = filtered.filter(interview => interview.first_choice === filters.choice)
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
  filters.name = ''
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
  if (!interview.submit_id) {
    showAlert('未找到简历信息', 'error')
    return
  }
  
  currentInterview.value = interview
  showResumeModal.value = true
  loadResumeData(interview.submit_id)
}

// 加载简历数据
const loadResumeData = async (submitId) => {
  if (!submitId) return
  
  resumeLoading.value = true
  resumeData.value = null
  resumePhotoUrl.value = ''
  userInfo.value = null
  
  try {
    // 获取简历详情
    const response = await fetch(`/api/resume/info/${submitId}`)
    const result = await response.json()
    
    if (result.success) {
      resumeData.value = result
      
      // 同时获取用户详细信息
      if (result.submission?.uid) {
        await loadUserInfo(result.submission.uid)
      }
      
      // 加载简历照片
      loadResumePhoto(submitId)
      
      // 获取评审记录
      await fetchReviews(submitId)
    } else {
      throw new Error(result.error || '获取简历信息失败')
    }
  } catch (error) {
    console.error('获取简历信息失败:', error)
    showAlert('获取简历信息失败: ' + error.message, 'error')
  } finally {
    resumeLoading.value = false
  }
}

// 获取用户详细信息
const loadUserInfo = async (uid) => {
  if (!uid) return
  
  try {
    const response = await fetch(`/api/admin/user/info/get/${uid}`)
    const result = await response.json()
    
    if (result.success) {
      userInfo.value = result.data
    } else {
      console.warn('获取用户信息失败:', result.error)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 加载简历照片
const loadResumePhoto = async (submitId) => {
  try {
    const response = await fetch(`/api/resume/real_head_img/${submitId}`)
    if (response.ok) {
      const blob = await response.blob()
      resumePhotoUrl.value = URL.createObjectURL(blob)
    }
  } catch (error) {
    console.error('加载简历照片失败:', error)
  }
}

// 关闭简历模态框
const closeResumeModal = () => {
  showResumeModal.value = false
  currentInterview.value = null
  resumeData.value = null
  userInfo.value = null
  
  // 清理评审数据
  reviews.value = []
  newReview.value = {
    score: 80,
    passed: true,
    comments: ''
  }
  
  // 清理照片URL以释放内存
  if (resumePhotoUrl.value) {
    URL.revokeObjectURL(resumePhotoUrl.value)
    resumePhotoUrl.value = ''
  }
}

// 下载简历文件
const downloadResumeFile = async (submitId) => {
  if (!submitId) return
  
  downloadingFile.value = true
  try {
    const response = await fetch(`/api/resume/download/${submitId}`)
    
    if (response.ok) {
      const blob = await response.blob()
      const filename = resumeData.value?.info?.additional_file_name || '简历附件'
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      
      // 清理资源
      window.URL.revokeObjectURL(url)
      showAlert('文件下载成功', 'success')
    } else {
      const result = await response.json()
      throw new Error(result.error || '下载失败')
    }
  } catch (error) {
    console.error('下载文件失败:', error)
    showAlert('下载失败: ' + error.message, 'error')
  } finally {
    downloadingFile.value = false
  }
}

// 获取简历状态样式
const getResumeStatusClass = (status) => {
  switch (status) {
    case 0:
      return 'status-pending'
    case 1:
      return 'status-passed'
    case 2:
      return 'status-rejected'
    default:
      return 'status-default'
  }
}

// 获取评审记录
const fetchReviews = async (submitId) => {
  if (!submitId) return
  
  isLoadingReviews.value = true
  try {
    const result = await authAPI.getResumeReviews(submitId)
    if (result.success) {
      reviews.value = result.data || []
    } else {
      console.error('获取评审记录失败:', result.error)
      reviews.value = []
    }
  } catch (error) {
    console.error('获取评审记录时出错:', error)
    reviews.value = []
  } finally {
    isLoadingReviews.value = false
  }
}

// 添加评审意见
const addReview = async () => {
  if (!canAddReview.value || !resumeData.value?.submission?.submit_id) return
  
  isAddingReview.value = true
  try {
    const result = await authAPI.addResumeReview(
      resumeData.value.submission.submit_id,
      {
        score: newReview.value.score,
        passed: newReview.value.passed,
        comments: newReview.value.comments
      }
    )
    
    if (result.success) {
      showAlert('评审提交成功', 'success')
      // 重新获取评审记录
      await fetchReviews(resumeData.value.submission.submit_id)
      // 重置表单
      newReview.value = {
        score: 80,
        passed: true,
        comments: ''
      }
    } else {
      showAlert('评审提交失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('添加评审时出错:', error)
    showAlert('评审提交失败，请稍后重试', 'error')
  } finally {
    isAddingReview.value = false
  }
}

// 删除评审
const deleteReview = async (reviewId) => {
  isDeletingReview.value = true
  try {
    const result = await authAPI.deleteResumeReview(reviewId)
    
    if (result.success) {
      showAlert('评审删除成功', 'success')
      // 重新获取评审记录
      if (resumeData.value?.submission?.submit_id) {
        await fetchReviews(resumeData.value.submission.submit_id)
      }
    } else {
      showAlert('评审删除失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('删除评审时出错:', error)
    showAlert('评审删除失败，请稍后重试', 'error')
  } finally {
    isDeletingReview.value = false
  }
}

// 重新安排面试
const rescheduleInterview = (interview) => {
  rescheduleForm.interview_id = interview.interview_id
  rescheduleForm.interviewee_name = interview.interviewee_name
  rescheduleForm.first_choice = interview.first_choice
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
  resultForm.interviewee_name = interview.interviewee_name
  resultForm.first_choice = interview.first_choice
  resultForm.passed = null
  resultForm.score = null
  resultForm.comments = ''
  
  showResultModal.value = true
}

// 修改结果
const editResult = (interview) => {
  editingResult.value = true
  resultForm.interview_id = interview.interview_id
  resultForm.interviewee_name = interview.interviewee_name
  resultForm.first_choice = interview.first_choice
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

// 删除面试
const deleteInterview = (interview) => {
  interviewToDelete.value = interview
  deleteConfirmationText.value = ''
  showDeleteModal.value = true
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

// 确认删除
const confirmDelete = async () => {
  if (!interviewToDelete.value || deleteConfirmationText.value !== '确认删除') {
    showAlert('请输入“确认删除”以继续', 'warning')
    return
  }
  
  deleting.value = true
  try {
    const response = await fetch(`/api/admin/interview/${interviewToDelete.value.interview_id}/cancel`, {
      method: 'POST'
    })

    const result = await response.json()

    if (result.success) {
      showAlert('面试记录已删除', 'success')
      fetchInterviews()
      emit('interview-updated')
    } else {
      throw new Error(result.error || '删除失败')
    }
  } catch (error) {
    console.error('删除面试失败:', error)
    showAlert('删除失败: ' + error.message, 'error')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
    interviewToDelete.value = null
    deleteConfirmationText.value = ''
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

// 组件销毁时清理资源
onBeforeUnmount(() => {
  if (resumePhotoUrl.value) {
    URL.revokeObjectURL(resumePhotoUrl.value)
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

/* 姓名搜索输入框特殊样式 */
.name-search-input {
  min-width: 200px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #dee2e6;
  transition: all 0.3s ease;
  position: relative;
}

.name-search-input:focus {
  background: white;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.name-search-input:hover:not(:focus) {
  border-color: #adb5bd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.name-search-input::placeholder {
  color: #6c757d;
  font-style: italic;
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

/* 面试列表容器 */
.interviews-list-container {
  position: relative;
  max-height: 70vh;
  min-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: #fafafa;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(248, 180, 0, 0.3) transparent;
}

/* Webkit 滚动条样式 */
.interviews-list-container::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

.interviews-list-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.interviews-list-container::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.4);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.interviews-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.6);
}

.interviews-list-container::-webkit-scrollbar-thumb:active {
  background: rgba(248, 180, 0, 0.8);
}

.interviews-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* 确保内容宽度与容器对齐 */
  width: 100%;
  box-sizing: border-box;
}

.interview-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
  /* 确保卡片宽度不超出容器 */
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
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

/* 面试者姓名区域 */
.interviewee-name-section {
  margin-bottom: 0.75rem;
}

.name-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  background: rgba(248, 180, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-bottom: 0.25rem;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.interviewee-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  /* 使姓名更加突出 */
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.interview-choice {
  color: #f8b400;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background: rgba(248, 180, 0, 0.1);
  border-radius: 8px;
  border-left: 3px solid #f8b400;
  box-shadow: 0 2px 4px rgba(248, 180, 0, 0.1);
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

.delete-btn {
  background: rgba(139, 69, 19, 0.1);
  color: #8b4513;
  border: 1px solid rgba(139, 69, 19, 0.2);
}

.delete-btn:hover {
  background: rgba(139, 69, 19, 0.2);
  color: #654321;
  transform: translateY(-1px);
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

.modal-content.large {
  max-width: 800px;
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

/* 删除确认模态框样式 */
.delete-warning {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #ffc107;
  border-radius: 8px;
}

.warning-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  color: #856404;
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.interview-details-preview {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  border-left: 4px solid #f8b400;
}

.separator {
  color: #999;
  margin: 0 0.5rem;
}

.time-info,
.location-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.delete-consequences {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #dc3545;
  margin-bottom: 1.5rem;
}

.consequences-title {
  color: #721c24;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.consequences-list {
  margin: 0;
  padding-left: 1.2rem;
  color: #721c24;
}

.consequences-list li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.confirmation-input {
  margin-bottom: 1rem;
}

.confirm-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.confirm-input:focus {
  outline: none;
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.confirm-input::placeholder {
  color: #adb5bd;
  font-style: italic;
}

/* 简历查看模态框样式 */
.resume-content {
  max-height: 70vh;
  overflow-y: auto;
}

.resume-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.resume-basic-info {
  flex: 1;
}

.resume-basic-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.4rem;
}

.user-basic-info {
  margin-bottom: 1rem;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.user-info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  font-size: 0.85rem;
}

.info-label {
  font-weight: 600;
  color: #666;
  min-width: fit-content;
}

.info-value {
  color: #333;
  font-weight: 500;
  flex: 1;
  word-break: break-all;
}

.resume-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.meta-item {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-text {
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.status-passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
}

.status-default {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
}

.resume-photo {
  flex-shrink: 0;
  margin-top: 2.5rem; /* 调整正面照位置，使其与学号学院信息对齐 */
}

.photo-img {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.resume-body {
  padding: 0;
}

.resume-section {
  padding: 1.5rem;
  border-bottom: 1px solid #f8f9fa;
}

.resume-section:last-child {
  border-bottom: none;
}

.section-title {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-content {
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.section-content p {
  margin: 0;
}

.choice-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.choice-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.choice-item.primary {
  border-color: #f8b400;
  background: rgba(248, 180, 0, 0.05);
}

.choice-item.secondary {
  border-color: #6c757d;
  background: rgba(108, 117, 125, 0.05);
}

.choice-label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.choice-value {
  color: #333;
  font-weight: 500;
}

.grade-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.grade-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.grade-label {
  font-weight: 600;
  color: #666;
}

.grade-value {
  color: #333;
  font-weight: 500;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.file-name {
  color: #333;
  font-weight: 500;
  flex: 1;
}

.btn-primary.small {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-icon {
  font-size: 3rem;
  color: #dc3545;
  display: block;
  margin-bottom: 1rem;
}

/* 评审区域样式 */
.review-section {
  background: #fff8e1;
  border-left: 4px solid #f8b400;
}

.add-review-form {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.add-review-form h5 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.review-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.score-input,
.passed-select,
.comments-textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.score-input:focus,
.passed-select:focus,
.comments-textarea:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 2px rgba(248, 180, 0, 0.1);
}

.comments-textarea {
  resize: vertical;
  min-height: 80px;
}

.add-review-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

.add-review-btn:hover:not(:disabled) {
  background: #218838;
}

.add-review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reviews-list-container {
  position: relative;
}

.reviews-list-container h5 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.reviews-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(248, 180, 0, 0.3) transparent;
}

.reviews-list::-webkit-scrollbar {
  width: 6px;
}

.reviews-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.reviews-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.4);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.reviews-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.6);
}

.review-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
  transition: box-shadow 0.3s ease;
}

.review-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.review-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.review-score {
  font-weight: 600;
  color: #333;
  background: rgba(248, 180, 0, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.review-result {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.review-result.passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.review-result.rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
}

.review-time {
  color: #666;
  font-size: 0.8rem;
}

.delete-review-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.delete-review-btn:hover:not(:disabled) {
  background: #c82333;
}

.delete-review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.review-content {
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 3px solid #e9ecef;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.loading-container.small {
  padding: 1.5rem;
  text-align: center;
}

.loading-container.small p {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* 缩放适配和容器对齐 */
@media (max-width: 1600px) {
  .interviews-list-container {
    max-height: 65vh;
  }
}

@media (max-width: 1400px) {
  .interviews-list-container {
    max-height: 60vh;
  }
}

@media (max-width: 1200px) {
  .interviews-list-container {
    max-height: 55vh;
  }
}

/* 高DPI和缩放适配 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .interviews-list-container {
    /* 高分辨率下的滚动条优化 */
    scrollbar-width: auto;
  }
  
  .interviews-list-container::-webkit-scrollbar {
    width: 12px;
  }
}

/* Zoom 适配 */
@media (min-resolution: 120dpi) and (max-resolution: 192dpi) {
  .interview-list {
    /* 确保在中等缩放下内容不会被截断 */
    max-width: 100%;
  }
}

/* 特大屏幕适配 */
@media (min-width: 1920px) {
  .interviews-list-container {
    max-height: 75vh;
  }
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
  
  .interviews-list-container {
    max-height: 50vh;
    min-height: 300px;
    border-radius: 8px;
  }
  
  .interviews-list {
    padding: 0.75rem;
    gap: 0.75rem;
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
  
  .name-search-input {
    min-width: 160px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .interviewee-name {
    font-size: 1.3rem;
    text-align: center;
  }
  
  .name-label {
    display: block;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .interview-choice {
    justify-content: center;
    text-align: center;
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
  
  .resume-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .resume-meta {
    align-items: center;
  }
  
  .meta-item {
    justify-content: center;
  }
  
  .choice-info {
    gap: 0.5rem;
  }
  
  .choice-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    text-align: center;
  }
  
  .choice-label {
    min-width: auto;
    font-weight: 700;
  }
  
  .grade-info {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .grade-item {
    justify-content: center;
  }
  
  .file-info {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-content.large {
    margin: 0.5rem;
    width: calc(100% - 1rem);
    max-height: 95vh;
  }
  
  .resume-content {
    max-height: 80vh;
  }
  
  .user-info-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .user-info-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    text-align: left;
  }
  
  .info-label {
    min-width: auto;
    font-weight: 700;
  }
  
  /* 移动端评审样式优化 */
  .review-form-grid {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .review-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .reviews-list {
    max-height: 250px;
  }
  
  .delete-review-btn {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .interviews-list-container {
    max-height: 45vh;
    min-height: 250px;
  }
  
  .interviews-list {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .interviews-list-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .interviewee-name {
    font-size: 1.2rem;
  }
  
  .name-label {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
  
  .interview-choice {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
  
  .name-search-input {
    min-width: 120px;
    font-size: 0.9rem;
  }
}
</style>
