<template>
  <div class="relative w-full h-screen overflow-hidden bg-black/[0.96]">
     <!-- 居中部分文字内容 -->
     <div class="absolute inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
       <div class="mx-auto text-center hero-content">
          <div class="text-4xl font-bold text-white tracking-wide hero-title">
            T-DT 2026 青训计划 <br> 
            <span class="text-3xl font-normal mt-2 inline-block hero-subtitle">现在加入：</span>
            <FlipWords
              :words="['机械组', '算法组', '电控组', '运营组']"
              :duration="3000"
              class="text-3xl !text-yellow-400 font-bold hero-flipwords"
            />
            
          </div>
          <div class="mt-6 hero-button pointer-events-auto">
              <InteractiveHoverButton
                text="立即投递"
                class="recruitment-btn"
                @click="handleJoinClick"
              />
            </div>
       </div>
       
     </div>
     
    
    <!-- Spline 3D 场景占满整个页面，主要展示在下半部分 -->
    <div class="absolute top-0 left-0 w-full h-full">
      <Spline
        :scene="sceneUrl"
        class="w-full h-full"
      />
    </div>
    
    <!-- 渐变遮罩，让上半部分文字更清晰 -->
    <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-5"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Spline from './inspira/Spline.vue'
import FlipWords from './inspira/FlipWords.vue'
import InteractiveHoverButton from './inspira/InteractiveHoverButton.vue'

const router = useRouter()
const sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const handleJoinClick = () => {
  // 跳转到profile页面的管理投递tab
  router.push({ 
    path: '/profile',
    query: { tab: 'applications' }
  })
}
</script>

<style scoped>
/* 增强文字可见性 */
.text-white {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
}

/* 按钮样式 */
.recruitment-btn {
  transform: scale(1.1);
  transition: all 0.3s ease;
}

/* 渐变出场动画 */
.hero-content {
  animation: fadeInUp 2s ease-out 2s both;
}

.hero-title {
  animation: fadeInUp 1s ease-out 1.2s both;
}

.hero-subtitle {
  animation: fadeInUp 1s ease-out 1.4s both;
}

.hero-flipwords {
  animation: fadeInUp 1s ease-out 1.6s both;
}

.hero-button {
  animation: fadeInUp 1s ease-out 1.8s both;
}

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
  .text-4xl {
    font-size: 2.5rem !important;
  }
  
  .text-3xl {
    font-size: 2rem !important;
  }
  
  .recruitment-btn {
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .text-4xl {
    font-size: 2rem !important;
  }
  
  .text-3xl {
    font-size: 1.5rem !important;
  }
}
</style>
