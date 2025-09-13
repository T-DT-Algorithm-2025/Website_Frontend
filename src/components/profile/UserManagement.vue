<template>
  <div class="user-management-container">
    <!-- 头部工具栏 -->
    <div class="header-toolbar">
      <div class="toolbar-left">
        <h2 class="section-title">用户管理</h2>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用户（姓名或邮箱）"
            class="search-input"
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>
      <div class="toolbar-right">
        <button
          v-if="selectedUsers.length > 0"
          @click="showBatchDeleteDialog = true"
          class="batch-delete-btn"
          :disabled="isLoading"
        >
          批量删除 ({{ selectedUsers.length }})
        </button>
        <button @click="refreshUsers" class="refresh-btn" :disabled="isLoading">
          刷新
        </button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="user-list-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="users.length === 0" class="empty-state">
        <span class="empty-icon">👥</span>
        <h3>暂无用户数据</h3>
        <p>{{ searchQuery ? '搜索结果为空' : '暂时没有用户数据' }}</p>
      </div>

      <div v-else class="user-list">
        <!-- 表头 -->
        <div class="user-list-header">
          <div class="header-cell checkbox-cell">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="checkbox"
            />
          </div>
          <div class="header-cell uid-cell">用户ID</div>
          <div class="header-cell name-cell">姓名</div>
          <div class="header-cell email-cell">邮箱</div>
          <div class="header-cell registration-cell">注册时间</div>
          <div class="header-cell permissions-cell">权限</div>
          <div class="header-cell actions-cell">操作</div>
        </div>

        <!-- 用户行 -->
        <div
          v-for="user in users"
          :key="user.uid"
          class="user-row"
          :class="{ selected: selectedUsers.includes(user.uid) }"
        >
          <div class="user-cell checkbox-cell">
            <input
              type="checkbox"
              :checked="selectedUsers.includes(user.uid)"
              @change="toggleUserSelection(user.uid)"
              class="checkbox"
            />
          </div>
          <div class="user-cell uid-cell">
            <span class="uid-text">{{ user.uid }}</span>
          </div>
          <div class="user-cell name-cell">
            <span class="name-text">{{ user.realname || '未设置' }}</span>
          </div>
          <div class="user-cell email-cell">
            <span class="email-text">{{ user.email }}</span>
          </div>
          <div class="user-cell registration-cell">
            <span class="time-text">{{ formatDate(user.registration_time) }}</span>
          </div>
          <div class="user-cell permissions-cell">
            <div class="permissions-badges">
              <span
                v-if="user.permissions?.is_main_leader_admin"
                class="permission-badge main-leader"
              >
                主管理员
              </span>
              <span
                v-if="user.permissions?.is_group_leader_admin"
                class="permission-badge group-leader"
              >
                组长管理
              </span>
              <span
                v-if="user.permissions?.is_member_admin"
                class="permission-badge member-admin"
              >
                成员管理
              </span>
              <span
                v-if="user.permissions?.is_banned"
                class="permission-badge banned"
              >
                已封禁
              </span>
              <span
                v-if="!hasAnyPermission(user.permissions)"
                class="permission-badge normal"
              >
                普通用户
              </span>
            </div>
          </div>
          <div class="user-cell actions-cell">
            <button
              @click="editUserPermissions(user)"
              class="action-btn edit-permissions-btn"
              :disabled="isLoading"
            >
              权限管理
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限编辑对话框 -->
    <div v-if="showPermissionsDialog" class="dialog-overlay" @click="closePermissionsDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>编辑用户权限</h3>
          <button @click="closePermissionsDialog" class="close-btn">×</button>
        </div>
        <div class="dialog-body">
          <div v-if="editingUser" class="user-info">
            <p><strong>用户:</strong> {{ editingUser.name || '未设置' }} ({{ editingUser.email }})</p>
            <p><strong>用户ID:</strong> {{ editingUser.uid }}</p>
          </div>
          
          <div class="permissions-form">
            <div class="permission-item">
              <label class="permission-label">
                <input
                  type="checkbox"
                  v-model="editingPermissions.is_main_leader_admin"
                  class="permission-checkbox"
                />
                <span class="permission-text">主管理员权限</span>
              </label>
              <p class="permission-desc">拥有所有管理权限</p>
            </div>
            
            <div class="permission-item">
              <label class="permission-label">
                <input
                  type="checkbox"
                  v-model="editingPermissions.is_group_leader_admin"
                  class="permission-checkbox"
                />
                <span class="permission-text">组长管理权限</span>
              </label>
              <p class="permission-desc">可以管理组内成员</p>
            </div>
            
            <div class="permission-item">
              <label class="permission-label">
                <input
                  type="checkbox"
                  v-model="editingPermissions.is_member_admin"
                  class="permission-checkbox"
                />
                <span class="permission-text">成员管理权限</span>
              </label>
              <p class="permission-desc">基础管理权限</p>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="closePermissionsDialog" class="cancel-btn">取消</button>
          <button
            @click="updatePermissions"
            class="save-btn"
            :disabled="isUpdatingPermissions"
          >
            {{ isUpdatingPermissions ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 批量删除确认对话框 -->
    <div v-if="showBatchDeleteDialog" class="dialog-overlay" @click="showBatchDeleteDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>确认批量删除</h3>
          <button @click="showBatchDeleteDialog = false" class="close-btn">×</button>
        </div>
        <div class="dialog-body">
          <p>确定要删除选中的 {{ selectedUsers.length }} 个用户吗？</p>
          <p class="warning-text">此操作不可撤销，请谨慎操作。</p>
        </div>
        <div class="dialog-footer">
          <button @click="showBatchDeleteDialog = false" class="cancel-btn">取消</button>
          <button
            @click="batchDeleteUsers"
            class="delete-btn"
            :disabled="isBatchDeleting"
          >
            {{ isBatchDeleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authAPI } from '@/api/auth.js'
import { useAlert } from '@/composables/useAlert'

const { showAlert } = useAlert()

// 响应式数据
const users = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedUsers = ref([])
const showPermissionsDialog = ref(false)
const showBatchDeleteDialog = ref(false)
const editingUser = ref(null)
const editingPermissions = ref({})
const isUpdatingPermissions = ref(false)
const isBatchDeleting = ref(false)

// 计算属性
const isAllSelected = computed(() => {
  return users.value.length > 0 && selectedUsers.value.length === users.value.length
})

// 获取用户列表
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const result = await authAPI.getAllUsers()
    if (result.success) {
      // 为每个用户获取权限信息
      const usersWithPermissions = await Promise.all(
        result.data.map(async (user) => {
          const permissionResult = await authAPI.getUserPermissions(user.uid)
          return {
            ...user,
            permissions: permissionResult.success ? permissionResult.data : {}
          }
        })
      )
      users.value = usersWithPermissions
    } else {
      showAlert('获取用户列表失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    showAlert('获取用户列表失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 搜索用户
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await fetchUsers()
    return
  }

  isLoading.value = true
  try {
    const result = await authAPI.searchUsers(searchQuery.value)
    if (result.success) {
      // 为搜索结果获取权限信息
      const usersWithPermissions = await Promise.all(
        result.data.map(async (user) => {
          const permissionResult = await authAPI.getUserPermissions(user.uid)
          return {
            ...user,
            permissions: permissionResult.success ? permissionResult.data : {}
          }
        })
      )
      users.value = usersWithPermissions
    } else {
      showAlert('搜索用户失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('搜索用户失败:', error)
    showAlert('搜索用户失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 刷新用户列表
const refreshUsers = () => {
  selectedUsers.value = []
  searchQuery.value = ''
  fetchUsers()
}

// 切换用户选择
const toggleUserSelection = (uid) => {
  const index = selectedUsers.value.indexOf(uid)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(uid)
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = users.value.map(user => user.uid)
  }
}

// 编辑用户权限
const editUserPermissions = async (user) => {
  editingUser.value = user
  editingPermissions.value = { ...user.permissions }
  showPermissionsDialog.value = true
}

// 关闭权限对话框
const closePermissionsDialog = () => {
  showPermissionsDialog.value = false
  editingUser.value = null
  editingPermissions.value = {}
}

// 更新权限
const updatePermissions = async () => {
  if (!editingUser.value) return

  isUpdatingPermissions.value = true
  try {
    const result = await authAPI.updateUserPermissions(
      editingUser.value.uid,
      editingPermissions.value
    )
    
    if (result.success) {
      showAlert('权限更新成功', 'success')
      closePermissionsDialog()
      await fetchUsers() // 刷新用户列表
    } else {
      showAlert('权限更新失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('权限更新失败:', error)
    showAlert('权限更新失败，请稍后重试', 'error')
  } finally {
    isUpdatingPermissions.value = false
  }
}

// 批量删除用户
const batchDeleteUsers = async () => {
  if (selectedUsers.value.length === 0) return

  isBatchDeleting.value = true
  try {
    const result = await authAPI.batchDeleteUsers(selectedUsers.value)
    
    if (result.success) {
      showAlert(`成功删除 ${selectedUsers.value.length} 个用户`, 'success')
      selectedUsers.value = []
      showBatchDeleteDialog.value = false
      await fetchUsers() // 刷新用户列表
    } else {
      showAlert('批量删除失败：' + result.error, 'error')
    }
  } catch (error) {
    console.error('批量删除失败:', error)
    showAlert('批量删除失败，请稍后重试', 'error')
  } finally {
    isBatchDeleting.value = false
  }
}

// 检查用户是否有任何权限
const hasAnyPermission = (permissions) => {
  if (!permissions) return false
  return permissions.is_main_leader_admin || 
         permissions.is_group_leader_admin || 
         permissions.is_member_admin
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 2px rgba(248, 180, 0, 0.1);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  color: #666;
  pointer-events: none;
}

.toolbar-right {
  display: flex;
  gap: 1rem;
}

.refresh-btn, .batch-delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(13, 110, 253, 0.2);
}

.batch-delete-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.batch-delete-btn:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.2);
}

.user-list-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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

.user-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.user-list-header {
  display: grid;
  grid-template-columns: 50px 150px 120px 200px 150px 150px 120px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-cell {
  padding: 1rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.header-cell:last-child {
  border-right: none;
}

.user-row {
  display: grid;
  grid-template-columns: 50px 150px 120px 200px 150px 150px 120px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-row.selected {
  background: rgba(248, 180, 0, 0.1);
}

.user-cell {
  padding: 1rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.user-cell:last-child {
  border-right: none;
}

.checkbox-cell {
  justify-content: center;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.uid-cell .uid-text {
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
  word-break: break-all;
}

.name-cell .name-text {
  font-weight: 500;
  color: #333;
}

.email-cell .email-text {
  color: #666;
  word-break: break-all;
}

.time-text {
  color: #666;
  font-size: 0.8rem;
}

.permissions-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
}

.permission-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.permission-badge.main-leader {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.permission-badge.group-leader {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.permission-badge.member-admin {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.3);
}

.permission-badge.banned {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.permission-badge.normal {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.edit-permissions-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.edit-permissions-btn:hover:not(:disabled) {
  background: rgba(248, 180, 0, 0.2);
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.dialog-body {
  padding: 1.5rem;
}

.user-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.user-info p {
  margin: 0.5rem 0;
  color: #666;
}

.permissions-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.permission-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.permission-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.permission-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.permission-text {
  font-weight: 500;
  color: #333;
}

.permission-desc {
  margin: 0.5rem 0 0 2.25rem;
  font-size: 0.85rem;
  color: #666;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn, .save-btn, .delete-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.save-btn {
  background: #f8b400;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #e6a200;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.save-btn:disabled, .delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 滚动条样式 */
.user-list::-webkit-scrollbar {
  width: 8px;
}

.user-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.user-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 4px;
}

.user-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .user-list-header,
  .user-row {
    grid-template-columns: 40px 120px 100px 150px 120px 120px 100px;
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .header-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .toolbar-left {
    flex-direction: column;
    gap: 1rem;
  }
  
  .toolbar-right {
    justify-content: center;
  }
  
  .search-input {
    width: 100%;
  }
  
  .user-list {
    font-size: 0.8rem;
  }
  
  .user-list-header,
  .user-row {
    grid-template-columns: 30px 1fr 1fr 1fr;
  }
  
  .uid-cell, .registration-cell, .actions-cell {
    display: none;
  }
  
  .permissions-cell {
    grid-column: 4;
  }
  
  .dialog-content {
    width: 95%;
    margin: 1rem;
  }
  
  .dialog-body, .dialog-header, .dialog-footer {
    padding: 1rem;
  }
}
</style>
