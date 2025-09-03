<template>
  <section class="hero-wrap-login">
    <div class="overlay"></div>
    <div class="login-container">
      <div class="login-left">
        <form class="login-box" @submit.prevent="handleLogin">
          <div class="login-title">登录</div>
          <div class="form-group">
            <label for="username">账号</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="请输入账号" 
              required
            >
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="请输入密码" 
              required
            >
          </div>
          <button type="submit" class="login-btn">登录</button>
        </form>
      </div>
      <div class="login-right">
        <div>
          <div class="third-login-title">合作账号登录</div>
          <div class="third-login-btn">
            <button 
              class="qq-btn" 
              type="button" 
              @click="handleQQLogin"
            >
              <img src="../assets/images/qq.png" alt="QQ 登录">
            </button>
            <!-- <button 
              class="qq-btn wechat" 
              type="button" 
              @click="handleWXLogin"
            >
              <img src="../assets/images/wx.png" alt="微信 登录">
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  // 处理登录逻辑
  console.log('用户名:', username.value)
  console.log('密码:', password.value)
  // 这里可以添加实际的登录API调用
}

const handleQQLogin = async () => {
  try {
    // 设置登录成功后的重定向地址为首页
    const redirectUrl = `${window.location.origin}/`
    const result = await authAPI.setLoginRedirect(redirectUrl)
    
    if (result.success) {
      // 设置成功，跳转到QQ授权页面
      const qqAuthUrl = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102805991&redirect_uri=https%3A%2F%2Fwww.neutdt.cn%2Fapi%2Foauth%2Fqq%2Fcallback&scope=get_user_info'
      window.open(qqAuthUrl, '_blank')
    } else {
      console.error('设置重定向URL失败:', result.error)
      alert('登录准备失败，请稍后重试')
    }
  } catch (error) {
    console.error('QQ登录时出错:', error)
    alert('登录失败，请稍后重试')
  }
}

const handleWXLogin = () => {
  // 微信登录处理
  console.log('微信登录')
  // 这里可以添加微信登录的逻辑
}
</script>

<style scoped>
.hero-wrap-login {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image: url('https://neutdt-1258554848.cos.ap-shanghai.myqcloud.com/image_bg_3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.login-container {
  display: flex;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: 500px;
}

.login-left {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 350px;
}

.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #adb5bd;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.login-right {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.third-login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}

.third-login-btn {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.qq-btn {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 230px;
  min-height: 48px;
  box-shadow: none;
}

.qq-btn:hover {
  transform: translateY(-2px);
  box-shadow: none;
}

.qq-btn img {
  width: 230px;
  height: 48px;
  object-fit: contain;
  margin-right: 0;
}

.qq-btn.wechat {
  background: transparent;
  box-shadow: none;
}

.qq-btn.wechat:hover {
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-left,
  .login-right {
    padding: 2rem;
  }
  
  .login-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .third-login-btn {
    gap: 1rem;
  }
  
  .qq-btn {
    min-width: 250px;
    min-height: 48px;
  }
  
  .qq-btn img {
    width: 200px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .hero-wrap-login {
    padding: 1rem;
  }
  
  .login-container {
    border-radius: 15px;
  }
  
  .login-left,
  .login-right {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group input {
    padding: 0.8rem;
  }
  
  .login-btn {
    padding: 0.8rem;
    font-size: 1rem;
  }
  
  .qq-btn {
    min-width: 220px;
    min-height: 48px;
  }
  
  .qq-btn img {
    width: 180px;
    height: 48px;
  }
}
</style>
