export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
