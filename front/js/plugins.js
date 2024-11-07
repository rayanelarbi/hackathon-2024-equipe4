(function() {
    'use strict';

    const DEPARTMENT_CODE = '06'; 
    const API_BASE_URL = 'https://georisques.gouv.fr/api/v1'; 
    const METEO_API_TOKEN = 'af3454d3131546aca50ef76a7615ebca1ef26343950bc11d7d5f6ef355ba0f61'; 
    const VIGICRUES_API_URL = 'https://cors-anywhere.herokuapp.com/http://www.vigicrues.gouv.fr/services/v1.1/TerEntVigiCru.json';
    
    const KNOWN_RISKS = new Set();
    const CHECK_INTERVAL = 900000; // 15 minutes

    const ALERT_TYPES = {
        FLOOD: 'Inondation',
        FOREST_FIRE: 'Feu de forêt',
        EARTHQUAKE: 'Tremblement de terre',
        TSUNAMI: 'Tsunami'
    };

   async function initPlugin() {
       loadKnownRisks();
       await registerServiceWorker();
       checkMultipleRiskSources();
       setInterval(checkMultipleRiskSources, CHECK_INTERVAL);
   }

   function loadKnownRisks() {
       const storedRisks = localStorage.getItem('knownRisks');
       if (storedRisks) {
           const parsedRisks = JSON.parse(storedRisks);
           parsedRisks.forEach(risk => KNOWN_RISKS.add(risk));
           console.log('Known risks loaded from localStorage:', KNOWN_RISKS); // Log known risks
       }
   }

   function checkMultipleRiskSources() {
       checkGeorisquesAPI();
       checkMeteoAPI();
       checkVigicruesAPI();
   }

   function checkGeorisquesAPI() {
       fetch(`${API_BASE_URL}/gaspar/risques?code_departement=${DEPARTMENT_CODE}`)
           .then(response => {
               if (!response.ok) {
                   throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
               }
               return response.json();
           })
           .then(data => {
               console.log('Géorisques API data received:', data); // Log received data
               checkForNewAlerts(data, 'Géorisques');
           })
           .catch(error => console.error('Erreur lors de la récupération des risques Géorisques:', error));
   }

   function checkMeteoAPI() {
       const METEO_API_URL = `https://api.meteo-concept.com/api/forecast/nextHours?token=${METEO_API_TOKEN}&insee=${DEPARTMENT_CODE}`;
       
       fetch(METEO_API_URL)
           .then(response => {
               if (!response.ok) {
                   throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
               }
               return response.json();
           })
           .then(data => {
               console.log('Météo API data received:', data); // Log received data
               if (data && data.features && data.features.length > 0) { 
                   createNotification('Alerte Météo', 'Prévisions météo indiquant un risque.');
               } else {
                   console.log('Aucune alerte météo trouvée.');
               }
           })
           .catch(error => {
               console.error('Erreur lors de la récupération des données Météo:', error);
               createNotification('Erreur Météo', 'Impossible de récupérer les données météo.');
           });
   }

   function checkVigicruesAPI() {
       fetch(VIGICRUES_API_URL)
           .then(response => {
               if (!response.ok) {
                   throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
               }
               return response.json();
           })
           .then(data => {
               console.log('Vigicrues API data received:', data); // Log received data
               if (data && data.alert_level > 2) { 
                   createNotification(ALERT_TYPES.FLOOD, `Niveau d'alerte : ${data.alert_level}`);
               }
           })
           .catch(error => console.error('Erreur lors de la récupération des données Vigicrues:', error));
   }

   function createNotification(title, body) {
       if ("Notification" in window) {
           Notification.requestPermission().then(function(permission) {
               if (permission === "granted") {
                   const options = { body, icon: getIconPath(title), tag: title };
                   
                   navigator.serviceWorker.ready.then(function(registration) {
                       registration.showNotification(title, options);
                       console.log(`Notification displayed: ${title}`); // Log notification display
                   });
               }
           });
       }
   }

   async function registerServiceWorker() {
       if ('serviceWorker' in navigator && 'PushManager' in window) {
           try {
               const registration = await navigator.serviceWorker.register('/hackathon-2024-equipe4/front/service-worker.js');
               console.log('Service Worker enregistré avec succès:', registration);
               await subscribeUser(registration);
           } catch (error) {
               console.error("Erreur d'enregistrement du Service Worker:", error);
           }
       }
   }

   async function subscribeUser(registration) {
       const applicationServerKey = urlB64ToUint8Array('BCUWjwgGLcWO63n8Ac7HfvuUcPCvPxmRsejqV35sAlvEeltcvM0f3NK46FfVjcdRJ-cUSg4fPVq4wmAp9NMShJ0'); 
       
       try {
           const subscription = await registration.pushManager.subscribe({
               userVisibleOnly: true,
               applicationServerKey: applicationServerKey
           });
           console.log('Utilisateur abonné:', subscription);
           await sendSubscriptionToServer(subscription);
       } catch (error) {
           console.error("Échec de l'abonnement:", error);
       }
   }

   async function sendSubscriptionToServer(subscription) {
       try {
           const response = await fetch('http://localhost:3000/save-subscription', { 
               method: 'POST', 
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(subscription),
           });
           
           if (!response.ok) throw new Error('Network response was not ok');
           
           const data = await response.json();
           console.log('Abonnement sauvegardé:', data);
       } catch (error) {
           console.error("Erreur lors de la sauvegarde de l'abonnement:", error);
       }
   }

   function urlB64ToUint8Array(base64String) {
       const padding = '='.repeat((4 - base64String.length % 4) % 4);
       const base64 = (base64String + padding)
           .replace(/\-/g, '+')
           .replace(/_/g, '/');

       const rawData = window.atob(base64);
       const outputArray = new Uint8Array(rawData.length);

       for (let i = 0; i < rawData.length; ++i) {
           outputArray[i] = rawData.charCodeAt(i);
       }
       
       return outputArray;
   }

   // Test notification function
   window.testNotification = async function() { // Ensure it's defined in the global scope
       try {
           const response = await fetch('http://localhost:3000/trigger-alert');
           const data = await response.json();
           console.log('Test notification sent:', data);
       } catch (error) {
           console.error('Error sending test notification:', error);
       }
   };

   window.addEventListener('load', initPlugin);
})();