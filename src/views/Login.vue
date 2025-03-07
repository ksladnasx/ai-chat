<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 登录方法
const handleLogin = async () => {
  // 这里模拟登录验证，实际项目中需要替换为真实的API地址
  if (loginForm.value.username === 'whwhwh' && loginForm.value.password === '88888888') {
    try {
      // const response = await axios.post('YOUR_LOGIN_API', loginForm.value)
      userStore.setLoginState(true)
      userStore.setUsername(loginForm.value.username)
      ElMessage.success('登录成功')
      router.push('/chat')
    } catch (error) {
      ElMessage.error('登录失败，请重试')
    }
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>欢迎使用 AI 助手</h2>
      <div class="form-item">
        <input 
          v-model="loginForm.username" 
          type="text" 
          placeholder="用户名"
        >
      </div>
      <div class="form-item">
        <input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="密码"
        >
      </div>
      <button @click="handleLogin" class="login-btn">登录</button>
    </div>
  </div>
</template>

<style>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  box-sizing: border-box;
}

.login-container .login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .login-container .login-box {
    padding: 1.5rem;
    margin: 0 1rem;
  }
}

.login-container .login-box h2 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 2.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-container .login-box .form-item {
  margin-bottom: 1.5rem;
}

.login-container .login-box .form-item input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.login-container .login-box .form-item input::placeholder {
  color: #a0aec0;
}

.login-container .login-box .form-item input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-container .login-box .login-btn {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.login-container .login-box .login-btn:hover {
  background: #764ba2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.2);
}

.login-container .login-box .login-btn:active {
  transform: translateY(0);
}
</style>