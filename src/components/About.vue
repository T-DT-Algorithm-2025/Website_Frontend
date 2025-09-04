<template>
  <div class="about-page">
    <!-- Hero Banner Section -->
    <section class="hero-wrap hero-wrap-2">
      <div class="overlay"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="main-title">About</h1>
          <div class="breadcrumbs">
            <span class="breadcrumb-item">
              <a href="/">Home</a>
              <i class="arrow-icon">→</i>
            </span>
            <span class="breadcrumb-item">About</span>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="heading-section">
            <span class="subheading">About</span>
            <h2 class="main-heading">T-DT 创新实验室</h2>
          </div>
          <p class="about-description">
            东北大学T-DT创新实验室成立于2012年,历经12年,汇聚了多名来自东北大学机械自动化,
            控制工程等一流学科的优秀学生。实验室共分为机械、电控、算法、运营等四个部门,
            给学生提供了可以自我研发,自我展示的高水平平台,旨在培养出有独特主张,丰富想象力,
            超凡创造力的优秀青年工程师。实验室不断取得各项优秀成果,被校内多位领导与老师给予高度评价。
          </p>
        </div>
      </div>
    </section>

    <!-- Awards Timeline Section -->
    <section class="awards-section">
      <div class="container">
        <div class="awards-header">
          <span class="subheading">Prize</span>
          <h2 class="main-heading">历年奖项</h2>
        </div>
        
        <div class="horizontal-timeline">
          <div class="timeline-track">
            <div class="timeline-item" 
                 v-for="(award, index) in awards" 
                 :key="index"
                 @mouseenter="selectAward(index)"
                 :class="{ 'active': selectedAward === index }">
              <div class="timeline-dot"></div>
              <div class="timeline-year">{{ award.year }}</div>
            </div>
          </div>
          
          <div class="timeline-details" v-if="selectedAward !== null">
            <div class="detail-card">
              <div class="detail-header">
                <h3>{{ awards[selectedAward].year }}</h3>
              </div>
              <div class="detail-content">
                <h4>{{ awards[selectedAward].title }}</h4>
                <p>{{ awards[selectedAward].description }}</p>
              </div>
            </div>
          </div>
          
          <div class="timeline-info" v-if="selectedAward === null">
            <p>鼠标悬停上方年份查看详细获奖信息</p>
          </div>
        </div>

        <div class="video-section">
          <a href="#" class="video-button">
            <span class="play-icon">▶</span>
            <span class="video-text">观看视频</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="overlay"></div>
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">12</div>
            <div class="stat-label">成立年份</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">20+</div>
            <div class="stat-label">获奖次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">冠军</div>
            <div class="stat-label">最高名次</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">6+</div>
            <div class="stat-label">合作企业</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedAward = ref(null)

const awards = [
  {
    year: '2016',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '八强'
  },
  {
    year: '2017',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '一等奖'
  },
  {
    year: '2017',
    title: 'ICRA国际技术挑战赛',
    description: '冠军'
  },
  {
    year: '2018',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '亚军'
  },
  {
    year: '2019',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '冠军'
  },
  {
    year: '2020',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '冠军'
  },
  {
    year: '2021',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '四强'
  },
  {
    year: '2022',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '一等奖'
  },
  {
    year: '2022',
    title: 'ICRA国际技术挑战赛',
    description: '第三名'
  },
  {
    year: '2023',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '亚军'
  },
  {
    year: '2024',
    title: 'RoboMaster全国大学生机器人大赛',
    description: '季军'
  },
  {
    year: '2024',
    title: 'RoboMaster南部区域赛',
    description: '亚军'
  }
]

const selectAward = (index) => {
  selectedAward.value = index
}

onMounted(() => {
  // 默认显示最新的奖项（最后一个）
  selectedAward.value = awards.length - 1
})
</script>

<style scoped>
.about-page {
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

/* About Section Styles */
.about-section {
  background: white;
  padding: 4rem 0;
}

.about-content {
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
  animation: fadeInUp 1s ease-out 0.2s both;
}

.main-heading {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.about-description {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  text-align: justify;
  animation: fadeInUp 1s ease-out 0.6s both;
}

/* Horizontal Timeline Styles */
.horizontal-timeline {
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.timeline-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.timeline-track::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  transform: translateY(-50%);
  z-index: 1;
}

.timeline-item {
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-width: 80px;
  padding: 1rem 0.5rem; /* 增大悬停触发区域 */
}

.timeline-item:hover {
  transform: translateY(-5px);
}

.timeline-item.active {
  transform: translateY(-8px);
}

.timeline-dot {
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #f8b400;
  border-radius: 50%;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 4px rgba(248, 180, 0, 0.3);
}

.timeline-item:hover .timeline-dot {
  background: #f8b400;
  transform: scale(1.2);
}

.timeline-item.active .timeline-dot {
  background: #f8b400;
  transform: scale(1.3);
  box-shadow: 0 0 0 8px rgba(248, 180, 0, 0.6);
}

.timeline-year {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.timeline-item:hover .timeline-year {
  color: #f8b400;
}

.timeline-item.active .timeline-year {
  color: #f8b400;
}

/* Timeline Details */
.timeline-details {
  margin-top: 2rem;
  animation: slideInUp 0.5s ease-out;
}

.detail-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
}

.detail-header {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.detail-content {
  padding: 2rem;
}

.detail-content h4 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1rem 0;
}

.detail-content p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.timeline-info {
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(248, 180, 0, 0.1);
  border-radius: 12px;
  border: 2px dashed rgba(248, 180, 0, 0.3);
}

.timeline-info p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Video Section */
.video-section {
  text-align: center;
  margin-top: 3rem;
}

.video-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.video-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
}

.play-icon {
  font-size: 1.2rem;
}

/* Statistics Section Styles */
.stats-section {
  position: relative;
  background-image: url('https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_4.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 4rem 0;
  color: white;
}

.stats-section .overlay {
  background: rgba(0, 0, 0, 0.6);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  animation: fadeInUp 1s ease-out 1s both;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(248, 180, 0, 0.5);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #f8b400;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}

.stat-label {
  font-size: 1.1rem;
  color: white;
  font-weight: 500;
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

  .timeline-track {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .timeline-item {
    min-width: 60px;
  }

  .timeline-track::before {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-item {
    padding: 1.5rem;
  }

  .stat-number {
    font-size: 2.5rem;
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

  .timeline-track {
    flex-direction: column;
    gap: 1.5rem;
  }

  .timeline-item {
    min-width: auto;
  }

  .timeline-track::before {
    display: block;
    width: 3px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
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
