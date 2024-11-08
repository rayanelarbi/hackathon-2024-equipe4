const DEPARTMENT_CODE = '06';
const API_BASE_URL = 'https://georisques.gouv.fr/api/v1';
const METEO_API_TOKEN = 'af3454d3131546aca50ef76a7615ebca1ef26343950bc11d7d5f6ef355ba0f61';
const VIGICRUES_API_URL = 'https://cors-anywhere.herokuapp.com/http://www.vigicrues.gouv.fr/services/v1.1/TerEntVigiCru.json';

const CHECK_INTERVAL = 900000; // 15 minutes

const ALERT_TYPES = {
    FLOOD: 'Inondation',
    FOREST_FIRE: 'Feu de forêt',
    EARTHQUAKE: 'Tremblement de terre',
    TSUNAMI: 'Tsunami'
};

function checkMultipleRiskSources() {
    checkGeorisquesAPI();
    checkMeteoAPI();
    checkVigicruesAPI();
}

function checkGeorisquesAPI() {
    fetch(`${API_BASE_URL}/gaspar/risques?code_departement=${DEPARTMENT_CODE}`)
        .then(response => response.json())
        .then(data => {
            console.log('Géorisques API data received:', data);
            // Implement logic to check for new alerts
        })
        .catch(error => console.error('Erreur lors de la récupération des risques Géorisques:', error));
}

function checkMeteoAPI() {
    const METEO_API_URL = `https://api.meteo-concept.com/api/forecast/nextHours?token=${METEO_API_TOKEN}&insee=${DEPARTMENT_CODE}`;
    
    fetch(METEO_API_URL)
        .then(response => response.json())
        .then(data => {
            console.log('Météo API data received:', data);
            if (data && data.features && data.features.length > 0) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'images/icon128.png',
                    title: 'Alerte Météo',
                    message: 'Prévisions météo indiquant un risque.'
                });
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des données Météo:', error));
}

function checkVigicruesAPI() {
    fetch(VIGICRUES_API_URL)
        .then(response => response.json())
        .then(data => {
            console.log('Vigicrues API data received:', data);
            if (data && data.alert_level > 2) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'images/icon128.png',
                    title: ALERT_TYPES.FLOOD,
                    message: `Niveau d'alerte : ${data.alert_level}`
                });
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des données Vigicrues:', error));
}

chrome.alarms.create('checkRisks', { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkRisks') {
        checkMultipleRiskSources();
    }
});

checkMultipleRiskSources();