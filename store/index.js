import { createStore } from 'vuex'
import config from '../utils/config.js'
import { request } from '../utils/request.js'

const store = createStore({
  state() {
    let token = ''
    try {
      token = uni.getStorageSync('token')
    } catch (e) {
      token = ''
    }
    return {
      userInfo: {
        username: '未登录',
        avatar: '/static/default-avatar.png'
      },
      isLoggedIn: !!token,
      streakDays: 0,
      lastCheckIn: null,
      rewards: [],
      inspiration: '',
      checkinHistory: []
    }
  },

  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      state.isLoggedIn = true
    },

    logout(state) {
      state.userInfo = {
        username: '未登录',
        avatar: '/static/default-avatar.png'
      }
      state.isLoggedIn = false
    },

    updateStreakDays(state, days) {
      state.streakDays = days
    },

    setLastCheckIn(state, date) {
      state.lastCheckIn = date
    },

    addReward(state, reward) {
      state.rewards.push(reward)
    },

    setInspiration(state, inspiration) {
      state.inspiration = inspiration
    },

    setCheckinHistory(state, history) {
      state.checkinHistory = history
    }
  },

  actions: {
    // 用户登录
    async login({ commit }, { username, password }) {
      try {
        const response = await request({
          url: config.API.LOGIN,
          method: 'POST',
          data: { username, password }
        })

        if (response.data && response.data.token) {
          // 保存token到本地
          uni.setStorageSync('token', response.data.token)
          // 获取用户信息
          await this.dispatch('getUserInfo')
          return true
        }
        console.error('登录失败: 无效的响应数据', response.data)
        return false
      } catch (error) {
        console.error('登录失败:', error.message || error)
        return false
      }
    },

    // 用户注册
    async register({ commit }, userData) {
      try {
        const response = await request({
          url: config.API.REGISTER,
          method: 'POST',
          data: userData
        })

        if (response.data && response.data.success) {
          return true
        }
        console.error('注册失败: 无效的响应数据', response.data)
        return false
      } catch (error) {
        console.error('注册失败:', error.message || error)
        return false
      }
    },

    // 获取用户信息
    async getUserInfo({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) return false

        const response = await request({
          url: config.API.USER_INFO,
          method: 'GET',
          header: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          commit('setUserInfo', response.data.user)
          return true
        }
        return false
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return false
      }
    },

    // 打卡
    async checkIn({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) return false

        const response = await request({
          url: config.API.CHECKIN,
          method: 'POST',
          header: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          // 更新打卡状态
          await this.dispatch('getCheckinStats')
          return true
        }
        return false
      } catch (error) {
        console.error('打卡失败:', error)
        return false
      }
    },

    // 获取今日打卡状态
    async getTodayCheckin({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          console.error('获取今日打卡状态失败: 未登录')
          return false
        }

        const response = await request({
          url: config.API.CHECKIN_TODAY,
          method: 'GET',
          header: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        // 确保响应数据存在且格式正确
        if (response && response.data) {
          commit('setLastCheckIn', response.data.date)
          return !!response.data.hasCheckedIn
        }

        console.warn('获取今日打卡状态: 响应格式不正确', response)
        return false
      } catch (error) {
        console.error('获取今日打卡状态失败:', error.message || error)
        return false
      }
    },

    // 获取打卡历史
    async getCheckinHistory({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) return []

        const response = await request({
          url: config.API.CHECKIN_HISTORY,
          method: 'GET',
          header: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          commit('setCheckinHistory', response.data.history)
          return response.data.history
        }
        return []
      } catch (error) {
        console.error('获取打卡历史失败:', error)
        return []
      }
    },

    // 获取打卡统计
    async getCheckinStats({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        if (!token) return false

        const response = await request({
          url: config.API.CHECKIN_STATS,
          method: 'GET',
          header: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          commit('updateStreakDays', response.data.streakDays)
          return response.data
        }
        return false
      } catch (error) {
        console.error('获取打卡统计失败:', error)
        return false
      }
    },

    // 获取社区帖子
    async getCommunityPosts() {
      try {
        const response = await request({
          url: config.API.COMMUNITY_POSTS,
          method: 'GET'
        })

        if (response.data.success) {
          return response.data.posts
        }
        return []
      } catch (error) {
        console.error('获取社区帖子失败:', error)
        return []
      }
    },

    // 获取今日激励
    async getInspiration({ commit }) {
      try {
        const token = uni.getStorageSync('token')
        const response = await request({
          url: config.API.INSPIRATION,
          method: 'GET',
          header: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (response.data && response.data.success) {
          commit('setInspiration', response.data.inspiration)
          return response.data.inspiration
        }
        return ''
      } catch (error) {
        console.error('获取今日激励失败:', error)
        return ''
      }
    },

    // 初始化数据
    async initData({ commit, dispatch }) {
      // 检查是否有token
      const token = uni.getStorageSync('token')
      if (token) {
        // 获取用户信息
        await dispatch('getUserInfo')
        // 获取打卡统计
        await dispatch('getCheckinStats')
        // 获取今日打卡状态
        await dispatch('getTodayCheckin')
        // 获取打卡历史
        await dispatch('getCheckinHistory')
      }

      // 获取激励语
      await dispatch('getInspiration')
    }
  }
})

export default store
