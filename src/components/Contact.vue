<template>
  <div class="contact-page">
    <!-- Hero Banner Section -->
    <section class="hero-wrap hero-wrap-2">
      <div class="overlay"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="main-title">Contact Us</h1>
          <div class="breadcrumbs">
            <span class="breadcrumb-item">
              <a href="#home">Home</a>
              <i class="arrow-icon">→</i>
            </span>
            <span class="breadcrumb-item">Contact</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-header">
          <h2 class="section-title">Contact Information</h2>
        </div>
        
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-box">
              <div class="contact-icon">📍</div>
              <h3>Address</h3>
              <p>东北大学南湖校区科学馆301</p>
              <p>东北大学浑南校区文法学院B138</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-box">
              <div class="contact-icon">📺</div>
              <h3>Bilibili</h3>
              <p><a href="https://space.bilibili.com/441058262" target="_blank" class="contact-link">东北大学T-DT实验室</a></p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-box">
              <div class="contact-icon">✉️</div>
              <h3>Email</h3>
              <p><a href="mailto:neutdt2025@163.com" class="contact-link">neutdt2025@163.com</a></p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-box">
              <div class="contact-icon">🌐</div>
              <h3>Website</h3>
              <p><a href="#" class="contact-link">https://neutdt.cn</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Us Section -->
    <section class="join-section">
      <div class="container">
        <div class="join-content">
          <div class="heading-section">
            <span class="subheading">Join Us</span>
            <h2 class="main-heading">加入我们</h2>
          </div>
          
          <p class="join-description">
            扫描下方的二维码，关注我们的官方微信公众号以及B站官方账号，了解第一手的信息！
          </p>
          
          <div class="qr-codes">
            <div class="qr-item">
              <img 
                src="https://1-1256109820.cos.ap-chengdu.myqcloud.com/tdt/page/image/qrcode.jpg" 
                alt="微信公众号二维码" 
                class="qr-image"
              >
              <p class="qr-label">微信公众号</p>
            </div>
            
            <div class="qr-item">
              <img 
                src="https://1-1256109820.cos.ap-chengdu.myqcloud.com/tdt/page/image/qrcode.jpg" 
                alt="B站二维码" 
                class="qr-image"
              >
              <p class="qr-label">B站官方账号</p>
            </div>
          </div>
          
          <div class="recruitment-info">
            <p class="recruitment-text">
              实验室青训计划招新进行中~<br>
              欢迎各位同学加入~
            </p>
            <p class="qq-group">招新群：233424052</p>
          </div>
          
          <div class="recruitment-poster">
            <img
              src="../assets/images/zhaoxin.png"
              alt="T-DT 招新海报"
              class="poster-image"
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.contact-page {
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

/* Contact Section Styles */
.contact-section {
  background: #f8f9fa;
  padding: 4rem 0;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.contact-item {
  display: flex;
  justify-content: center;
}

.contact-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px;
}

.contact-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-box h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
}

.contact-box p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.contact-link {
  color: #f8b400;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #ff6b35;
  text-decoration: underline;
}

/* Join Section Styles */
.join-section {
  background: white;
  padding: 4rem 0;
}

.join-content {
  text-align: center;
  max-width: 900px;
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
  animation: fadeInUp 1s ease-out 0.6s both;
}

.main-heading {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.join-description {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 1s both;
}

.qr-codes {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 1.2s both;
}

.qr-item {
  text-align: center;
}

.qr-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.qr-image:hover {
  transform: scale(1.05);
}

.qr-label {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.recruitment-info {
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 1.4s both;
}

.recruitment-text {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.qq-group {
  font-size: 1.2rem;
  color: #f8b400;
  font-weight: bold;
  margin: 0;
}

.recruitment-poster {
  animation: fadeInUp 1s ease-out 1.6s both;
}

.poster-image {
  width: min(90vw, 640px);
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.poster-image:hover {
  transform: scale(1.02);
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

  .section-title {
    font-size: 2rem;
  }

  .subheading {
    font-size: 2rem;
  }

  .main-heading {
    font-size: 2.2rem;
  }

  .contact-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .contact-box {
    padding: 1.5rem;
  }

  .qr-codes {
    gap: 1rem;
  }

  .qr-image {
    width: 150px;
    height: 150px;
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

  .section-title {
    font-size: 1.8rem;
  }

  .subheading {
    font-size: 1.8rem;
  }

  .main-heading {
    font-size: 1.8rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-box {
    padding: 1rem;
  }

  .qr-codes {
    flex-direction: column;
    align-items: center;
  }

  .qr-image {
    width: 120px;
    height: 120px;
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
