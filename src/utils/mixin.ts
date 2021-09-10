import UA from 'ua-parser-js'
import type { OhbugEvent } from '@ohbug/types'

export function getDeviceInfo(event?: OhbugEvent<any>) {
  if (event) {
    const { device: eventDevice, sdk } = event
    if (eventDevice && sdk.platform === 'ohbug-browser') {
      const { url, title, version, language, platform, userAgent } = eventDevice

      if (userAgent) {
        const parser = new UA()
        parser.setUA(userAgent)
        const result = parser.getResult()
        const { browser, device, engine, os } = result
        return {
          url,
          title,
          version,
          language,
          platform,
          browser,
          engine,
          os,
          device,
          sdk,
        }
      }
    }

    if (eventDevice && sdk.platform === 'ohbug-miniapp') {
      const { app, version, platform, device, system, SDKVersion } =
        event.device
      return {
        app,
        version,
        platform,
        device,
        system,
        SDKVersion,
        sdk,
      }
    }
  }

  return null
}

export const isAdmin = (adminId: any, userId: any) =>
  Number(adminId) === Number(userId)
