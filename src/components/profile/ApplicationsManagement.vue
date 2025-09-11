<template>
  <div class="content-section">
    <!-- 根据当前视图显示不同组件 -->
    <ApplicationsList
      v-if="currentView === 'list'"
      :recruitList="recruitList"
      :loading="loading"
      :showOnlyAvailable="showOnlyAvailable"
      @toggle-view="toggleView"
      @view-recruit-detail="viewRecruitDetail"
      @view-my-submissions="viewMySubmissions"
    />
    
    <ApplicationForm
      v-else-if="currentView === 'form'"
      ref="applicationFormRef"
      :selectedRecruit="selectedRecruit"
      :positions="positions"
      :secondStagePositions="secondStagePositions"
      :isSubmitting="isApplicationSubmitting"
      :userInfo="userInfo"
      @submit="handleApplicationSubmit"
      @back="backToList"
      @user-info-updated="handleUserInfoUpdated"
    />
    
    <MySubmissions
      v-else-if="currentView === 'my-submissions'"
      :userSubmissions="userSubmissions"
      :loading="submissionsLoading"
      :selectedRecruit="selectedRecruit"
      @back="backToRecruitListFromSubmissions"
      @apply-now="applyToRecruit"
      @view-submission-detail="viewSubmissionDetail"
      @edit-submission="editSubmission"
    />
    
    <SubmissionDetail
      v-else-if="currentView === 'submission-detail'"
      :submissionDetail="submissionDetail"
      :selectedSubmission="selectedSubmission"
      :selectedRecruit="selectedRecruit"
      :loading="submissionDetailLoading"
      :downloadingFile="downloadingFile"
      @back="backToMySubmissions"
      @download="downloadAttachment"
    />
    
    <UserRecruitDetail
      v-else-if="currentView === 'recruit-detail'"
      :recruitData="viewingRecruitDetail"
      :loading="recruitDetailLoading"
      @close="backToRecruitList"
      @apply="applyToRecruitFromDetail"
      @view-submissions="viewMySubmissionsFromDetail"
    />
    
    <EditResumeForm
      v-else-if="currentView === 'edit-resume'"
      :selectedRecruit="selectedRecruit"
      :submissionDetail="submissionDetail"
      :selectedSubmission="selectedSubmission"
      :positions="positions"
      :secondStagePositions="secondStagePositions"
      :isSubmitting="isEditSubmitting"
      @submit="handleEditSubmit"
      @back="backToMySubmissions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authAPI } from '../../api/auth.js'
import ApplicationsList from './ApplicationsList.vue'
import ApplicationForm from './ApplicationForm.vue'
import MySubmissions from './MySubmissions.vue'
import SubmissionDetail from './SubmissionDetail.vue'
import UserRecruitDetail from './UserRecruitDetail.vue'
import EditResumeForm from './EditResumeForm.vue'

import { useAlert } from '@/composables/useAlert'
const { showAlert } = useAlert()

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['refresh-recruit-list', 'user-info-updated'])

// 当前视图状态
const currentView = ref('list') // 'list' | 'form' | 'my-submissions' | 'submission-detail' | 'recruit-detail' | 'edit-resume'

// 招聘批次相关状态
const recruitList = ref([])
const loading = ref(false)
const showOnlyAvailable = ref(false)
const selectedRecruit = ref(null)
const viewingRecruitDetail = ref(null)
const recruitDetailLoading = ref(false)
const positions = ref([])
const secondStagePositions = ref([])

// 我的投递相关状态
const userSubmissions = ref([])
const submissionsLoading = ref(false)
const selectedSubmission = ref(null)
const submissionDetail = ref(null)
const submissionDetailLoading = ref(false)
const downloadingFile = ref(false)

// 申请表单相关状态
const isApplicationSubmitting = ref(false)
const applicationFormRef = ref(null)

// 编辑简历相关状态
const isEditSubmitting = ref(false)

