<template>
  <section class="home-slider">
    <swiper
      :modules="[Navigation, Pagination, Autoplay, EffectFade]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :effect="'fade'"
      :fadeEffect="{ crossFade: true }"
      :speed="1000"
      navigation
      pagination
      class="swiper-container"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <div
          class="slider-item"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="overlay"></div>
          <div class="container">
            <div class="slider-text">
              <div class="text-content">
                <h1 class="mb-4 mt-5">
                  <span class="text-line">{{ slide.textLine1 }}</span>
                  <br>
                  <span class="text-line">{{ slide.textLine2 }}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
  {
    image: 'https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_1.jpg',
    textLine1: '理想臣服实践',
    textLine2: '勤恳铸就巅峰'
  },
  {
    image: 'https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_2.jpg',
    textLine1: '狭路相逢',
    textLine2: '勇者胜'
  },
  {
    image: 'https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_3.jpg',
    textLine1: '敢热爱',
    textLine2: '你就来'
  }
]
</script>

<style scoped>
.home-slider {
  position: relative;
  height: 100vh;
  width: 100%;
  margin-top: 0; /* 从页面顶部开始 */
  z-index: 1; /* 确保在导航栏下方 */
}

.swiper-container {
  height: 100%;
  width: 100%;
}

.slider-item {
  position: relative;
  height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0; /* 不需要为导航栏留空间 */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.slider-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.text-content {
  max-width: 800px;
}

h1 {
  font-size: 4rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  margin: 0;
}

.text-line {
  font-family: 'YunFengJingLongXingShu', '华文行楷', '楷体', serif;
  display: inline-block;
  animation: fadeInUp 1s ease-out;
  opacity: 1; /* 确保字体不透明 */
}

.text-line:nth-child(2) {
  animation-delay: 0.3s;
}

/* Swiper 自定义样式 */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 20px;
  font-weight: bold;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: #fff;
  transform: scale(1.2);
}

:deep(.swiper-pagination) {
  bottom: 30px;
}

/* 动画效果 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 40px;
    height: 40px;
  }
  
  :deep(.swiper-button-next::after),
  :deep(.swiper-button-prev::after) {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  
  .slider-item {
    height: 100vh;
  }
}

/* 确保字体加载 */
@font-face {
  font-family: 'YunFengJingLongXingShu';
  src: url('../assets/fonts/YunFengJingLongXingShu.ttf') format('truetype');
  font-display: swap;
}
</style>
