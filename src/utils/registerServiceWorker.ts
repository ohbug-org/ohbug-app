import { publicVapidKey } from '../config'

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function registerServiceWorker() {
  return navigator.serviceWorker
    .register('/service-worker.js', { scope: '/' })
    .then((registration) => {
      // eslint-disable-next-line no-console
      console.log('Service worker successfully registered.')

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      }
      return registration.pushManager.subscribe(subscribeOptions)
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Unable to register service worker.', err)
    })
}
export function askNotificationPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result)
    })

    if (permissionResult) {
      permissionResult.then(resolve, reject)
    }
  }).then((permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error(
        '获取浏览器通知权限失败，请检查浏览器 网站设置 - 权限 中通知选项是否允许'
      )
    }
  })
}
