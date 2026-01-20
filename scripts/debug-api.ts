
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
            cache: 'no-store',
        });

        const data = await response.json();
        console.log('ROOT KEYS:', Object.keys(data));

        if (data.nacional) {
            console.log('NACIONAL KEYS:', Object.keys(data.nacional));
            const nocturna = data.nacional.nocturna;
            console.log('NACIONAL NOCTURNA TYPE:', typeof nocturna);
            console.log('NACIONAL NOCTURNA VALUE:', JSON.stringify(nocturna, null, 2));
        }

        if (data.provincial) {
            console.log('PROVINCIAL KEYS:', Object.keys(data.provincial));
            const nocturna = data.provincial.nocturna;
            console.log('PROVINCIAL NOCTURNA TYPE:', typeof nocturna);
            console.log('PROVINCIAL NOCTURNA VALUE:', JSON.stringify(nocturna, null, 2));
        }

    } catch (error) {
        console.error('ERROR:', error);
    }
}

testApi();
