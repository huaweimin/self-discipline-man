export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: res => {
        // 确保响应有效
        if (!res.data) {
          reject(new Error('空响应'))
          return
        }
        // 处理 HTTP 状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res)
        } else {
          reject(new Error(`HTTP 错误: ${res.statusCode}`))
        }
      },
      fail: err => reject(err)
    })
  })
}
