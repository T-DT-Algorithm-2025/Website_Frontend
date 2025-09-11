<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import CustomAlert from './components/common/CustomAlert.vue' // 导入新的元件
import Footer from './components/Footer.vue'

const route = useRoute()

// 判断是否为个人中心页面
const isProfilePage = computed(() => route.path === '/profile')
</script>

<template>
  <div id="app">
    <!-- 在个人中心页面不显示导航栏 -->
    <Navbar v-if="!isProfilePage" />

    <main class="main-content" :class="{ 'profile-page': isProfilePage }">
      <router-view />
    </main>
    <CustomAlert /> <!-- 在这里添加元件，使其全局可用 -->

    <!-- 在个人中心页面不显示页脚 -->
    <Footer v-if="!isProfilePage" />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 0;
}

/* 个人中心页面的特殊样式 */
.main-content.profile-page {
  padding-top: 0;
  min-height: 100vh;
}
</style>
