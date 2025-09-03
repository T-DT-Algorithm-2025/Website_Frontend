<template>
  <div>
    <HomeSlider />

    <!-- 其他内容区域 -->
    <section class="content-section">
      <div class="container">
        <h2>欢迎来到 T-DT</h2>
        <p>打造现代化、炫酷、美观的网站体验</p>
        <div class="button-group">
          <router-link to="/about" class="cta-button">关于我们</router-link>
          <router-link to="/joinus" class="cta-button secondary">加入我们</router-link>
          <router-link to="/faq" class="cta-button accent">常见问题</router-link>
          <router-link to="/contact" class="cta-button info">联系我们</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HomeSlider from '../components/HomeSlider.vue'
</script>

<style scoped>
.content-section {
  padding: 4rem 0;
  background: #f8f9fa;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-section h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.content-section p {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.cta-button:first-child {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.cta-button:first-child:hover {
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
}

.cta-button.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.cta-button.secondary:hover {
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

.cta-button.accent {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.cta-button.accent:hover {
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.cta-button.info {
  background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
  box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
}

.cta-button.info:hover {
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.4);
}

@media (max-width: 768px) {
  .content-section {
    padding: 2rem 0;
  }

  .content-section h2 {
    font-size: 2rem;
  }

  .content-section p {
    font-size: 1rem;
  }

  .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .content-section h2 {
    font-size: 1.8rem;
  }

  .content-section p {
    font-size: 0.9rem;
  }

  .cta-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
