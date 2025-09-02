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
        <a class="navbar-brand" href="#" @click.prevent="changePage('home')">
          <span class="brand-text">T-DT</span>
        </a>
        
        <button class="navbar-toggler" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="navbar-collapse" :class="{ 'show': isMenuOpen }">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'active': currentPage === 'home' }">
              <a href="#" class="nav-link" @click.prevent="changePage('home')">Home</a>
            </li>
            <li class="nav-item" :class="{ 'active': currentPage === 'about' }">
              <a href="#" class="nav-link" @click.prevent="changePage('about')">About</a>
            </li>
            <li class="nav-item" :class="{ 'active': currentPage === 'faq' }">
              <a href="#" class="nav-link" @click.prevent="changePage('faq')">FAQ</a>
            </li>
            <li class="nav-item" :class="{ 'active': currentPage === 'contact' }">
              <a href="#" class="nav-link" @click.prevent="changePage('contact')">Contact</a>
            </li>
            <li class="nav-item" :class="{ 'active': currentPage === 'joinus' }">
              <a href="#" class="nav-link" @click.prevent="changePage('joinus')">Join Us</a>
            </li>
            <li class="nav-item" :class="{ 'active': currentPage === 'login' }">
              <a href="#" class="nav-link" @click.prevent="changePage('login')">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const currentPage = ref('home')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 定义emit事件
const emit = defineEmits(['page-change'])

const changePage = (page) => {
  currentPage.value = page
  emit('page-change', page)
  isMenuOpen.value = false // 关闭移动端菜单
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
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
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
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .navbar-collapse.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .navbar-nav {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .nav-link {
    display: block;
    text-align: center;
    padding: 1rem;
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
