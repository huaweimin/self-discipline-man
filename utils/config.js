const BASE_URL = 'http://localhost:3000' // 开发环境
// const BASE_URL = 'https://your-domain.com';  // 生产环境

export default {
  BASE_URL,
  API: {
    LOGIN: `${BASE_URL}/api/user/login`,
    REGISTER: `${BASE_URL}/api/user/register`,
    USER_INFO: `${BASE_URL}/api/user/info`,
    CHECKIN: `${BASE_URL}/api/checkin`,
    CHECKIN_TODAY: `${BASE_URL}/api/checkin/today`,
    CHECKIN_HISTORY: `${BASE_URL}/api/checkin/history`,
    CHECKIN_STATS: `${BASE_URL}/api/checkin/stats`,
    COMMUNITY_POSTS: `${BASE_URL}/api/community/posts`,
    INSPIRATION: `${BASE_URL}/api/inspiration/today`
  }
}
