import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosservice from '../utils/axios'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import UserInfo from '../types/types';

const router = useRouter()

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: ref<UserInfo>({
      userId: -1,
      username: "",
      avatarUrl: "",
      email: "",
      sex: ""
    })

  }),
  actions: {
    async login(username: string, password: string) {
      //测试数据
      if (username === "doctor@126.com" && password === "password") {
        const userInfo: UserInfo = {
          userId: 23232323,
          username: '张康',
          email: 'doctor@126.com',
          sex: '男',
          avatarUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.JCEcaQJVR_vC2kgt6BGZlAAAAA?rs=1&pid=ImgDetMain',
        };
        this.userInfo = userInfo  
        localStorage.setItem('user', JSON.stringify(userInfo));
        sessionStorage.setItem('accessToken', JSON.stringify("accessToken"))
        sessionStorage.setItem('refreshToken', JSON.stringify("refreshToken"))
        ElMessage.success("登录成功")
        return

      }
      try {
        const res = await axiosservice.post("/login", {
          username,
          password
        })
        this.userInfo = res.data.data
        localStorage.setItem("userInfo", res.data.data)
        sessionStorage.setItem("accessToken", res.data.accessToken)
        sessionStorage.setItem("refreshToken", res.data.refreshToken)
        ElMessage.success("登录成功")

      } catch (error) {
        console.log(error)
        ElMessage.error("登录失败")
      }
    },
    async logout() {
      localStorage.removeItem("userInfo")
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("refreshToken")
      // ElMessage.success("退出成功")
      router.push("/login")
      const res = await axiosservice.post("/logout", {
        accessToken: sessionStorage.getItem("accessToken"),
        refreshToken: sessionStorage.getItem("refreshToken")
      });


      if (res.data.code === 200) {
        ElMessage.success("退出成功")
      }
    },

    updateUserInfo(){
      const userInfo = localStorage.getItem("userInfo")
      if(userInfo){
        this.userInfo = JSON.parse(userInfo)
      }

    }

  }
})