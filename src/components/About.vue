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
            T-DT机器人创新团队( Thinking - Doing to Theory )是东北大学创新创业学院下辖的创新团队之一，成立于2012年，汇聚了东北大学包括机械，信息，计算机和软件在内的各个学院的优秀学生。团队共分为机械、电控、算法、运营等四个部门和七个技术兵种组，给学生提供了可以自我研发，自我展示的平台，旨在培养出有独特主张，丰富想象力，超凡创造力的优秀青年工程师。自成立以来，团队技术成果丰硕，多次在国际级和国家级竞赛中斩获冠军，被莅临参观的校内外各级领导与老师给予高度评价。
          </p>
        </div>
      </div>
    </section>
    <component is="script">
        console.log("P")
    </component>
    <!-- Awards Timeline Section
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
    </section> -->
    <div class="h-fit w-full">
    <Timeline
      :items="data"
      title="历年获奖记录"
      description="T-DT团队自2015年以来的辉煌成就"
    >
      <template
        v-for="(item, index) in data"
        :key="item.id + 'template'"
        #[item.id]
      >
        <div class="relative w-full pl-20 pr-4 md:pl-4">
          <div class="mb-4">
            <ul class="space-y-2">
              <li
                v-for="(award, awardIndex) in item.awards"
                :key="awardIndex"
                class="flex items-start"
              >
                <span class="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-sm text-neutral-700 dark:text-neutral-300">{{ award }}</span>
              </li>
            </ul>
          </div>
        </div>
        <p v-if="item.detail" class="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200 italic text-gray-500">
          {{ item.detail }}
        </p>
      </template>
    </Timeline>
  </div>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Timeline from "../components/inspira/Timeline.vue";
const selectedAward = ref(null)
const data = [
  {
    id: "2015",
    label: "2015年",
    awards: [
      "全国互联网+大学生创新创业竞赛全国金奖",
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 小组赛 二等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（东北赛区） 冠军 一等奖",
      "挑战杯全国大学生课外学术科技作品竞赛三等奖"
    ],
    detail: ""
  },
  {
    id: "2016",
    label: "2016年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 八强 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 冠军 一等奖"
    ],
    detail: ""
  },
  {
    id: "2017",
    label: "2017年",
    awards: [
      "IEEE-ICRA国际机器人技术挑战赛世界冠军、特别大奖",
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 八强 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 亚军 一等奖"
    ],
    detail: ""
  },
  {
    id: "2018",
    label: "2018年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 国际亚军 特等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 八强 一等奖"
    ],
    detail: ""
  },
  {
    id: "2019",
    label: "2019年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 国际冠军 特等奖",
      "ICRA 2019 RoboMaster人工智能挑战赛 国际殿军 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 冠军 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师单项赛 步兵竞速与射击 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师单项赛 英雄远程射击 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师单项赛 工程攀岛取弹 一等奖"
    ],
    detail: "T-DT首次获得RoboMaster超级对抗赛冠军"
  },
  {
    id: "2020",
    label: "2020年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 冠军 一等奖"
    ],
    detail: "疫情原因，2020年采取线上评审比赛"
  },
  {
    id: "2021",
    label: "2021年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 殿军 一等奖",
      "ICRA 2021 RoboMaster人工智能挑战赛 八强 二等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 亚军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）3V3对抗赛 冠军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）步兵对抗赛 亚军 一等奖"
    ],
    detail: ""
  },
  {
    id: "2022",
    label: "2022年",
    awards: [
      "ICRA 2022 RoboMaster人工智能挑战赛 八强 二等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（南部赛区） 冠军 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师高校单项赛 步兵竞速与射击 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师高校单项赛 （平衡）步兵竞速与射击 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师高校单项赛 工程取矿 一等奖",
      "全国大学生机器人大赛RoboMaster机甲大师高校单项赛 英雄远程射击 二等奖",
      "全国大学生机器人大赛RoboMaster机甲大师高校单项赛 飞镖打靶 二等奖"
    ],
    detail: "由于疫情，部分比赛当年未举办，由区域赛成绩获评"
  },
  {
    id: "2023",
    label: "2023年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 亚军 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（北部赛区） 冠军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）3V3对抗赛 冠军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）步兵对抗赛 冠军 一等奖",
      "全国大学生机器人科技创新交流营暨机器人大赛 特等奖",
      "全国大学生智能车竞赛中获全国总决赛智慧巡检（高教组）比赛 一等奖"
    ],
    detail: ""
  },
  {
    id: "2024",
    label: "2024年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 季军 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（南部赛区） 亚军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）3V3对抗赛 季军 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）步兵对抗赛 殿军 一等奖",
      "全国大学生智能车竞赛中获全国总决赛智慧巡检（高教组）比赛 一等奖"
    ],
    detail: ""
  },
  {
    id: "2025",
    label: "2025年",
    awards: [
      "全国大学生机器人大赛RoboMaster机甲大师超级对抗赛 殿军 一等奖",
      "RoboMaster机甲大师超级对抗赛区域赛（东部赛区） 八强 一等奖",
      "RoboMaster机甲大师高校联盟赛（辽宁站）3V3对抗赛 冠军 一等奖"
    ],
    detail: ""
  }
];
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
