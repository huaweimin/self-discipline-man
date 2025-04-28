<template>
  <view class="container">
    <view class="no-login-tip" v-if="!isLoggedIn">
      <text>请先登录后查看您的奖励和成就</text>
    </view>

    <view class="rewards-content" v-else>
      <view class="rewards-list">
        <view class="reward-item" v-for="(reward, index) in rewards" :key="index">
          <view class="reward-content">
            <view class="reward-icon">{{ reward.icon }}</view>
            <view class="reward-info">
              <text class="reward-title">{{ reward.title }}</text>
              <text class="reward-desc">{{ reward.description }}</text>
            </view>
          </view>
          <view class="reward-progress">
            <text class="days-count">{{ streakDays }}/{{ reward.requiredDays }}天</text>
            <view class="progress-bar">
              <view
                class="progress"
                :style="{ width: calculateProgress(reward.requiredDays) + '%' }"
              ></view>
            </view>
          </view>
          <view class="reward-action" v-if="streakDays >= reward.requiredDays && !reward.claimed">
            <button class="claim-btn" @tap="claimReward(reward)">领取奖励</button>
          </view>
          <view class="reward-claimed" v-if="reward.claimed">
            <text class="claimed-text">已领取</text>
          </view>
        </view>
      </view>

      <view class="achievement-section">
        <view class="section-title">已获得的成就</view>
        <view class="achievements-grid">
          <view
            class="achievement-item"
            v-for="(achievement, index) in achievements"
            :key="index"
            :class="{ unlocked: isAchievementUnlocked(achievement) }"
          >
            <view class="achievement-icon">{{ achievement.icon }}</view>
            <text class="achievement-name">{{ achievement.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const rewards = ref([
  {
    title: '坚持一周',
    description: '连续打卡7天',
    requiredDays: 7,
    icon: '🌟',
    claimed: false
  },
  {
    title: '稳步前进',
    description: '连续打卡30天',
    requiredDays: 30,
    icon: '🏆',
    claimed: false
  },
  {
    title: '意志如钢',
    description: '连续打卡100天',
    requiredDays: 100,
    icon: '👑',
    claimed: false
  }
]);
const achievements = ref([
  {
    name: '初心者',
    icon: '🌱',
    requireDays: 1
  },
  {
    name: '坚持不懈',
    icon: '💪',
    requireDays: 7
  },
  {
    name: '意志如钢',
    icon: '⚔️',
    requireDays: 30
  },
  {
    name: '重获新生',
    icon: '🦅',
    requireDays: 90
  },
  {
    name: '自律大师',
    icon: '🔥',
    requireDays: 365
  }
]);

const streakDays = computed(() => store.state.streakDays);
const isLoggedIn = computed(() => store.state.isLoggedIn);

const calculateProgress = (requiredDays) => {
  const progress = (streakDays.value / requiredDays) * 100;
  return progress > 100 ? 100 : progress;
};

const isAchievementUnlocked = (achievement) => {
  return streakDays.value >= achievement.requireDays;
};

const claimReward = (reward) => {
  reward.claimed = true;
  uni.showToast({
    title: '奖励领取成功',
    icon: 'success'
  });
};
</script>

<style lang="scss">
  .container {
    padding: 30rpx;
    background-color: #f5f6fa;
    min-height: 100vh;
  }

  .no-login-tip {
    background: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    margin-top: 40rpx;
    color: #7f8c8d;
    font-size: 28rpx;
  }

  .rewards-list {
    .reward-item {
      background: #fff;
      border-radius: 20rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);

      .reward-content {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .reward-icon {
          font-size: 48rpx;
          margin-right: 20rpx;
        }

        .reward-info {
          flex: 1;

          .reward-title {
            font-size: 32rpx;
            color: #2c3e50;
            font-weight: bold;
            display: block;
          }

          .reward-desc {
            font-size: 24rpx;
            color: #7f8c8d;
            margin-top: 4rpx;
          }
        }
      }

      .reward-progress {
        .days-count {
          font-size: 24rpx;
          color: #7f8c8d;
          margin-bottom: 10rpx;
          display: block;
        }

        .progress-bar {
          height: 16rpx;
          background: #ecf0f1;
          border-radius: 8rpx;
          overflow: hidden;

          .progress {
            height: 100%;
            background: #16a085;
            transition: width 0.3s ease;
          }
        }
      }

      .reward-action {
        margin-top: 20rpx;

        .claim-btn {
          background: #16a085;
          color: #fff;
          font-size: 24rpx;
          padding: 10rpx 30rpx;
          border-radius: 30rpx;
          line-height: 1.5;
        }
      }

      .reward-claimed {
        margin-top: 20rpx;
        text-align: right;

        .claimed-text {
          font-size: 24rpx;
          color: #16a085;
        }
      }
    }
  }

  .achievement-section {
    margin-top: 40rpx;

    .section-title {
      font-size: 32rpx;
      color: #2c3e50;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;

      .achievement-item {
        background: #fff;
        border-radius: 20rpx;
        padding: 20rpx;
        text-align: center;
        box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
        opacity: 0.5;

        &.unlocked {
          opacity: 1;
          border: 2rpx solid #16a085;
        }

        .achievement-icon {
          font-size: 48rpx;
          margin-bottom: 10rpx;
        }

        .achievement-name {
          font-size: 24rpx;
          color: #2c3e50;
        }
      }
    }
  }
</style>
