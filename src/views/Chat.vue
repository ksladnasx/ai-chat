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
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
      <div v-if="loading" class="message-bubble ai">
        <div class="message-content loading">
          <span class="dot-flashing"></span>
        </div>
      </div>
    </div>
    
    <div class="input-area">
      <div class="input-wrapper">
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
          <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <div v-else class="loader"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;

  .chat-header {
    background: #fff;
    padding: 0 24px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

    h2 {
      margin: 0;
      font-size: 18px;
      color: #1a1a1a;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 16px;

      .username {
        color: #666;
        font-size: 14px;
      }

      .logout-btn {
        padding: 6px 12px;
        background: #f5f5f5;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #eee;
        }
      }
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fafafa;

    .message-bubble {
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 12px;
      animation: fadeIn 0.3s ease-in;

      &.user {
        align-self: flex-end;
        background: #1890ff;
        color: white;
        border-radius: 12px 12px 0 12px;
      }

      &.ai {
        align-self: flex-start;
        background: white;
        border: 1px solid #e8e8e8;
        border-radius: 12px 12px 12px 0;
      }

      .message-content {
        font-size: 14px;
        line-height: 1.5;
        
        &.loading {
          color: #999;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }
  }

  .input-area {
    background: white;
    padding: 16px 24px;
    border-top: 1px solid #e8e8e8;

    .input-wrapper {
      position: relative;
      display: flex;
      gap: 12px;
      align-items: flex-end;

      textarea {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        resize: none;
        font-size: 14px;
        line-height: 1.5;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }

      .send-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1890ff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        color: white;

        &:hover {
          background: #40a9ff;
        }

        &:disabled {
          background: #bae7ff;
          cursor: not-allowed;
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid #fff;
          border-bottom-color: transparent;
          border-radius: 50%;
          animation: rotation 1s linear infinite;
        }
      }
    }
  }
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