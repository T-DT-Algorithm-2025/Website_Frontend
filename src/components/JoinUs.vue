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
              <a href="#home">Home</a>
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
            <span class="subheading">Notice</span>
            <h2 class="main-heading">投递须知</h2>
          </div>
          <p class="content-text">
            投递通道暂时关闭，请关注我们的公众号等渠道获取第一时间的招新信息。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 组件逻辑
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
  margin: 0;
  animation: fadeInUp 1s ease-out 0.6s both;
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
