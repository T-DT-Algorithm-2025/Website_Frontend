<template>
  <section class="hero-wrap-login">
    <div class="overlay"></div>
    <div class="login-container">
      <div class="login-left">
        <div class="login-box">
          <div class="login-title">注册</div>
          
          <!-- 邮箱注册表单 -->
          <form @submit.prevent="handleRegister" v-if="!loading">
            <div class="form-group">
              <label for="email">邮箱地址</label>
              <IInput
                type="email"
                id="email"
                v-model="email"
                placeholder="请输入邮箱地址"
                required
                :disabled="verificationSent"
              />
            </div>
            
            <div class="form-group">
              <label for="password">设置密码</label>
              <IInput
                type="password"
                id="password"
                v-model="password"
                placeholder="请设置登录密码"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">确认密码</label>
              <IInput
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="请再次输入密码"
                required
              />
            </div>

            <!-- 验证码部分 -->
            <div class="verification-section" v-if="verificationSent">
              <div class="form-group">
                <label for="verificationCode">验证码</label>
                <IInput
                  type="text"
                  id="verificationCode"
                  v-model="verificationCode"
                  placeholder="请输入6位验证码"
                  required
                  maxlength="6"
                />
              </div>
              
              <InteractiveHoverButton
                :text="registerButtonText"
                class="register-btn"
                :disabled="!canRegister"
                @click="handleRegister"
              />
            </div>

            <!-- 发送验证码按钮 -->
            <InteractiveHoverButton
              v-if="!verificationSent"
              :text="sendCodeButtonText"
              class="send-code-btn"
              :disabled="!canSendCode || codeCooldown > 0"
              @click="handleSendCode"
            />
          </form>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>{{ loadingText }}</p>
          </div>

          <!-- 倒计时显示 -->
          <div v-if="codeCooldown > 0" class="cooldown-text">
            {{ codeCooldown }}秒后可重新发送
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- 登录链接 -->
          <div class="login-link">
            已有账号？<router-link to="/login" class="link">立即登录</router-link>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div>
          <div class="third-login-title">注册说明</div>
          <div class="register-description">
            <p>欢迎加入我们的平台！</p>
            <p>请使用有效的邮箱地址进行注册，验证码将发送至该邮箱。</p>
            <p>注册成功后将自动登录并跳转到个人资料页面。</p>
            <p>密码长度建议不少于6位，包含字母和数字。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth.js'
import IInput from '@/components/inspira/IInput.vue'
import InteractiveHoverButton from '@/components/inspira/InteractiveHoverButton.vue'

import { useAlert } from '@/composables/useAlert'
const { showAlert } = useAlert()

const router = useRouter()

// 响应式数据
const loading = ref(false)
const loadingText = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
const verificationSent = ref(false)
const errorMessage = ref('')
const codeCooldown = ref(0)
const isRegistering = ref(false)

let cooldownTimer = null

// 计算属性
const canSendCode = computed(() => {
  return email.value && 
         password.value && 
         confirmPassword.value &&
         email.value.includes('@') && 
         password.value === confirmPassword.value &&
         password.value.length >= 6 &&
         !loading.value
})

const canRegister = computed(() => {
  return verificationCode.value && 
         verificationCode.value.length === 6 && 
         !isRegistering.value &&
         password.value === confirmPassword.value
})

const sendCodeButtonText = computed(() => {
  if (codeCooldown.value > 0) {
    return `发送验证码 (${codeCooldown.value}s)`
  }
  return '发送验证码'
})

const registerButtonText = computed(() => {
  return isRegistering.value ? '注册中...' : '确认注册'
})

// 页面卸载时清理定时器
onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
  }
})

// 发送验证码
async function handleSendCode() {
  if (!canSendCode.value) {
    validateForm()
    return
  }

  errorMessage.value = ''
  loading.value = true
  loadingText.value = '发送验证码中...'

  try {
    const result = await authAPI.sendVerificationCode(email.value)
    
    if (result.success) {
      verificationSent.value = true
      startCooldown()
      showAlert('验证码已发送，请查收邮箱', 'success')
    } else {
      errorMessage.value = result.error || '发送验证码失败'
    }
  } catch (error) {
    console.error('发送验证码时出错:', error)
    errorMessage.value = '发送验证码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 处理注册
async function handleRegister() {
  if (!verificationSent.value) {
    await handleSendCode()
    return
  }

  if (!canRegister.value) {
    validateForm()
    return
  }

  errorMessage.value = ''
  isRegistering.value = true

  try {
    const result = await authAPI.registerWithEmail(
      email.value,
      password.value,
      verificationCode.value
    )
    
    if (result.success) {
      showAlert('注册成功！欢迎加入我们！', 'success')
      // 注册成功后，用户已经自动登录，跳转到首页
      // 首页的导航栏会自动检测登录状态并显示头像
      router.push('/')
    } else {
      errorMessage.value = result.error || '注册失败'
    }
  } catch (error) {
    console.error('注册时出错:', error)
    errorMessage.value = '注册失败，请稍后重试'
  } finally {
    isRegistering.value = false
  }
}

// 表单验证
function validateForm() {
  if (!email.value) {
    errorMessage.value = '请输入邮箱地址'
    return
  }

  if (!email.value.includes('@')) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }

  if (!password.value) {
    errorMessage.value = '请设置密码'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密码长度不能少于6位'
    return
  }

  if (!confirmPassword.value) {
    errorMessage.value = '请确认密码'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (verificationSent.value && (!verificationCode.value || verificationCode.value.length !== 6)) {
    errorMessage.value = '请输入6位验证码'
    return
  }
}

// 启动倒计时
function startCooldown() {
  codeCooldown.value = 60
  cooldownTimer = setInterval(() => {
    codeCooldown.value--
    if (codeCooldown.value <= 0) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
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

.verification-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.send-code-btn,
.register-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  color: white !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  margin-top: 1rem;
}

.send-code-btn:hover,
.register-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3) !important;
}

.send-code-btn:active,
.register-btn:active {
  transform: translateY(0) !important;
}

.send-code-btn:disabled,
.register-btn:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.loading-container {
  text-align: center;
  padding: 2rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 1rem;
}

.cooldown-text {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #fcc;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.login-link .link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link .link:hover {
  text-decoration: underline;
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

.register-description {
  color: #555;
  line-height: 1.6;
}

.register-description p {
  margin-bottom: 1rem;
  font-size: 0.95rem;
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
}
</style>
