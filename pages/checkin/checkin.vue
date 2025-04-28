<template>
  <view class="container">
    <view class="calendar">
      <view class="calendar-header">
        <text class="month">{{ currentMonth }}月</text>
        <text class="year">{{ currentYear }}</text>
      </view>
      <view class="weekdays">
        <text v-for="day in weekDays" :key="day">{{ day }}</text>
      </view>
      <view class="days">
        <view
          v-for="(day, index) in days"
          :key="index"
          :class="[
            'day',
            {
              checked: isCheckedInDay(day),
              today: isToday(day),
              empty: !day
            }
          ]"
        >
          <text>{{ day }}</text>
          <view v-if="isCheckedInDay(day)" class="check-mark">✓</view>
        </view>
      </view>
    </view>

    <view class="stats">
      <view class="stat-item">
        <text class="number">{{ monthlyCheckIns }}</text>
        <text class="label">本月打卡</text>
      </view>
      <view class="stat-item">
        <text class="number">{{ streakDays }}</text>
        <text class="label">连续打卡</text>
      </view>
      <view class="stat-item">
        <text class="number">{{ totalDays }}</text>
        <text class="label">累计打卡</text>
      </view>
    </view>

    <view class="no-login-tip" v-if="!isLoggedIn">
      <text>请先登录后查看您的打卡记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const weekDays = ref(['日', '一', '二', '三', '四', '五', '六']);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const days = ref([]);
const monthlyCheckIns = ref(0);
const totalDays = ref(0);

const streakDays = computed(() => store.state.streakDays);
const checkinHistory = computed(() => store.state.checkinHistory);
const isLoggedIn = computed(() => store.state.isLoggedIn);

const getCheckinHistory = () => store.dispatch('getCheckinHistory');
const getCheckinStats = () => store.dispatch('getCheckinStats');

const initCalendar = () => {
  const date = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();

  const firstDayWeek = date.getDay();

  days.value = Array(firstDayWeek)
    .fill('')
    .concat([...Array(lastDay)].map((_, i) => i + 1));
};

const isCheckedInDay = (day) => {
  if (!day || !checkinHistory.value.length) return false;

  const dateStr = `${currentYear.value}-${currentMonth.value.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return checkinHistory.value.some(item => item.date === dateStr);
};

const isToday = (day) => {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() + 1 &&
    currentYear.value === today.getFullYear()
  );
};

const loadCheckinData = async () => {
  if (!isLoggedIn.value) return;

  await getCheckinHistory();

  const stats = await getCheckinStats();
  if (stats) {
    totalDays.value = stats.totalDays || 0;
  }

  calculateMonthlyCheckins();
};

const calculateMonthlyCheckins = () => {
  if (!checkinHistory.value.length) {
    monthlyCheckIns.value = 0;
    return;
  }

  const currentMonthStr = `${currentYear.value}-${currentMonth.value.toString().padStart(2, '0')}`;
  monthlyCheckIns.value = checkinHistory.value.filter(item =>
    item.date.startsWith(currentMonthStr)
  ).length;
};

onMounted(() => {
  initCalendar();
  loadCheckinData();
});
</script>

<style lang="scss">
  .container {
    padding: 30rpx;
    background-color: #f5f6fa;
    min-height: 100vh;
  }

  .calendar {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);

    .calendar-header {
      text-align: center;
      margin-bottom: 30rpx;

      .month {
        font-size: 40rpx;
        font-weight: bold;
        color: #2c3e50;
      }

      .year {
        font-size: 28rpx;
        color: #7f8c8d;
        margin-left: 20rpx;
      }
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 20rpx;

      text {
        color: #7f8c8d;
        font-size: 28rpx;
      }
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10rpx;

      .day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-size: 28rpx;
        color: #2c3e50;

        &.empty {
          background: transparent;
        }

        &.checked {
          background: #16a085;
          color: #fff;
          border-radius: 50%;

          .check-mark {
            position: absolute;
            font-size: 24rpx;
            bottom: 10rpx;
          }
        }

        &.today {
          border: 2rpx solid #16a085;
          border-radius: 50%;
        }
      }
    }
  }

  .stats {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-around;

    .stat-item {
      background: #fff;
      padding: 30rpx;
      border-radius: 20rpx;
      text-align: center;
      flex: 1;
      margin: 0 20rpx;
      box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);

      .number {
        font-size: 48rpx;
        color: #16a085;
        font-weight: bold;
        display: block;
      }

      .label {
        font-size: 24rpx;
        color: #7f8c8d;
        margin-top: 10rpx;
      }
    }
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
</style>
