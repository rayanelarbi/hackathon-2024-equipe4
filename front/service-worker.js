self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
    console.log('Push message received:', event); // Log push event

    let notification = {
        title: 'Alerte Risque Naturel',
        body: 'Une alerte a été détectée dans les Alpes-Maritimes',
        icon: '/front/images/danger.png',
        badge: '/front/images/badge.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'Voir les détails' },
            { action: 'close', title: 'Fermer' }
        ]
    };

    try {
        if (event.data) {
            const data = event.data.json();
            notification = { ...notification, ...data };
            console.log('Notification data merged:', notification); // Log merged notification data
        }
    } catch (e) {
        console.error('Error parsing push data:', e);
    }

    event.waitUntil(
        self.registration.showNotification(notification.title, notification)
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event.notification); // Log notification click
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('http://localhost:3000/alerts')
        );
    }
});