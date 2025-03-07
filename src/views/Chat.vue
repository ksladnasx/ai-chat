<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import axios from 'axios'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const messages = ref<Array<{type: 'user' | 'ai', content: string}>>([])
const inputMessage = ref('')
const loading = ref(false)
const router = useRouter()
const messagesContainer = ref<HTMLElement | null>(null)

// 自动滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  messages.value.push({
    type: 'user',
    content: inputMessage.value
  })
  
  const userQuestion = inputMessage.value
  inputMessage.value = ''
  loading.value = true
  
  try {
    const response = await axios.post('YOUR_API_ENDPOINT', {
      message: userQuestion
    })
    
    messages.value.push({
      type: 'ai',
      content: response.data.reply || '抱歉，我现在无法回答这个问题。'
    })
  } catch (error) {
    messages.value.push({
      type: 'ai',
      content: '抱歉，服务出现了问题，请稍后再试。'
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// 监听消息变化
onMounted(() => {
  scrollToBottom()
})

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function logout(){
  userStore.logout()
  router.push('/login')
}


// 在script部分添加格式化方法
const formatMessageContent = (text: string) => {
  return text
    .replace(/ /g, '&nbsp;') // 转换空格
    .replace(/\n/g, '<br/>') // 转换换行
    .replace(/</g, '&lt;')   // 转义HTML标签
    .replace(/>/g, '&gt;')
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI 助手</h2>
      <div class="header-controls">
        <span class="username">{{ userStore.username }}</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message-bubble', message.type]"
      >
        <!-- 在模板部分修改消息内容渲染方式 -->
<div class="message-content" v-html="formatMessageContent(message.content)"></div>
      </div>
      <div v-if="loading" class="message-bubble ai">
        <div class="message-content loading">
          <span class="dot-flashing"></span>
        </div>
      </div>
    </div>
    
    <div class="input-area">
      <div class="input-wrapper" >
        <textarea
          v-model="inputMessage"
          @keypress="handleKeyPress"
          placeholder="输入您的问题..."
          rows="2"
        ></textarea>
        <button 
          @click="sendMessage" 
          :disabled="loading"
          class="send-btn"
          
        >
        <svg v-if="!loading" t="1741339017017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5762" ><path d="M311.04 692.224L97.28 598.5792a38.0416 38.0416 0 0 1-3.6352-67.84l799.1808-457.472a38.0416 38.0416 0 0 1 56.6272 37.7856L854.016 866.8672a37.9904 37.9904 0 0 1-53.9136 29.6448l-223.5392-105.1648L471.04 937.9328a42.752 42.752 0 0 1-77.4656-25.0368l0.6656-190.5664 387.7376-455.0144z" fill="red" p-id="5763"></path></svg>
          <div v-else class="loader"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
*{
  /* 隐藏侧边栏的滚动条 */
  scrollbar-width: none;
}
.chat-container {
  position: relative;
  left: 25%;
  height: 100vh;
  width: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  white-space: pre-wrap; 
  word-break: break-word; 
  
}

.chat-container .chat-header {
  background: #fff;
  padding: 0 24px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.chat-container .chat-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.chat-container .chat-header .header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-container .chat-header .header-controls .username {
  color: #666;
  font-size: 14px;
}

.chat-container .chat-header .header-controls .logout-btn {
  padding: 6px 12px;
  background: #e4dfdf;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-container .chat-header .header-controls .logout-btn:hover {
  background: #fe3b3b;
}

.chat-container .messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
}

.chat-container .messages-container .message-bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease-in;
}

.chat-container .messages-container .message-bubble.user {
  align-self: flex-end;
  background: #1890ff;
  color: white;
  border-radius: 12px 12px 0 12px;
}

.chat-container .messages-container .message-bubble.ai {
  align-self: flex-start;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px 12px 12px 0;
}

.chat-container .messages-container .message-bubble .message-content {
  font-size: 14px;
  line-height: 1.5;
}

.chat-container .messages-container .message-bubble .message-content.loading {
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-container .input-area {
  background: white;
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
}

.chat-container .input-area .input-wrapper {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-container .input-area .input-wrapper textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s;
}

.chat-container .input-area .input-wrapper textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.chat-container .input-area .input-wrapper .send-btn {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-container .input-area .input-wrapper .send-btn:hover {
  background: #40a9ff;
}

.chat-container .input-area .input-wrapper .send-btn:disabled {
  background: #bae7ff;
  cursor: not-allowed;
}

.chat-container .input-area .input-wrapper .send-btn .loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 100%;
  animation: rotation 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>