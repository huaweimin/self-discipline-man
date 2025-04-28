<template>
  <view class="container">
    <view class="post-list" v-if="posts.length > 0">
      <view class="post-item" v-for="(post, index) in posts" :key="post.id || index">
        <view class="post-header">
          <image
            class="avatar"
            :src="post.avatar || '/static/default-avatar.png'"
            mode="aspectFill"
          ></image>
          <view class="user-info">
            <text class="username">{{ post.username }}</text>
            <text class="time">{{ post.createdAt }}</text>
          </view>
        </view>
        <view class="post-content">
          <text class="text">{{ post.content }}</text>
          <view class="streak-tag" v-if="post.streakDays">
            <text class="streak-days">{{ post.streakDays }}天</text>
            <text class="streak-label">已坚持</text>
          </view>
        </view>
        <view class="post-footer">
          <view class="action-btn" @tap="likePost(post)">
            <text class="icon">👍</text>
            <text class="count">{{ post.likes || 0 }}</text>
          </view>
          <view class="action-btn" @tap="commentPost(post)">
            <text class="icon">💬</text>
            <text class="count">{{ post.comments || 0 }}</text>
          </view>
          <view class="action-btn" @tap="starPost(post)">
            <text class="icon">⭐</text>
            <text class="count">{{ post.stars || 0 }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-list" v-else>
      <text class="empty-text">暂无社区动态</text>
    </view>

    <view class="floating-btn" @tap="showPostForm">
      <text class="icon">✏️</text>
    </view>

    <view class="post-form" v-if="showForm">
      <view class="form-header">
        <text>分享您的心得</text>
        <text class="close-btn" @tap="closePostForm">×</text>
      </view>
      <textarea class="post-textarea" v-model="newPost" placeholder="分享您的自律心得与经验..." />
      <button class="post-btn" @tap="submitPost" :disabled="!newPost.trim()">发布</button>
    </view>

    <view class="overlay" v-if="showForm" @tap="closePostForm"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const posts = ref([]);
const showForm = ref(false);
const newPost = ref('');
const loading = ref(false);

const userInfo = computed(() => store.state.userInfo);
const isLoggedIn = computed(() => store.state.isLoggedIn);
const streakDays = computed(() => store.state.streakDays);

const getCommunityPosts = () => store.dispatch('getCommunityPosts');

const loadPosts = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const postsData = await getCommunityPosts();
    posts.value = postsData || [];
  } catch (error) {
    console.error('加载帖子失败', error);
  } finally {
    loading.value = false;
  }
};

const showPostForm = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }

  showForm.value = true;
};

const closePostForm = () => {
  showForm.value = false;
  newPost.value = '';
};

const submitPost = async () => {
  if (!newPost.value.trim()) return;

  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const response = await uni.request({
      url: 'http://localhost:3000/api/community/posts',
      method: 'POST',
      header: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        content: newPost.value.trim(),
        streakDays: streakDays.value
      }
    });

    if (response.data.success) {
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      });
      closePostForm();
      loadPosts();
    } else {
      uni.showToast({
        title: '发布失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('发布帖子失败', error);
    uni.showToast({
      title: '发布失败，请稍后再试',
      icon: 'none'
    });
  }
};

const likePost = (post) => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }

  uni.showToast({
    title: '点赞成功',
    icon: 'success'
  });
};

const commentPost = (post) => {
  uni.showToast({
    title: '评论功能开发中',
    icon: 'none'
  });
};

const starPost = (post) => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }

  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  });
};

onMounted(() => {
  loadPosts();
});
</script>

<style lang="scss">
  .container {
    padding: 30rpx;
    background-color: #f5f6fa;
    min-height: 100vh;
  }

  .post-list {
    .post-item {
      background: #fff;
      border-radius: 20rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);

      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .user-info {
          .username {
            font-size: 28rpx;
            color: #2c3e50;
            font-weight: bold;
            display: block;
          }

          .time {
            font-size: 24rpx;
            color: #7f8c8d;
          }
        }
      }

      .post-content {
        position: relative;

        .text {
          font-size: 28rpx;
          color: #2c3e50;
          line-height: 1.6;
        }

        .streak-tag {
          display: inline-flex;
          align-items: center;
          background: #16a085;
          border-radius: 30rpx;
          padding: 10rpx 20rpx;
          margin-top: 20rpx;

          .streak-days {
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
            margin-right: 10rpx;
          }

          .streak-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: 24rpx;
          }
        }
      }

      .post-footer {
        margin-top: 30rpx;
        display: flex;
        border-top: 2rpx solid #ecf0f1;
        padding-top: 20rpx;

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            font-size: 32rpx;
            margin-right: 10rpx;
          }

          .count {
            font-size: 24rpx;
            color: #7f8c8d;
          }
        }
      }
    }
  }

  .empty-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .empty-text {
      font-size: 28rpx;
      color: #7f8c8d;
    }
  }

  .floating-btn {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background: #16a085;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 20rpx rgba(22, 160, 133, 0.3);
    z-index: 10;

    .icon {
      font-size: 40rpx;
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }

  .post-form {
    position: fixed;
    left: 30rpx;
    right: 30rpx;
    bottom: 30rpx;
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    z-index: 100;

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 32rpx;
      color: #2c3e50;

      .close-btn {
        font-size: 48rpx;
        line-height: 1;
      }
    }

    .post-textarea {
      width: 100%;
      height: 240rpx;
      border: 2rpx solid #ecf0f1;
      border-radius: 10rpx;
      padding: 20rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }

    .post-btn {
      background-color: #16a085;
      color: #fff;
      border-radius: 10rpx;
      font-size: 28rpx;

      &[disabled] {
        background-color: #95a5a6;
        color: #ecf0f1;
      }
    }
  }
</style>
