<template>
  <div class="join-us-page">
    <!-- Hero Banner Section -->
    <section class="hero-wrap hero-wrap-2">
      <div class="overlay"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="main-title">Join Us</h1>
          <div class="breadcrumbs">
            <span class="breadcrumb-item">
              <a href="/">Home</a>
              <i class="arrow-icon">→</i>
            </span>
            <span class="breadcrumb-item">Join Us</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="heading-section">
            <span class="subheading">Join Us</span>
            <h2 class="main-heading">加入我们</h2>
          </div>
          <p class="content-text">
            欢迎加入T-DT！点击下方按钮管理您的投递申请。
          </p>
          <div class="action-section">
            <button class="join-btn" @click="handleJoinClick" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '检查登录状态...' : '管理投递' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'

const router = useRouter()
const loading = ref(false)

// 处理加入我们按钮点击
const handleJoinClick = async () => {
  loading.value = true
  
  try {
    // 检查用户登录状态
    const result = await authAPI.getUserInfo()
    
    if (result.success) {
      // 已登录，跳转到profile页面的管理投递tab
      router.push({ 
        path: '/profile',
        query: { tab: 'applications' }
      })
    } else {
      // 未登录，跳转到登录页面
      router.push('/login')
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
    // 出错时也跳转到登录页面
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.join-us-page {
  min-height: 100vh;
}

/* Hero Banner Styles */
.hero-wrap {
  position: relative;
  height: 60vh;
  min-height: 400px;
  background-image: url('https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.hero-content {
  text-align: center;
  color: white;
}

.main-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  animation: fadeInUp 1s ease-out;
}

.breadcrumbs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item a {
  color: #f8b400;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: #ff6b35;
}

.arrow-icon {
  color: #f8b400;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Content Section Styles */
.content-section {
  background: white;
  padding: 4rem 0;
}

.content-wrapper {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.heading-section {
  margin-bottom: 2rem;
}

.subheading {
  font-family: 'YunFengJingLongXingShu', '华文行楷', '楷体', serif;
  font-size: 2.5rem;
  color: #f8b400;
  display: block;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.main-heading {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.content-text {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin: 0 0 2rem 0;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.action-section {
  display: flex;
  justify-content: center;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.join-btn {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: center;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(248, 180, 0, 0.4);
}

.join-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-wrap {
    height: 50vh;
    min-height: 300px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subheading {
    font-size: 2rem;
  }

  .main-heading {
    font-size: 2.2rem;
  }

  .content-text {
    font-size: 1.1rem;
  }

  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero-wrap {
    height: 40vh;
    min-height: 250px;
  }

  .main-title {
    font-size: 2rem;
  }

  .subheading {
    font-size: 1.8rem;
  }

  .main-heading {
    font-size: 1.8rem;
  }

  .content-text {
    font-size: 1rem;
  }

  .breadcrumbs {
    font-size: 1rem;
    flex-direction: column;
    gap: 0.3rem;
  }
}

/* 确保字体加载 */
@font-face {
  font-family: 'YunFengJingLongXingShu';
  src: url('../assets/fonts/YunFengJingLongXingShu.ttf') format('truetype');
  font-display: swap;
}
</style>
