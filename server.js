const express = require('express');
const path = require('path');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'front')));
app.use(cors());

// VAPID keys configuration
const vapidKeys = {
    publicKey: "BCUWjwgGLcWO63n8Ac7HfvuUcPCvPxmRsejqV35sAlvEeltcvM0f3NK46FfVjcdRJ-cUSg4fPVq4wmAp9NMShJ0",
    privateKey: "F4aENv5mLSG-tTzYj2SVb6uh-p2QweV2W8gAYtKHk9k"
};

webpush.setVapidDetails(
    'mailto:guigs13@outlook.fr',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let subscriptions = [];

// Function to send notification
const sendNotification = async (subscription, data) => {
    try {
        console.log('Sending notification to:', subscription.endpoint); // Log the endpoint
        await webpush.sendNotification(subscription, JSON.stringify(data));
        console.log('Notification sent successfully to:', subscription.endpoint);
    } catch (error) {
        console.error('Error sending notification:', error);
        // Remove the subscription if it fails
        subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
    }
};

// Notify all subscribers
const notifyAll = async (data) => {
    console.log('Sending notifications to all subscribers:', subscriptions.length);
    for (const subscription of subscriptions) {
        await sendNotification(subscription, data);
    }
};

// Save subscription route
app.post('/save-subscription', (req, res) => {
    const subscription = req.body;
    if (!subscription) {
        console.error('Subscription is required'); // Log error
        return res.status(400).json({ error: 'Subscription is required' });
    }

    const exists = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
        subscriptions.push(subscription);
        console.log('New subscription saved:', subscription); // Log new subscription
    }

    res.status(201).json({ message: 'Subscription saved successfully' });
});

// Trigger alert route
app.get('/trigger-alert', async (req, res) => {
    const notificationData = {
        title: 'Alerte Catastrophe Naturelle',
        body: 'Une alerte a été détectée dans les Alpes-Maritimes',
        icon: '/front/images/danger.png',
        data: {
            timestamp: new Date().toISOString(),
            department: '06'
        }
    };

    try {
        await notifyAll(notificationData);
        res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));