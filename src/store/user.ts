import { defineStore } from 'pinia'

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    username: ''
  }),
  actions: {
    setLoginState(state: boolean) {
      this.isLogin = state
      localStorage.setItem('isLogin', state ? 'true' : '')
    },
    setUsername(username: string) {
      this.username = username
      localStorage.setItem('username', username)
    },
    logout(){
      localStorage.removeItem('isLogin')
      localStorage.removeItem("username")
      
    }
    
  }
})