let url = ''

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', (event) => {
  const { title, body, link, icon } = event.data.json()
  url = link
  event.waitUntil(
    // eslint-disable-next-line no-restricted-globals
    self.self.registration.showNotification(title, {
      body,
      icon,
    })
  )
})

// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    // eslint-disable-next-line no-undef
    clients
      .matchAll({
        type: 'window',
      })
      .then(() => {
        // eslint-disable-next-line no-undef
        if (clients.openWindow) {
          // eslint-disable-next-line no-undef
          clients.openWindow(url)
        }
      })
  )
})
