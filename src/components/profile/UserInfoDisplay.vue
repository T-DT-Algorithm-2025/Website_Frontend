<template>
  <div class="content-section">
    <h2 class="section-title">个人信息</h2>
    <div class="info-grid">
      <div class="info-item">
        <label>昵称</label>
        <span>{{ userInfo?.nickname || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>真实姓名</label>
        <span>{{ userInfo?.realname || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>性别</label>
        <span>{{ userInfo?.gender || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>学号</label>
        <span>{{ userInfo?.student_id || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>学院</label>
        <span>{{ userInfo?.department || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>专业</label>
        <span>{{ userInfo?.major || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>年级</label>
        <span>{{ userInfo?.grade || '未设置' }}</span>
      </div>
      <div class="info-item">
        <label>学历</label>
        <span>{{ userInfo?.rank || '未设置' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  color: #333;
  font-size: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #f8b400;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>

