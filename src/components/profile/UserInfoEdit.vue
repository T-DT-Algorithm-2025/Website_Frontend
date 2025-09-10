<template>
  <div class="content-section">
    <h2 class="section-title">修改信息</h2>
    <form @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-row">
        <div class="form-group">
          <label for="nickname">昵称</label>
          <IInput 
            type="text" 
            id="nickname" 
            v-model="editForm.nickname" 
            placeholder="请输入昵称"
          />
        </div>
        <div class="form-group">
          <label for="realname">真实姓名</label>
          <IInput 
            type="text" 
            id="realname" 
            v-model="editForm.realname" 
            placeholder="请输入真实姓名"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="gender">性别</label>
          <ISelect id="gender" v-model="editForm.gender">
            <option value="" disabled selected>请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </ISelect>
        </div>
        <div class="form-group">
          <label for="student_id">学号</label>
          <IInput 
            type="text" 
            id="student_id" 
            v-model="editForm.student_id" 
            placeholder="请输入学号"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="department">学院</label>
          <IInput 
            type="text" 
            id="department" 
            v-model="editForm.department" 
            placeholder="请输入学院"
          />
        </div>
        <div class="form-group">
          <label for="major">专业</label>
          <IInput 
            type="text" 
            id="major" 
            v-model="editForm.major" 
            placeholder="请输入专业"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="grade">年级</label>
          <ISelect id="grade" v-model="editForm.grade">
            <option value="" disabled selected>请选择年级</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </ISelect>
        </div>
        <div class="form-group">
          <label for="rank">学历</label>
          <ISelect id="rank" v-model="editForm.rank">
            <option value="" disabled selected>请选择学历</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </ISelect>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
        <button type="button" class="cancel-btn" @click="handleCancel">
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import IInput from '@/components/inspira/IInput.vue'
import ISelect from '@/components/inspira/ISelect.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 编辑表单数据
const editForm = reactive({
  nickname: '',
  gender: '',
  realname: '',
  student_id: '',
  department: '',
  major: '',
  grade: '',
  rank: ''
})

// 监听用户信息变化，更新表单
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    Object.assign(editForm, newUserInfo)
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', editForm)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
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

.edit-form {
  max-width: 800px;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(248, 180, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* 滚动条样式 */
.edit-form::-webkit-scrollbar {
  width: 6px;
}

.edit-form::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.edit-form::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.edit-form::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .edit-form {
    overflow-y: visible;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}
</style>

