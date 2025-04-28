<template>
  <view class="container">
    <view class="header">
      <text class="title">自律打卡</text>
    </view>

    <view class="login-form">
      <view class="form-group">
        <input class="input" type="text" v-model="loginForm.username" placeholder="用户名" />
      </view>
      <view class="form-group">
        <input class="input" type="password" v-model="loginForm.password" placeholder="密码" />
      </view>
      <view class="form-actions">
        <button class="btn login" @tap="handleLogin">登录</button>
        <button class="btn register" @tap="handleRegister">注册</button>
      </view>
    </view>

    <view class="login-tip">
      <text>登录后开始您的自律之旅</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const loginForm = ref({ username: '', password: '' });

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    });
    return;
  }

  const success = await store.dispatch('login', loginForm.value);
  if (success) {
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    });
    uni.switchTab({
      url: '/pages/index/index'
    });
  } else {
    uni.showToast({
      title: '登录失败，请检查用户名和密码',
      icon: 'none'
    });
  }
};

const handleRegister = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    });
    return;
  }

  const success = await store.dispatch('register', loginForm.value);
  if (success) {
    uni.showToast({
      title: '注册成功，请登录',
      icon: 'success'
    });
  } else {
    uni.showToast({
      title: '注册失败，用户名可能已存在',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #e0f5f1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;

  .title {
    font-size: 36rpx;
    color: #2c3e50;
    text-align: center;
    font-weight: bold;
  }
}

.login-form {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  width: 90%;

  .form-group {
    margin-bottom: 20rpx;

    .input {
      width: 100%;
      height: 80rpx;
      border: 2rpx solid #ecf0f1;
      border-radius: 10rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;

    .btn {
      flex: 1;
      margin: 0 10rpx;
      border-radius: 10rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;

      &.login {
        background-color: #16a085;
        color: #ffffff;
      }

      &.register {
        background-color: #ecf0f1;
        color: #2c3e50;
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
  width: 90%;
}
</style>