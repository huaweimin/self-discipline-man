<template>
  <view class="container">
    <view class="header">
      <text class="title">自律打卡</text>
      <view class="user-info" v-if="isLoggedIn" :class="{ 'center-username': !userInfo.avatar }">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" v-if="userInfo.avatar"></image>
        <text class="username">{{ userInfo.username }}</text>
      </view>
    </view>

    <view class="content" v-if="isLoggedIn">
      <view class="card">
        <view class="streak-count">
          <text class="number">{{ streakDays }}</text>
          <text class="label">连续自律天数</text>
        </view>
        <button class="check-in-btn" @tap="handleCheckIn" :disabled="isTodayCheckedIn">
          {{ isTodayCheckedIn ? '今日已打卡' : '今天打卡' }}
        </button>
      </view>

      <view class="reward-card">
        <text class="reward-text">再坚持 {{ daysUntilReward }} 天获得奖励</text>
        <view class="progress-bar">
          <view class="progress" :style="{ width: progressWidth + '%' }"></view>
        </view>
      </view>

      <view class="inspiration-card" v-if="inspiration">
        <text class="inspiration-title">今日激励</text>
        <text class="inspiration-content">{{ inspiration }}</text>
      </view>
    </view>

    <view class="login-tip" v-else>
      <text>正在跳转到登录页面...</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      isTodayCheckedIn: false,
      daysUntilReward: 3,
      progressWidth: 75
    }
  },
  computed: {
    ...mapState(['userInfo', 'isLoggedIn', 'streakDays', 'inspiration'])
  },
  onLoad() {
    this.initData()
    this.checkLoginStatus()
  },
  onShow() {
    // 只检查打卡状态，避免循环跳转
    this.checkTodayCheckin()
  },
  methods: {
    ...mapActions(['initData', 'checkIn', 'getTodayCheckin']),

    checkLoginStatus() {
      if (!this.isLoggedIn) {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    },

    async handleCheckIn() {
      if (this.isTodayCheckedIn) return

      const success = await this.checkIn()
      if (success) {
        uni.showToast({
          title: '打卡成功',
          icon: 'success'
        })
        await this.checkTodayCheckin()
      } else {
        uni.showToast({
          title: '打卡失败，请稍后再试',
          icon: 'none'
        })
      }
    },

    async checkTodayCheckin() {
      if (this.isLoggedIn) {
        this.isTodayCheckedIn = await this.getTodayCheckin()
      }
    }
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  background-color: #e0f5f1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 36rpx;
    color: #2c3e50;
    text-align: center;
    font-weight: bold;
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-top: 20rpx;

    &.center-username {
      justify-content: center;
    }

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }

    .username {
      margin-left: 20rpx;
      font-size: 32rpx;
      color: #2c3e50;
    }

    &.center-username .username {
      margin-left: 0;
    }
  }

}

.content {
  width: 100%;

  .card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 40rpx;
    margin: 20rpx;
    text-align: center;

    .streak-count {
      .number {
        font-size: 80rpx;
        color: #16a085;
        font-weight: bold;
      }

      .label {
        font-size: 28rpx;
        color: #7f8c8d;
        margin-top: 10rpx;
      }
    }

    .check-in-btn {
      margin-top: 40rpx;
      background-color: #16a085;
      color: #ffffff;
      border-radius: 40rpx;
      padding: 20rpx 0;
      font-size: 32rpx;

      &[disabled] {
        background-color: #95a5a6;
        color: #ecf0f1;
      }
    }
  }

  .reward-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 20rpx;

    .reward-text {
      font-size: 28rpx;
      color: #7f8c8d;
    }

    .progress-bar {
      height: 20rpx;
      background-color: #ecf0f1;
      border-radius: 10rpx;
      margin-top: 20rpx;
      overflow: hidden;

      .progress {
        height: 100%;
        background-color: #16a085;
        transition: width 0.3s ease;
      }
    }
  }
}


.login-tip {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin: 50rpx 0;
  text-align: center;
  color: #7f8c8d;
  font-size: 32rpx;
}



.inspiration-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 0;

  .inspiration-title {
    font-size: 28rpx;
    color: #7f8c8d;
    display: block;
    margin-bottom: 10rpx;
  }

  .inspiration-content {
    font-size: 32rpx;
    color: #2c3e50;
    line-height: 1.5;
  }
}
</style>
