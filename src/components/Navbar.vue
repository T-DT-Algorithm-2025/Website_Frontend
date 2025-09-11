<template>
  <div class="navbar-wrapper">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="container">
        <div class="top-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="icon">
                <span class="icon-paper-plane">✉️</span>
              </div>
              <span class="text">neu_tdt@163.com</span>
            </div>
          </div>
          
          <div class="links-section">
            <p class="mb-0 register-link">
              <span>友情链接：</span>
              <a href="https://www.robomaster.com/zh-CN" target="_blank">RoboMaster机甲大师</a>
              <span class="separator">&#8194;&#8194;&#8194;</span>
              <a href="https://neu.edu.cn" target="_blank">东北大学</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <nav class="main-navbar">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <span class="brand-text">T-DT</span>
        </router-link>
        
        <button class="navbar-toggler" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="navbar-collapse" :class="{ 'show': isMenuOpen }">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'active': $route.path === '/' }">
              <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
            </li>
            <li class="nav-item" :class="{ 'active': $route.path === '/about' }">
              <router-link to="/about" class="nav-link" @click="closeMenu">About</router-link>
            </li>
            <li class="nav-item" :class="{ 'active': $route.path === '/faq' }">
              <router-link to="/faq" class="nav-link" @click="closeMenu">FAQ</router-link>
            </li>
            <li class="nav-item" :class="{ 'active': $route.path === '/contact' }">
              <router-link to="/contact" class="nav-link" @click="closeMenu">Contact</router-link>
            </li>
            <li class="nav-item" :class="{ 'active': $route.path === '/joinus' }">
              <router-link to="/joinus" class="nav-link" @click="closeMenu">Join Us</router-link>
            </li>
            <!-- 根据登录状态显示登录链接或用户头像 -->
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link to="/login" class="nav-link" @click="closeMenu">Login</router-link>
            </li>
            <li class="nav-item" v-else>
              <UserAvatar @logout="handleLogout" @login-success="handleLoginSuccess" @click="closeMenu" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserAvatar from './UserAvatar.vue'
import { authAPI } from '../api/auth.js'

const route = useRoute()
const isMenuOpen = ref(false)
const isLoggedIn = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}

// 点击外部区域关闭菜单
const handleClickOutside = (event) => {
  const navbar = event.target.closest('.navbar-wrapper')
  if (!navbar && isMenuOpen.value) {
    closeMenu()
  }
}

// 检查用户登录状态
const checkLoginStatus = async () => {
  try {
    const result = await authAPI.getUserInfo()
    isLoggedIn.value = result.success
  } catch (error) {
    console.error('检查登录状态失败:', error)
    isLoggedIn.value = false
  }
}

// 监听路由变化，重新检查登录状态
watch(route, async (newRoute) => {
  // 当从登录页面跳转到其他页面时，重新检查登录状态
  if (newRoute.path !== '/login' && newRoute.path !== '/register') {
    await checkLoginStatus()
  }
}, { immediate: false })

// 组件挂载时检查登录状态并添加事件监听
onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 处理登出事件
const handleLogout = () => {
  isLoggedIn.value = false
  closeMenu() // 登出时关闭菜单
}

// 处理登录成功事件
const handleLoginSuccess = () => {
  isLoggedIn.value = true
}
</script>

<style scoped>
.navbar-wrapper {
  position: absolute; /* 绝对定位，覆盖在轮播图上面 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 保持高z-index，确保在轮播图上层 */
}

/* 顶部信息栏样式 */
.top-bar {
  background: rgba(26, 26, 26, 0.8); /* 半透明背景 */
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.contact-info {
  display: flex;
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.text {
  color: #fff;
  font-size: 0.875rem;
}

.links-section {
  display: flex;
  align-items: center;
}

.register-link {
  color: #fff;
  font-size: 0.875rem;
  margin: 0;
}

.register-link span {
  color: #ccc;
}

.register-link a {
  color: #f8b400;
  text-decoration: none;
  transition: color 0.3s ease;
  margin: 0 0.5rem;
}

.register-link a:hover {
  color: #ff6b35;
  text-decoration: underline;
}

.separator {
  color: #666;
}

/* 主导航栏样式 */
.main-navbar {
  background: transparent; /* 全透明背景 */
  padding: 1rem 0;
  box-shadow: none; /* 移除阴影 */
}

.main-navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  text-decoration: none;
}

.brand-text {
  font-family: 'ROBOTECH GP', 'Robotech', 'Arial', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg,rgb(255, 241, 183) 0%, #ffe789 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(248, 180, 0, 0.3);
}

.navbar-toggler {
  display: none;
  flex-direction: column;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 4px;
}

.navbar-toggler span {
  width: 25px;
  height: 3px;
  background: #f8b400;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.navbar-toggler.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-toggler.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggler.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.navbar-collapse {
  display: flex;
  align-items: center;
}

.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px; /* 固定高度确保一致对齐 */
  min-height: 44px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1.4; /* 确保文本垂直居中 */
}

.nav-link:hover {
  color: #f8b400;
  transform: translateY(-2px);
}

.nav-item.active .nav-link {
  color: #f8b400;
  background: rgba(248, 180, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .navbar-toggler {
    display: flex;
    z-index: 1003; /* 确保按钮在菜单之上 */
    position: relative;
    min-width: 44px; /* 最小触摸目标 */
    min-height: 44px;
    justify-content: center;
    align-items: center;
  }
  
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(51, 51, 51, 0.95); /* 半透明背景 */
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden; /* 隐藏时不可交互 */
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1002; /* 确保在其他元素之上 */
  }
  
  .navbar-collapse.show {
    transform: translateY(0);
    opacity: 1;
    visibility: visible; /* 显示时可交互 */
  }
  
  .navbar-nav {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .nav-item {
    height: auto; /* 移动端允许自适应高度 */
    min-height: 40px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    height: auto;
    min-height: 44px; /* 最小触摸目标 */
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .nav-link:hover,
  .nav-link:active {
    background: rgba(248, 180, 0, 0.2);
    transform: none; /* 移动端不使用 translateY */
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .register-link {
    font-size: 0.75rem;
  }
  
  .links-section {
    text-align: center;
  }
}

/* 确保字体加载 */
@font-face {
  font-family: 'ROBOTECH GP';
  src: url('../assets/fonts/ROBOTECH_GP.ttf') format('truetype');
  font-display: swap;
}
</style>