// 获取招聘批次列表
const fetchRecruitList = async () => {
  loading.value = true
  try {
    const result = await authAPI.getRecruitList(showOnlyAvailable.value)
    if (result.success) {
      recruitList.value = result.data
    } else {
      console.error('获取招聘列表失败:', result.error)
      showAlert('获取招聘列表失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取招聘列表失败:', error)
    showAlert('获取招聘列表失败，请稍后重试', 'error')
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
      secondStagePositions.value = result.data.secondStagePositions || []
    } else {
      console.error('获取职位列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
  }
}

// 切换视图（显示所有批次/仅显示正在招聘）
const toggleView = () => {
  showOnlyAvailable.value = !showOnlyAvailable.value
  fetchRecruitList()
}

// 查看招聘详情
const viewRecruitDetail = async (recruit) => {
  recruitDetailLoading.value = true
  currentView.value = 'recruit-detail'
  viewingRecruitDetail.value = null
  
  try {
    const result = await authAPI.getRecruitInfo(recruit.recruit_id)
    if (result.success) {
      viewingRecruitDetail.value = result.data
    } else {
      showAlert('获取招聘详情失败：' + result.error, 'error')
      currentView.value = 'list'
    }
  } catch (error) {
    console.error('获取招聘详情失败:', error)
    showAlert('获取招聘详情失败，请稍后重试', 'error')
    currentView.value = 'list'
  } finally {
    recruitDetailLoading.value = false
  }
}

// 申请招聘
const applyToRecruit = (recruit) => {
  selectedRecruit.value = recruit
  currentView.value = 'form'
}

// 查看我的投递
const viewMySubmissions = async (recruit) => {
  selectedRecruit.value = recruit
  currentView.value = 'my-submissions'
  await fetchUserSubmissions(recruit.recruit_id)
}

// 获取用户投递列表
const fetchUserSubmissions = async (recruitId) => {
  submissionsLoading.value = true
  try {
    const result = await authAPI.getUserSubmissions(recruitId)
    if (result.success) {
      userSubmissions.value = result.data
    } else {
      console.error('获取投递列表失败:', result.error)
      showAlert('获取投递列表失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取投递列表失败:', error)
    showAlert('获取投递列表失败，请稍后重试', 'error')
  } finally {
    submissionsLoading.value = false
  }
}

// 查看投递详情
const viewSubmissionDetail = async (submission) => {
  selectedSubmission.value = submission
  currentView.value = 'submission-detail'
  await fetchSubmissionDetail(submission.submit_id)
}

// 获取投递详情
const fetchSubmissionDetail = async (submitId) => {
  submissionDetailLoading.value = true
  try {
    const result = await authAPI.getResumeInfo(submitId)
    if (result.success) {
      submissionDetail.value = result.data
    } else {
      console.error('获取投递详情失败:', result.error)
      showAlert('获取投递详情失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取投递详情失败:', error)
    showAlert('获取投递详情失败，请稍后重试', 'error')
  } finally {
    submissionDetailLoading.value = false
  }
}

// 编辑投递
const editSubmission = async (submission) => {
  selectedSubmission.value = submission
  currentView.value = 'edit-resume'
  await fetchSubmissionDetail(submission.submit_id)
}

// 处理编辑提交
const handleEditSubmit = async (editForm) => {
  // 验证必填字段
  if (!editForm.first_choice) {
    showAlert('请选择第一志愿', 'error')
    return
  }
  
  if (!editForm.self_intro) {
    showAlert('请填写自我介绍', 'error')
    return
  }
  
  if (!editForm.skills) {
    showAlert('请填写技能', 'error')
    return
  }
  
  if (!editForm.projects) {
    showAlert('请填写项目经历', 'error')
    return
  }
  
  if (!editForm.awards) {
    showAlert('请填写获奖经历', 'error')
    return
  }
  
  isEditSubmitting.value = true
  try {
    // 创建FormData对象
    const formData = new FormData()
    
    // 添加表单数据
    formData.append('first_choice', editForm.first_choice)
    if (editForm.second_choice) {
      formData.append('second_choice', editForm.second_choice)
    }
    formData.append('self_intro', editForm.self_intro)
    formData.append('skills', editForm.skills)
    formData.append('projects', editForm.projects)
    formData.append('awards', editForm.awards)
    
    if (editForm.grade_point) {
      formData.append('grade_point', editForm.grade_point)
    }
    if (editForm.grade_rank) {
      formData.append('grade_rank', editForm.grade_rank)
    }
    
    // 添加文件变更控制字段
    formData.append('real_head_img_change', editForm.real_head_img_change)
    formData.append('additional_file_change', editForm.additional_file_change)
    
    // 如果选择更换正面照
    if (editForm.real_head_img_change && editForm.real_head_img) {
      formData.append('real_head_img', editForm.real_head_img)
    }
    
    // 如果选择更换附加文件
    if (editForm.additional_file_change && editForm.additional_file) {
      formData.append('additional_file', editForm.additional_file)
    }
    
    // 调用后端API更新简历
    const result = await authAPI.updateResume(selectedSubmission.value.submit_id, formData)
    
    if (result.success) {
      showAlert('简历更新成功！', 'success')
      // 返回到投递列表并刷新数据
      await fetchUserSubmissions(selectedRecruit.value.recruit_id)
      currentView.value = 'my-submissions'
    } else {
      showAlert('更新失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('更新简历失败:', error)
    showAlert('更新失败，请稍后重试', 'error')
  } finally {
    isEditSubmitting.value = false
  }
}

// 下载附件文件
const downloadAttachment = async (submitId) => {
  downloadingFile.value = true
  try {
    // 首先获取简历信息以获得正确的文件名
    const infoResult = await authAPI.getResumeInfo(submitId)
    let fileName = `attachment_${submitId}.pdf` // 默认文件名
    
    if (infoResult.success && infoResult.data.info) {
      // 优先使用 additional_file_name 字段
      if (infoResult.data.info.additional_file_name) {
        fileName = infoResult.data.info.additional_file_name
      } 
      // 如果没有 additional_file_name，则从 additional_file_path 中提取文件名
      else if (infoResult.data.info.additional_file_path) {
        const pathParts = infoResult.data.info.additional_file_path.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      }
    }
    
    // 下载文件
    const result = await authAPI.downloadAttachment(submitId)
    if (result.success) {
      // 创建下载链接
      const url = window.URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      showAlert('下载文件失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('下载文件失败:', error)
    showAlert('下载文件失败，请稍后重试', 'error')
  } finally {
    downloadingFile.value = false
  }
}

// 返回招聘列表
const backToList = () => {
  currentView.value = 'list'
  selectedRecruit.value = null
  // 重置申请表单
  if (applicationFormRef.value) {
    applicationFormRef.value.resetForm()
  }
}

// 返回招聘列表（从我的投递页面）
const backToRecruitListFromSubmissions = () => {
  currentView.value = 'list'
  selectedRecruit.value = null
  userSubmissions.value = []
}

// 返回我的投递列表
const backToMySubmissions = () => {
  currentView.value = 'my-submissions'
  selectedSubmission.value = null
  submissionDetail.value = null
}

// 从招聘详情页返回招聘列表
const backToRecruitList = () => {
  currentView.value = 'list'
  viewingRecruitDetail.value = null
  recruitDetailLoading.value = false
}

// 从招聘详情页跳转到申请页面
const applyToRecruitFromDetail = (recruit) => {
  selectedRecruit.value = recruit
  currentView.value = 'form'
}

// 从招聘详情页跳转到我的投递
const viewMySubmissionsFromDetail = async (recruit) => {
  selectedRecruit.value = recruit
  currentView.value = 'my-submissions'
  await fetchUserSubmissions(recruit.recruit_id)
}

// 处理用户信息更新
const handleUserInfoUpdated = () => {
  // 通知父组件刷新用户信息
  emit('user-info-updated')
}

// 处理申请提交
const handleApplicationSubmit = async (applicationForm) => {
  // 验证必填字段
  if (!applicationForm.first_choice) {
    showAlert('请选择第一志愿', 'error')
    return
  }
  
  if (!applicationForm.self_intro) {
    showAlert('请填写自我介绍', 'error')
    return
  }
  
  if (!applicationForm.skills) {
    showAlert('请填写技能', 'error')
    return
  }
  
  if (!applicationForm.projects) {
    showAlert('请填写项目经历', 'error')
    return
  }
  
  if (!applicationForm.awards) {
    showAlert('请填写获奖经历', 'error')
    return
  }
  
  if (!applicationForm.real_head_img) {
    showAlert('请上传正面照', 'error')
    return
  }
  
  isApplicationSubmitting.value = true
  try {
    // 创建FormData对象
    const formData = new FormData()
    
    // 添加表单数据
    formData.append('recruit_id', applicationForm.recruit_id)
    formData.append('first_choice', applicationForm.first_choice)
    if (applicationForm.second_choice) {
      formData.append('second_choice', applicationForm.second_choice)
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
    // 添加正面照（必填）
    formData.append('real_head_img', applicationForm.real_head_img)
    if (applicationForm.additional_file) {
      formData.append('additional_file', applicationForm.additional_file)
    }
    
    // 调用后端API提交申请
    const result = await authAPI.submitApplication(formData)
    
    if (result.success) {
      showAlert('申请提交成功！请等待审核结果。', 'success')
      // 返回列表视图并刷新数据
      backToList()
      fetchRecruitList()
      userSubmissions.value = []
      emit('refresh-recruit-list')
    } else {
      showAlert('提交申请失败：' + result.error, 'error')
    }
    
  } catch (error) {
    console.error('提交申请失败:', error)
    showAlert('提交失败，请稍后重试', 'error')
  } finally {
    isApplicationSubmitting.value = false
  }
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

// 初始化
onMounted(() => {
  fetchRecruitList()
  fetchPositions()
})

// 暴露方法给父组件
defineExpose({
  fetchRecruitList,
  fetchPositions
})
</script>

<style scoped>
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
</style>
